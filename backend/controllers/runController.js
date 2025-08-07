const axios = require("axios");

exports.runCode = async (req, res) => {
  const { language, code, input } = req.body;

  try {
    const response = await axios.post("http://localhost:8000/run", {
      lang: language,
      code,
      input,
    });
    res.json(response.data);
  } catch (error) {
    console.error("Run code error:", error.message);
    res.status(500).json({ error: "Compiler service failed" });
  }
};
