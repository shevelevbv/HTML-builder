const path = require('path');
const fs = require('fs');

makeDir(path.join(__dirname, 'project-dist'));

const readableStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
const originalFolder = path.join(__dirname, 'assets');
const copyFolder = path.join(__dirname, 'project-dist', 'assets');

let data = '';

readableStream.on('data', chunk => data += chunk);
readableStream.on('end', changeText);
readableStream.on('error', error => console.error(error.message));

function changeText() {
  const matches = data.match(/{{.*}}/g);
  matches.forEach(match => {
    getFileContent(match.replace(/[{}]/g, '')).then(text => {
      data = data.replace(match, text);
      fs.writeFile(path.join(__dirname, 'project-dist', 'index.html'), data, error => {
        if (error) return console.error(error.message);
      }); 
    }).catch(error => console.error(error.message)); 
  });
}

function getFileContent(fileName) {
  return new Promise ((resolve, reject) => {
    const readableStream = fs.createReadStream(path.join(__dirname, 'components', `${fileName}.html`));
    let data = '';
    readableStream.on('data', chunk => data += chunk);
    readableStream.on('error', error => reject(error.message));
    readableStream.on('end', () => resolve(data));
  });
}

/**
 * Checking if the folder exists. If it doesn't, the program invokes a function copying the folder.
 * If the folder exists, it gets removed, and the function for copying gets invoked.
 */
fs.access(copyFolder, error => {
  if (error) copyDir(originalFolder, copyFolder);
  else {
    fs.rm(copyFolder, {recursive: true}, error => {
      if (error) console.error(error.message); 
      copyDir(originalFolder, copyFolder);
    });
  }
});

/**
 *  The function for creating a new directory.
 */
function makeDir(destFolderPath) {
  fs.mkdir(destFolderPath, {recursive: true}, error => {
    if (error) return console.error(error.message);
  });
}

/**
 * The function for copying files.
 * @param {*} sourceFilePath 
 * @param {*} destFilePath 
 */
function copyFile(sourceFilePath, destFilePath) {
  fs.copyFile(sourceFilePath, destFilePath, error => {
    if (error) return console.error(error.message);
  });
}

/**
 * The function for copying directories. First, it creates an empty directory for storing copies.
 * Then, it parses the source directory, and if an item is a file, it copies the file into the
 * directory. If the item is a directory, the function creates a subfolder recursively and fills
 * it with copied files.
 * @param {*} sourceFolderPath 
 * @param {*} destFolderPath 
 */
function copyDir(sourceFolderPath, destFolderPath) {
  makeDir(destFolderPath);

  fs.readdir(sourceFolderPath, (error, files) => {
    if (error) return console.error(error.message);
    files.forEach(file => {
      fs.stat(path.join(sourceFolderPath, file), (error, stats) => {
        if (error) return console.error(error.message);
        if (stats.isFile()) {
          copyFile(path.join(sourceFolderPath, file), path.join(destFolderPath, file));
        } else if (stats.isDirectory()) {
          copyDir(path.join(sourceFolderPath, file), path.join(destFolderPath, file));
        }
      });   
    });
  });
}

const stylesFolderPath = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));

/**
 * The method searches for CSS files within a directory and bundles the styles into a single file.
 */
fs.readdir(stylesFolderPath, (error, files) => {
  if (files.indexOf('footer.css') > -1) {
    files.push(files.splice(files.indexOf('footer.css'), 1)[0]);
  }
  files.forEach(file => {
    if (error) return console.error(error.message);
    const filePath = path.join(stylesFolderPath, file);
    fs.stat(filePath, (error, stats) => {
      if (error) return console.error(error.message);
      if (stats.isFile() && path.extname(filePath) === '.css') {
        const readableStream = fs.createReadStream(filePath, 'utf-8');
        readableStream.pipe(writeStream);
      }
    });
  });
});