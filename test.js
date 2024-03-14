const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Open file dialog to select a .craft file
const filePath = 'test.craft'; // Replace 'example.craft' with the path to your craft file
const fileStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

// Initialize craftInfo object to store field-value pairs
const craftInfo = {
  filename: path.basename(filePath),
  parts: {}
};

// Read each line of the file
rl.on('line', (line) => {
  // Split the line into field and value
  const [field, value] = line.split('=');
  if (field && value) {
    // Check if the field is 'part' to identify parts
    if (field.trim() === 'part') {
      const partName = value.trim();
      // Add part to the parts object
      craftInfo.parts[partName] = craftInfo.parts[partName] || [];
      // Add the current part's information to the array of parts
      craftInfo.parts[partName].push(parsePartFields(line));
    }
  }
});

// When all lines are read, write the part information to a file
rl.on('close', () => {
  const outputFile = 'part_list.txt'; // Output file name
  writePartListToFile(outputFile, craftInfo.parts);
  console.log(`Part information written to ${outputFile}`);
});

// Function to parse the fields of a part line
function parsePartFields(line) {
  const fields = {};
  // Split the line into field and value
  const parts = line.split('=');
  parts.shift(); // Remove 'part' field
  // Add each field-value pair to the fields object
  parts.forEach(part => {
    const [field, value] = part.split(':');
    if (field && value) {
      fields[field.trim()] = value.trim();
    }
  });
  return fields;
}

// Function to write part information to a file
function writePartListToFile(outputFile, parts) {
  let outputContent = '';
  for (const partName in parts) {
    outputContent += `Part: ${partName}\n`;
    parts[partName].forEach((part, index) => {
      outputContent += `Instance ${index + 1}:\n`;
      for (const field in part) {
        outputContent += `${field}: ${part[field]}\n`;
      }
      outputContent += '\n';
    });
  }
  fs.writeFileSync(outputFile, outputContent);
}
