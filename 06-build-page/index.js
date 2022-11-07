const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const bundlePath = path.join(__dirname, 'project-dist');
const cssPath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const componentsPath = path.join(__dirname, 'components');

const writeableStream  = fs.createWriteStream(path.join(bundlePath, 'style.css'));

//Making a directory

let promise = new Promise((resolve, reject) => {
  fsPromises.mkdir(path
    .join(bundlePath), {recursive: true}, (err) => {
    if (err) {
      console.log('Failed to make a directory');
    }
  });
});

promise.then(addHtml());

// Bundling CSS files

const readFiles = new Promise((resolve, reject) => {
  resolve(fsPromises.readdir(path.join(cssPath), {withFileTypes: true}));
});

readFiles
  .then(files => files.forEach(file => {
    const filePath = path.join(cssPath, file.name);
    const fileExt = path.extname(filePath); 
      
    if(file.isFile() && fileExt === '.css') {
      const readableStream = fs.createReadStream(filePath, 'utf-8');
      readableStream.pipe(writeableStream );
    }
  }));

// Adding assets` folder

fsPromises.mkdir(path.join(bundlePath, 'assets'), {recursive: true}, (err) => {
  if (err) {
    console.log('Failed to make a directory');
  }
}).then(copyDir());

function copyDir() {
  fs.readdir(path.join(assetsPath), (err, folders) => {
    if (err)
      console.log('Failed to read a directory');
    else {
      folders.forEach(folder => {
        fsPromises.mkdir(path.join(bundlePath, 'assets', folder), {recursive: true}).then(copyFiles(folder));
      });
    }
  });
}

function copyFiles(folder) {
  fs.readdir(path.join(__dirname, 'assets', folder), (err, files) => {
    if (err)
      console.log('Failed to read a directory');
    else {
      files.forEach(file => {
        const filePath = `${path.join(__dirname, 'assets', folder, file)}`;
        const copy = `${path.join(bundlePath, 'assets', folder, file)}`;
        fs.copyFile(filePath, copy, (err) => {
          if (err) {
            console.log('Failed to copy a file');
          }
        });
      });
    }
  });
}

// Adding HTML

function addHtml() {
  fs.readdir(componentsPath, {withFileTypes: true}, (err, files) => {
    if (err) {
      console.log('Failed to read a folder');
    }
    fs.readFile(path.join(__dirname, 'template.html'), 'utf8', (err, file) => {
      if (err) {
        console.log('Failed to read a file');
      }
      files.forEach((component) => {
        const fileParse = path.parse(`${componentsPath}/${component.name}`);
        const fileExt = fileParse.ext; 
        if (component.isFile() && fileExt === '.html') {
          fs.readFile(`${componentsPath}/${component.name}`, 'utf8', (err, tagText) => {
            if (err) {
              console.log('Failed to read a file in the component`s folder');
            }
            file = file.replace(`{{${fileParse.name}}}`, tagText);
            fsPromises.writeFile(path.join(bundlePath, 'index.html'), file, (err) => {
              if (err) {
                console.log('Failed to write a file');
              }
            });
          }); 
        }
      });
    });
  });
}