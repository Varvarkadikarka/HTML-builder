const fs = require('fs/promises');
const path = require('path');

const files = fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true});

files.then(files => files.forEach(file => {
  if(file.isFile()) {
    const filePath = path.join(__dirname, 'secret-folder', file.name);
    const fileName = path.parse(filePath).name;
    const fileExt = path.extname(filePath).slice(1);
    fs.stat(filePath).then(stats => {
      console.log(`${fileName} - ${fileExt} - ${stats.size}b`);
    });  
  }
}));