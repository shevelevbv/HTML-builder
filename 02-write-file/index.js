/**
 * The program accepts text inputs from the user and writes them to text.txt.
 */

// Importing CommonJS modules.
const path = require('path');
const fs = require('fs');
const readline = require('readline');

const {stdin, stdout} = process;
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rl = readline.createInterface(stdin, stdout);

rl.setPrompt('Hi! Please enter some text here (enter \'exit\' or press Ctrl+C to exit):\n');
rl.prompt();

rl.on('line', line => {
  if (line.trim() === 'exit') process.exit();
  output.write(line + '\n');
});

rl.on('SIGINT', () => process.exit());
rl.on('error', error => console.error(error.message));

process.on('exit', () => stdout.write('Have a nice day!\n'));