const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const executeCode = require("./executor");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/run", async (req, res) => {
  const { language, code, input } = req.body;

  console.log("📥 Received code execution request:");
  console.log("🗣️ Language:", language);
  console.log("📄 Code:", code);
  console.log("📝 Input:", input);

  try {
    const output = await executeCode(language, code, input);
    res.send({ output });
  } catch (err) {
    console.error("❌ Code execution error:", err);
    res.status(500).send({ error: err });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`🚀 Docker-based Compiler running at http://localhost:${PORT}`);
});