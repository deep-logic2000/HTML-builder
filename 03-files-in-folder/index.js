const { stdout } = process;
const path = require("path");
const fs = require("node:fs/promises");
const { stat } = fs;

const absPathSecretDir = path.join(__dirname, "secret-folder");

const getInfo = async (absPathSecretDir) => {
  const files = await fs.readdir(absPathSecretDir, { withFileTypes: true });
  for (const file of files) {
    if (!file.isDirectory()) {
      const fileStat = await stat(path.join(absPathSecretDir, file.name));
      const fileParse = path.parse(file.name);
      stdout.write(
        `${fileParse.name} - ${fileParse.ext.replace(".", "")} - ${
          fileStat.size
        } bytes\n`
      );
    }
  }
};

getInfo(absPathSecretDir);
