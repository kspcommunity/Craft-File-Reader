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

// Initialize array to store part details
const craftDetails = {
    parts: [],
    partCount: 0,
    resources: [],
    lighting: [],
    techRequired: '',
    mass: 0
};

// Read each line of the file
rl.on('line', (line) => {
    // Check if the line indicates the start of a new part
    if (line.trim().startsWith('PART')) {
        const part = {};
        craftDetails.partCount++;

        rl.on('line', (partLine) => {
            if (partLine.trim() === '}') {
                craftDetails.parts.push(part);
                rl.removeListener('line', arguments.callee);
            } else {
                const [key, value] = partLine.split('=').map((str) => str.trim());
                part[key] = value;
            }
        });
    } else if (line.trim().startsWith('RESOURCE')) {
        const resource = {};

        rl.on('line', (resourceLine) => {
            if (resourceLine.trim() === '}') {
                craftDetails.resources.push(resource);
                rl.removeListener('line', arguments.callee);
            } else {
                const [key, value] = resourceLine.split('=').map((str) => str.trim());
                resource[key] = value;
            }
        });
    } else if (line.trim().startsWith('lighting')) {
        const lighting = {};

        rl.on('line', (lightingLine) => {
            if (lightingLine.trim() === '}') {
                craftDetails.lighting.push(lighting);
                rl.removeListener('line', arguments.callee);
            } else {
                const [key, value] = lightingLine.split('=').map((str) => str.trim());
                lighting[key] = value;
            }
        });
    } else if (line.trim().startsWith('TechRequired')) {
        const [, techRequired] = line.trim().split('=').map((str) => str.trim());
        craftDetails.techRequired = techRequired;
    } else if (line.trim().startsWith('mass')) {
        const [, mass] = line.trim().split('=').map((str) => parseFloat(str.trim()));
        craftDetails.mass = mass;
    }
});

// When all lines are read, write craft details to file
rl.on('close', () => {
    const craftDetailsFilePath = 'craftdetails.txt'; // File path for craft details
    fs.writeFileSync(craftDetailsFilePath, JSON.stringify(craftDetails, null, 2));
    console.log(`Craft details written to ${craftDetailsFilePath}`);
});
