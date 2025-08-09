const Problem = require('../models/Problem');

exports.listProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}, { title: 1 }).lean();
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).lean();
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    // return problem but hide full test case outputs optionally. here we return everything
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
