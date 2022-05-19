/**
 * The program prints the file text.txt in the console.
 */

// Importing CommonJS modules.
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(filePath, 'utf-8');
const {stdout} = process;
let data = '';

// Registering EventEmitter listeners for implementing tasks when events are triggered.
readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => stdout.write(data));
readableStream.on('error', error => console.error(error.message));

