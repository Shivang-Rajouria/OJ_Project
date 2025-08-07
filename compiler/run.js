const executeCode = require("./executor");

module.exports = async (req, res) => {
  const { language, code, input } = req.body;

  try {
    const output = await executeCode(language, code, input);
    res.json({ output });
  } catch (error) {
    console.error("❌ Code execution error:", error);
    res.status(500).json({ error: "Compiler service failed" });
  }
};