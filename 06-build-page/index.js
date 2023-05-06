const { rm, mkdir, readdir, copyFile, readFile } = require("node:fs/promises");
const { join, extname, parse } = require("node:path");
const { createWriteStream, createReadStream } = require("fs");

const sourceHtmlMainFilePath = join(__dirname, "template.html");
const sourceDirHtmlComponents = join(__dirname, "components");
const sourceDirStyles = join(__dirname, "styles");
const sourceAssetsDir = join(__dirname, "assets");
const destinationDir = join(__dirname, "project-dist");
const destinationHtmlPath = join(destinationDir, "index.html");
const destinationStylesPath = join(destinationDir, "style.css");
const destinationAssetsDir = join(destinationDir, "assets");

const createDistDir = async (destinationDir) => {
  await rm(destinationDir, { recursive: true, force: true });
  await mkdir(destinationDir, { recursive: true });
};

const copyAssetsFiles = async (sourceAssetsDir, destinationAssetsDir) => {
  const sourceAssetsItems = await readdir(sourceAssetsDir, {
    withFileTypes: true,
  });
  for (const item of sourceAssetsItems) {
    if (item.isDirectory()) {
      await mkdir(join(destinationAssetsDir, item.name), { recursive: true });
      await copyAssetsFiles(
        join(sourceAssetsDir, item.name),
        join(destinationAssetsDir, item.name)
      );
      continue;
    }
    await copyFile(
      join(sourceAssetsDir, item.name),
      join(destinationAssetsDir, item.name)
    );
  }
};

const bundleCss = async () => {
  const sourceCssFiles = await readdir(sourceDirStyles, {
    withFileTypes: true,
  });
  const outputCssStream = createWriteStream(destinationStylesPath);

  for (const file of sourceCssFiles) {
    try {
      if (allowedToWrite(file)) {
        const stylesInFile = await readFile(join(sourceDirStyles, file.name), {
          encoding: "utf8",
        });
        outputCssStream.write(`${stylesInFile}\n`);
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

const bundleHtml = async () => {
  const sourceHtmlFiles = await readdir(sourceDirHtmlComponents, {
    withFileTypes: true,
  });
  let readableStream = createReadStream(sourceHtmlMainFilePath, "utf-8");
  let writeableStream = createWriteStream(destinationHtmlPath);

  readableStream.on("data", async function (chunk) {
    for (const htmlSection of sourceHtmlFiles) {
      const sectionName = parse(htmlSection.name).name;
      if (chunk.indexOf(sectionName) !== -1) {
        const contentHtmlFile = await readFile(
          join(sourceDirHtmlComponents, htmlSection.name),
          "utf-8"
        );
        chunk = chunk.replace(`{{${sectionName}}}`, contentHtmlFile);
      }
    }
    writeableStream.write(chunk);
  });
};

const createProject = async () => {
  try {
    await createDistDir(destinationDir);
    await copyAssetsFiles(sourceAssetsDir, destinationAssetsDir);
    await bundleCss();
    await bundleHtml();
  } catch (err) {
    console.error(err.message);
  }
};

createProject();
