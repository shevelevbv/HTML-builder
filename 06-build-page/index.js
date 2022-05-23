const path = require('path');
const fs = require('fs');

const readableStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
let data = '';

readableStream.on('data', chunk => data += chunk);
readableStream.on('end', findMatches);
readableStream.on('error', error => console.error(error.message));

function findMatches() {
  const matches = data.match(/{{.*}}/g);
  matches.forEach(match => {
    getFileContent(match.replace(/[{}]/g, '')).then(text => {
      data = data.replace(match, text);
      fs.writeFile(path.join(__dirname, 'index.html'), data, error => {
        if (error) return console.error(error.message);
      }); 
    }); 
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