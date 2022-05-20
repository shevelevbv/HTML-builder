/**
 * The program scans a folder and selects files (filtering out directories).
 * It then prints the names of the files, their extensions, and sizes in the console.
 */

// Importing CommonJS modules.
const fs = require('fs');
const path = require('path');
const {stdout} = process;

const filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, {withFileTypes: true}, (error, files) => {
  if (error) return console.error(error.message);
  files.filter(file => file.isFile()).forEach(file => fs.stat(path.join(filePath, file.name), (error, stats) => {
    if (error) return console.error(error.message);
    const fileExt = path.extname(path.join(filePath, file.name));
    stdout.write(`${path.basename(path.join(filePath, file.name), fileExt)} - ${fileExt.replace('.', '')} - ${stats.size / 1000}kb\n`);
  }));
});