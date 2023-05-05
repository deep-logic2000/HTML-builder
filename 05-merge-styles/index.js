const { readdir, readFile } = require("node:fs/promises");
const { join, extname } = require("node:path");
const { createWriteStream } = require("fs");

const sourceDir = join(__dirname, "styles");
const destinationPath = join(__dirname, "project-dist", "bundle.css");

const bundleCss = async () => {
  const sourceFiles = await readdir(sourceDir, { withFileTypes: true });
  const outputStream = createWriteStream(destinationPath);

  for (const file of sourceFiles) {
    try {
      if (allowedToWrite(file)) {
        const stylesInFile = await readFile(
          join(sourceDir, file.name),
          "utf-8"
        );
        outputStream.write(`${stylesInFile}\n`);
      }
    } catch (err) {
      console.error(err.message);
    }
  }
};

function allowedToWrite(file) {
  if (file.isFile() && extname(file.name) === ".css") return true;
  return false;
}
bundleCss();
