const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Open file dialog to select a .craft file
const filePath = 'example.craft'; // Replace 'example.craft' with the path to your craft file
const fileStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

// Initialize craftInfo object to store field-value pairs
const craftInfo = {
  filename: path.basename(filePath),
  parts: []
};
let currentPart = null;

// Read each line of the file
rl.on('line', (line) => {
  // Check if the line indicates the start of a new part
  if (line.trim() === 'PART') {
    currentPart = {
      fields: {}
    };
    craftInfo.parts.push(currentPart);
  } else if (line.trim() === '}' && currentPart) {
    currentPart = null; // Reset current part when encountering the end of a part definition
  } else if (currentPart) {
    // Parse fields within a part definition
    const [field, value] = line.split('=');
    if (field && value) {
      currentPart.fields[field.trim()] = value.trim();
    }
  }
});

// When all lines are read, write the part information to a file
rl.on('close', () => {
  const outputFile = 'part_list.txt'; // Output file name
  writePartListToFile(outputFile, craftInfo.parts);
  console.log(`Part information written to ${outputFile}`);
});

// Function to write part information to a file
function writePartListToFile(outputFile, parts) {
  let outputContent = '';
  parts.forEach((part, index) => {
    outputContent += `Part ${index + 1}:\n`;
    for (const field in part.fields) {
      outputContent += `${field}: ${part.fields[field]}\n`;
    }
    outputContent += '\n';
  });
  fs.writeFileSync(outputFile, outputContent);
}
