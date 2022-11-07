const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const bundlePath = path.join(__dirname, 'project-dist');
const cssPath = path.join(__dirname, 'styles');
const writeableStream  = fs.createWriteStream(path.join(bundlePath, 'bundle.css'));

let promise = new Promise((resolve, reject) => {
  resolve(fsPromises.readdir(path.join(cssPath), {withFileTypes: true}));
});

promise
  .then(files => files.forEach(file => {
    const filePath = path.join(cssPath, file.name);
    const fileExt = path.extname(filePath); 

    if(file.isFile() && fileExt === '.css') {
      const readableStream = fs.createReadStream(filePath, 'utf-8');
      readableStream.pipe(writeableStream );
    }
  }))
  .catch(error => console.log(error));
