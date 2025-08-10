const axios = require('axios');
const Problem = require('../models/Problem');

const COMPILER_URL = process.env.COMPILER_URL || 'http://3.27.119.93:8000/run';

// helper: normalize output (trim trailing newlines/spaces)
function normalize(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/\r/g, '').trim();
}

exports.runSubmission = async (req, res) => {
  try {
    const { problemId, code, language, customInput, runType } = req.body;
    if (!problemId || !code || !language) {
      return res.status(400).json({ error: 'problemId, code and language are required' });
    }

    // Fetch problem to get test cases if needed
    const problem = await Problem.findById(problemId).lean();
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    // If runType is "run" then run on custom input only
    if (runType === 'run') {
      try {
        const payload = {
          language,
          code,
          input: customInput || '',
        };

        const compResp = await axios.post(COMPILER_URL, payload, { timeout: 20000 }); // 20s timeout
        const compilerData = compResp.data;
        let rawOut = '';
        if (typeof compilerData === 'string') rawOut = compilerData;
        else if (typeof compilerData === 'object' && compilerData.output !== undefined) rawOut = compilerData.output;
        else if (compilerData.stdout) rawOut = compilerData.stdout;
        else rawOut = JSON.stringify(compilerData);

        const output = normalize(rawOut);

        // Return single test output with custom input
        return res.json({
          total: 1,
          passed: 1,
          failed: 0,
          details: [{
            index: 1,
            input: customInput || '',
            expected: '',
            output,
            status: 'passed',
          }]
        });
      } catch (err) {
        const message = err.response?.data || err.message || String(err);
        return res.json({
          total: 1,
          passed: 0,
          failed: 1,
          details: [{
            index: 1,
            input: customInput || '',
            expected: '',
            output: '',
            status: 'error',
            error: String(message)
          }]
        });
      }
    }

    // Otherwise, runType is "submit" or missing => run all test cases
    const results = [];
    let passed = 0;

    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i];

      try {
        const payload = {
          language,
          code,
          input: tc.input || '',
        };

        const compResp = await axios.post(COMPILER_URL, payload, { timeout: 20000 });
        const compilerData = compResp.data;
        let rawOut = '';
        if (typeof compilerData === 'string') rawOut = compilerData;
        else if (typeof compilerData === 'object' && compilerData.output !== undefined) rawOut = compilerData.output;
        else if (compilerData.stdout) rawOut = compilerData.stdout;
        else rawOut = JSON.stringify(compilerData);

        const out = normalize(rawOut);
        const expected = normalize(tc.output);
        const status = out === expected ? 'passed' : 'failed';

        if (status === 'passed') passed++;

        results.push({
          index: i + 1,
          input: tc.input,
          expected,
          output: out,
          status,
        });
      } catch (err) {
        const message = err.response?.data || err.message || String(err);
        results.push({
          index: i + 1,
          input: tc.input,
          expected: normalize(tc.output),
          output: '',
          status: 'error',
          error: String(message),
        });
      }
    }

    return res.json({
      problemId,
      total: problem.testCases.length,
      passed,
      failed: problem.testCases.length - passed,
      details: results,
    });
  } catch (err) {
    console.error('Run submission error:', err);
    return res.status(500).json({ error: err.message });
  }
};
