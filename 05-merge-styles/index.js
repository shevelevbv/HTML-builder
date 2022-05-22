const path = require('path');
const fs = require('fs');

const stylesFolderPath = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(stylesFolderPath, (error, files) => {
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