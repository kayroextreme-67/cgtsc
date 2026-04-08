const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
      .replace(/max-w-3xl/g, 'w-[95%] md:max-w-2xl lg:max-w-3xl')
      .replace(/max-w-4xl/g, 'w-[95%] md:max-w-2xl lg:max-w-4xl')
      .replace(/max-w-md/g, 'w-[95%] md:max-w-md')
      .replace(/max-w-2xl/g, 'w-[95%] md:max-w-2xl');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log('Updated', filePath);
    }
  }
});
