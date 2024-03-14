const fs = require('fs');
const path = require('path');

// Function to extract part names and their paths from the craft file
function extractPartPaths(data, directory) {
    console.log('Extracting part paths...');
    const partRegex = /([a-zA-Z]+)(?:_\d+)/g;
    const partPaths = {};

    // Iterate over each part name
    let match;
    while ((match = partRegex.exec(data)) !== null) {
        const partName = match[1];
        console.log(`Searching for path of part '${partName}'...`);
        const partPath = findPart(partName, directory);
        if (partPath) {
            console.log(`Path of part '${partName}' found: ${partPath}`);
            partPaths[partName] = partPath;
        } else {
            console.log(`Path of part '${partName}' not found.`);
        }
    }

    return partPaths;
}

// Function to find a part in a directory
function findPart(partName, directory) {
    console.log(`Searching for part '${partName}' in directory: ${directory}`);
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            console.log(`Descending into directory: ${filePath}`);
            const result = findPart(partName, filePath);
            if (result) {
                return result;
            }
        } else if (file.endsWith('.cfg')) {
            console.log(`Checking file: ${filePath}`);
            const content = fs.readFileSync(filePath, 'utf-8');
            if (content.includes(`name = ${partName}`)) {
                console.log(`Part '${partName}' found in file: ${filePath}`);
                return filePath;
            }
        }
    }

    console.log(`Part '${partName}' not found in directory: ${directory}`);
    return null;
}

// Read data from example.craft
console.log('Reading data from example.craft...');
fs.readFile('example.craft', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // Directory to search for part paths
    const gamedataPath = path.join(__dirname, 'GameData');

    // Extract part names and their paths
    console.log('Extracting part names and their paths...');
    const partPaths = extractPartPaths(data, gamedataPath);

    // Write part names and their paths to info.json
    console.log('Writing part names and their paths to info.json...');
    fs.writeFile('info.json', JSON.stringify(partPaths, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return;
        }
        console.log('Part names and their paths have been written to info.json');
    });
});
