const fs = require('fs');

// Read data from example.craft
fs.readFile('example.craft', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Extract part names
    const partNames = extractPartNames(data);

    // Write part names to info.txt
    fs.writeFile('info.txt', partNames.join('\n'), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log('Part names have been written to info.txt');
    });
});

// Function to extract part names from the craft file
function extractPartNames(data) {
    const partRegex = /([a-zA-Z]+)(?:_\d+)/g;
    let partCount = {};
    let partNames = [];

    // Count occurrences of each part name
    let match;
    while ((match = partRegex.exec(data)) !== null) {
        let partName = match[1];
        partCount[partName] = (partCount[partName] || 0) + 1;
    }

    // Generate part names with counts
    for (let partName in partCount) {
        let count = partCount[partName];
        if (count > 1) {
            partNames.push(`${partName} x${count}`);
        } else {
            partNames.push(partName);
        }
    }

    return partNames;
}
