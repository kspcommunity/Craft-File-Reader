const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Open file dialog to select a .craft file
const filePath = 'test.craft';
const fileStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

// Initialize craftInfo object to store field-value pairs
const craftInfo = {
  filename: path.basename(filePath),
  fields: {}
};

// Read each line of the file
rl.on('line', (line) => {
  // Split the line into field and value
  const [field, value] = line.split('=');
  if (field && value) {
    craftInfo.fields[field.trim()] = value.trim();
  }
});

// When all lines are read, display the craft file information
rl.on('close', () => {
  console.log('Craft File Information:');
  console.log(craftInfo);
});
