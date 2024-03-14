const fs = require('fs');
const path = require('path');

function findPart(partName, directory) {
    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const result = findPart(partName, filePath);
            if (result) {
                return result;
            }
        } else if (file.endsWith('.cfg')) {
            const content = fs.readFileSync(filePath, 'utf-8');
            if (content.includes(`name = ${partName}`)) {
                return filePath;
            }
        }
    }

    return null;
}

const partName = process.argv[2];

if (!partName) {
    console.log('Please provide a part name as an argument.');
    process.exit(1);
}

const gamedataPath = path.join(__dirname, 'GameData');
const partPath = findPart(partName, gamedataPath);

if (partPath) {
    console.log(`Part '${partName}' found at: ${partPath}`);
} else {
    console.log(`Part '${partName}' not found.`);
}
