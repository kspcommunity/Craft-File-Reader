const fs = require('fs').promises;
const path = require('path');

// Function to extract craft info from the craft file
function extractCraftInfo(data) {
    console.log('Extracting craft information...');
    const info = {};

    // Extract craft name, description, type, and version
    const nameMatch = data.match(/^ship (.+)/m);
    if (nameMatch) {
        info.name = nameMatch[1].replace(/^= /, ''); // Remove '=' at the beginning
    }

    const descMatch = data.match(/^description (.+)/m);
    if (descMatch) {
        info.description = descMatch[1].replace(/^= /, ''); // Remove '=' at the beginning
    }

    const typeMatch = data.match(/^type (.+)/m);
    if (typeMatch) {
        info.type = typeMatch[1].replace(/^= /, ''); // Remove '=' at the beginning
    }

    const versionMatch = data.match(/^version (.+)/m);
    if (versionMatch) {
        info.version = versionMatch[1].replace(/^= /, ''); // Remove '=' at the beginning
    }

    return info;
}

// Function to extract part names from the craft file
function extractPartNames(data) {
    console.log('Extracting part names...');
    const partRegex = /([a-zA-Z]+)(?:_\d+)/g;
    const partNames = new Set();

    let match;
    while ((match = partRegex.exec(data)) !== null) {
        partNames.add(match[1]);
    }

    return Array.from(partNames);
}

// Function to search for a part within the "Parts" folder of each mod
async function findPartInMods(partName, gamedataPath) {
    const modFolders = await fs.readdir(gamedataPath);

    const promises = modFolders.map(async modFolder => {
        const modFolderPath = path.join(gamedataPath, modFolder);
        const partsFolderPath = path.join(modFolderPath, 'Parts');
        console.log(`Searching for part '${partName}' in mod '${modFolder}'...`);
        return findPart(partName, partsFolderPath);
    });

    const partPaths = await Promise.all(promises);
    return partPaths.find(partPath => partPath !== null);
}

// Function to search for a part in a directory (with nested subfolders)
async function findPart(partName, directory) {
    try {
        const files = await fs.readdir(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                console.log(`Descending into directory: ${filePath}`);
                const result = await findPart(partName, filePath); // Recursively search subfolders
                if (result) {
                    return result;
                }
            } else if (file.endsWith('.cfg')) {
                console.log(`Checking file: ${filePath}`);
                const content = await fs.readFile(filePath, 'utf-8');
                if (content.includes(`name = ${partName}`)) {
                    console.log(`Part '${partName}' found in file: ${filePath}`);
                    return filePath;
                }
            }
        }

        console.log(`Part '${partName}' not found in directory: ${directory}`);
        return null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Main function to orchestrate the search process
async function main() {
    try {
        // Read data from example.craft
        console.log('Reading data from example.craft...');
        const data = await fs.readFile('example.craft', 'utf8');

        // Extract craft information
        const craftInfo = extractCraftInfo(data);

        // Extract part names
        const partNames = extractPartNames(data);

        // Directory to search for part paths
        const gamedataPath = path.join(__dirname, 'GameData');

        // Search for each part in parallel
        console.log('Searching for part paths...');
        const partPaths = await Promise.all(partNames.map(partName => findPartInMods(partName, gamedataPath)));

        // Filter out null results
        const filteredPartPaths = partPaths.filter(partPath => partPath !== null);

        // Construct object with part names and paths
        const partPathObject = {};
        filteredPartPaths.forEach((partPath, index) => {
            partPathObject[partNames[index]] = partPath;
        });

        // Include craft information in the object
        partPathObject.craftInfo = craftInfo;

        // Write part names, paths, and craft information to info.json
        console.log('Writing part names, paths, and craft information to info.json...');
        await fs.writeFile('info.json', JSON.stringify(partPathObject, null, 2), 'utf8');
        console.log('Part names, paths, and craft information have been written to info.json');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call main function
main();
