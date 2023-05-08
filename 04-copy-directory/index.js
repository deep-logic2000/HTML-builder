const { rm, mkdir, readdir, copyFile } = require("node:fs/promises");
const { join } = require("node:path");

const sourceDir = join(__dirname, "files");
const destinationDir = join(__dirname, "files-copy");

const copyDir = async (sourceDir, destinationDir) => {
  await rm(destinationDir, { recursive: true, force: true });
  await mkdir(destinationDir, { recursive: true });

  copyFiles(sourceDir, destinationDir);
};

const copyFiles = async (sourceDir, destinationDir) => {
  const sourceFiles = await readdir(sourceDir, {
    withFileTypes: true,
  });
  for (const file of sourceFiles) {
    if (file.isDirectory()) {
      await mkdir(join(destinationDir, file.name), { recursive: true });
      await copyFiles(
        join(sourceDir, file.name),
        join(destinationDir, file.name)
      );
      continue;
    }
    await copyFile(join(sourceDir, file.name), join(destinationDir, file.name));
  }
};

copyDir(sourceDir, destinationDir);
