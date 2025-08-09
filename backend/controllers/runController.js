const axios = require('axios');
const Problem = require('../models/Problem');

const COMPILER_URL = process.env.COMPILER_URL || 'http://localhost:8000/run';

// helper: normalize output (trim trailing newlines/spaces)
function normalize(s) {
  if (s === null || s === undefined) return '';
  return String(s).replace(/\r/g, '').trim();
}

exports.runSubmission = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    if (!problemId || !code || !language) return res.status(400).json({ error: 'problemId, code and language are required' });

    const problem = await Problem.findById(problemId).lean();
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const results = [];
    let passed = 0;
    for (let i = 0; i < problem.testCases.length; i++) {
      const tc = problem.testCases[i];

      // call compiler microservice
      try {
        const payload = {
          language,            // examples: 'python' or 'cpp'
          code,
          input: tc.input || ''
        };

        const compResp = await axios.post(COMPILER_URL, payload, { timeout: 20000 }); // 20s per test
        // compiler should return { output: "..." } or plain string — handle both
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
          status
        });
      } catch (err) {
        // compiler error / timeout / runtime error
        const message = err.response?.data || err.message || String(err);
        results.push({
          index: i + 1,
          input: tc.input,
          expected: normalize(tc.output),
          output: '',
          status: 'error',
          error: String(message)
        });
      }
    }

    res.json({
      problemId,
      total: problem.testCases.length,
      passed,
      failed: problem.testCases.length - passed,
      details: results
    });
  } catch (err) {
    console.error('Run submission error:', err);
    res.status(500).json({ error: err.message });
  }
};
