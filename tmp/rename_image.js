const fs = require('fs');
const path = require('path');
const oldPath = path.join(__dirname, 'public', 'About car.png');
const newPath = path.join(__dirname, 'public', 'about_car.png');

if (fs.existsSync(oldPath)) {
  fs.renameSync(oldPath, newPath);
  console.log('Renamed successfully');
} else {
  console.log('File not found at: ' + oldPath);
  // List files to see what's there
  console.log('Files in public:');
  console.log(fs.readdirSync(path.join(__dirname, 'public')));
}
