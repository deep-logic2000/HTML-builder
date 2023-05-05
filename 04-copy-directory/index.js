const { rm, mkdir, readdir, copyFile, unlink } = require("node:fs/promises");
const { join } = require("node:path");

const sourceDir = join(__dirname, "files");
const destinationDir = join(__dirname, "files-copy");

const copyDir = async (sourceDir, destinationDir) => {
  await rm(destinationDir, { recursive: true, force: true });
  await mkdir(destinationDir, { recursive: true });

  const sourceFiles = await readdir(sourceDir);

  copyFiles(sourceFiles);
};

const copyFiles = async (sourceFiles) => {
  for (const file of sourceFiles) {
    await copyFile(join(sourceDir, file), join(destinationDir, file));
  }
};

copyDir(sourceDir, destinationDir);
