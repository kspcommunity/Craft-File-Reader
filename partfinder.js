const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Function to find the configuration file path for a given part name
function findPart(partName, directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            const found = findPart(partName, filePath);
            if (found) return found;
        } else if (file.endsWith('.cfg')) {
            const cfgContent = fs.readFileSync(filePath, 'utf8');
            const nameMatch = cfgContent.match(/name\s*=\s*(.*)/);
            if (nameMatch && nameMatch[1].trim() === partName) {
                return filePath;
            }
        }
    }

    return null;
}

// Open file dialog to select a .craft file
const filePath = 'example.craft'; // Replace 'example.craft' with the path to your craft file
const fileStream = fs.createReadStream(filePath);
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
});

// Initialize array to store part names
const partNames = [];

// Read each line of the file
rl.on('line', (line) => {
    // Check if the line indicates the start of a new part
    if (line.trim().startsWith('part = ')) {
        const partName = line.trim().split('=')[1].trim().split('_')[0]; // Extract part name without numerical suffix
        partNames.push(partName);
    }
});

// When all lines are read, search for the corresponding configuration files
rl.on('close', () => {
    const gameDataDir = path.join(__dirname, 'GameData'); // Assuming GameData directory is in the same location as this script
    partNames.forEach(partName => {
        const cfgFilePath = findPart(partName, gameDataDir);
        if (cfgFilePath) {
            console.log(`${partName}: ${cfgFilePath}`);
        } else {
            console.log(`${partName}: Part not found.`);
        }
    });
});
