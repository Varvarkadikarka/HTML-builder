const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
let newText;

fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Напишите, пожалуйста, любую абракадабру\n');
stdin.on('data', data => {

  if (data.toString().trim() === 'exit') {
    process.exit();
  }

  newText = data.toString();

  fs.appendFile(path.join(__dirname, 'text.txt'), newText,
    err => {
      if (err) throw err;
    });
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => stdout.write('\nЛюдей теряют только раз,\nИ след, теряя, не находят,\nА человек гостит у вас,\nПрощается и в ночь уходит.'));
