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
      .replace(/w-\[95%\] md:w-\[95%\]/g, 'w-[95%]')
      .replace(/w-\[95%\] w-\[95%\]/g, 'w-[95%]')
      .replace(/w-\[95%\] mx-auto my-4 md:w-\[95%\] md:max-w-2xl/g, 'w-[95%] mx-auto my-4 md:max-w-2xl')
      .replace(/w-\[95%\] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto/g, 'w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto')
      .replace(/w-\[95%\] md:max-w-2xl lg:w-\[95%\] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl/g, 'w-[95%] md:max-w-2xl lg:max-w-5xl xl:max-w-7xl');
    
    // general cleanup for duplicate w-[95%]
    newContent = newContent.replace(/(w-\[95%\]\s*)+/g, 'w-[95%] ');
    newContent = newContent.replace(/w-\[95%\] md:w-\[95%\]/g, 'w-[95%]');

    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent);
      console.log('Cleaned', filePath);
    }
  }
});
