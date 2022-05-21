/**
 * The program creates a copy of a folder and its contents, including subfolders.
 */

const fs = require('fs');
const path = require('path');

const originalFolder = path.join(__dirname, 'files');
const copyFolder = path.join(__dirname, 'files-copy');

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

