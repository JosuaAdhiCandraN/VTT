const fs = require('fs');
const path = require('path');

const cleanTempFolder = () => {
  const tempFolder = path.join(__dirname, '../temp');
  fs.readdir(tempFolder, (err, files) => {
    if (err) console.error('Error reading temp folder:', err);

    files.forEach((file) => {
      const filePath = path.join(tempFolder, file);
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting file:', filePath);
      });
    });
  });
};

module.exports = cleanTempFolder;
