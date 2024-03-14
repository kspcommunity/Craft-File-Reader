const fs = require('fs');
const path = require('path');

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

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

readline.question('Enter the part name: ', (partName) => {
    const gameDataDir = path.join(__dirname, 'GameData');
    const cfgFilePath = findPart(partName, gameDataDir);
    if (cfgFilePath) {
        console.log(`Part found at: ${cfgFilePath}`);
    } else {
        console.log('Part not found.');
    }
    readline.close();
});
