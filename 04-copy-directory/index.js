const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

function copyDir() {
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err)
      console.log('Failed to read a directory');
    else {
      files.forEach(file => {
        const filePath = `${path.join(__dirname, 'files', file)}`;
        const copy = `${path.join(__dirname, 'files-copy', file)}`;
        fs.copyFile(filePath, copy, (err) => {
          if (err) {
            console.log('Failed to copy a file');
          }
        });
      });
    }
  });
}  

function clearDir() {
  fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
    if (err)
      console.log('Failed to read a directory');
    else {
      files.forEach(file => { 
        fs.unlink(path.join(__dirname, 'files-copy', file), (err) => {
          if (err) {
            console.log('Failed to deleate a file');
          }
        }); 
      });
      copyDir();  
    }});
}

function isEmpryDir() {
  fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
    if (err)
      console.log('Failed to read a directory');
    else {
      if (files.length !== 0) {
        clearDir();
      } else {
        copyDir();
      }
    }
  });
}

fsPromises.mkdir(path.join(__dirname, 'files-copy'), {recursive: true}, (err) => {
  if (err) {
    console.log('Failed to make a directory');
  }
}).then(isEmpryDir());