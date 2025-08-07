const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuid } = require("uuid");

// Directory to store temporary code files
const tempDir = path.join(__dirname, "temp");
fs.ensureDirSync(tempDir);

// File names per language
const fileNames = {
  cpp: "main.cpp",
  python: "main.py",
  java: "Main.java",
};

// Dockerfiles per language
const dockerfiles = {
  cpp: path.join(__dirname, "docker/cpp.dockerfile"),
  python: path.join(__dirname, "docker/python.dockerfile"),
  java: path.join(__dirname, "docker/java.dockerfile"),
};

const executeCode = (language, code, input) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("📥 Received code execution request:");
      console.log("🗣️ Language:", language);
      console.log("📄 Code:", code);
      console.log("📝 Input:", input);

      // 1. Create unique job directory
      const jobId = uuid();
      const jobPath = path.join(tempDir, jobId);
      await fs.ensureDir(jobPath);
      console.log("📂 Job Path:", jobPath);

      // 2. Create code and input files
      const codeFileName = fileNames[language];
      const codeFilePath = path.join(jobPath, codeFileName);
      const inputFilePath = path.join(jobPath, "input.txt");

      await fs.writeFile(codeFilePath, code);
      await fs.writeFile(inputFilePath, input || "");

      const files = await fs.readdir(jobPath);
      console.log("📁 Written files in jobPath:", files);

      const codeContent = await fs.readFile(codeFilePath, "utf-8");
      const inputContent = await fs.readFile(inputFilePath, "utf-8");
      console.log("📄 Code content:\n", codeContent);
      console.log("📝 Input content:\n", inputContent);

      // 3. Build and run Docker
      const dockerfilePath = dockerfiles[language];
      const imageTag = `${language}-image-${jobId}`;

      const buildCommand = `docker build --no-cache -f "${dockerfilePath}" -t ${imageTag} "${jobPath}"`;
      console.log("🐳 Build command:", buildCommand);

      // 4. Build first
      exec(buildCommand, async (buildErr, buildStdout, buildStderr) => {
        if (buildErr) {
          await fs.remove(jobPath);
          console.error("❌ Build Error:", buildStderr || buildErr.message);
          return reject(buildStderr || buildErr.message);
        }

        console.log("✅ Build successful");

        // 5. Run the container based on language
        let runCommand;
        
        if (language === 'cpp') {
          // For C++, run directly without volume mounting to preserve compiled executable
          runCommand = `docker run --rm ${imageTag}`;
        } else {
          // For other languages, use volume mounting
          runCommand = `docker run --rm -v "${jobPath}:/app" ${imageTag}`;
        }

        console.log("🐳 Run command:", runCommand);

        exec(runCommand, async (runErr, stdout, stderr) => {
          // Clean up temp directory and Docker image
          await fs.remove(jobPath);
          exec(`docker rmi ${imageTag}`, (cleanupErr) => {
            if (cleanupErr) {
              console.log("⚠️ Warning: Could not remove Docker image:", cleanupErr.message);
            }
          });

          if (runErr) {
            console.error("❌ Runtime Error:", stderr || runErr.message);
            return reject(stderr || runErr.message);
          }

          console.log("✅ Output:\n", stdout);
          return resolve(stdout);
        });
      });
    } catch (error) {
      console.error("❌ Code execution error:", error.message);
      return reject(error.message);
    }
  });
};

module.exports = executeCode;