const fs = require('fs').promises;
const path = require('path');

// Function to extract craft info from the craft file
function extractCraftInfo(data) {
    console.log('Extracting craft information...');
    const info = {};

    try {
        // Extract craft name, description, type, and version
        const nameMatch = data.match(/^ship (.+)/m);
        if (nameMatch) {
            info.Name = nameMatch[1].replace(/^= /, ''); // Remove '=' at the beginning
        }

        const descMatch = data.match(/^description (.+)/m);
        if (descMatch) {
            info.Description = descMatch[1].replace(/^= /, ''); // Remove '=' at the beginning
        }

        const typeMatch = data.match(/^type (.+)/m);
        if (typeMatch) {
            info.Type = typeMatch[1].replace(/^= /, ''); // Remove '=' at the beginning
        }

        const versionMatch = data.match(/^version (.+)/m);
        if (versionMatch) {
            info.Version = versionMatch[1].replace(/^= /, ''); // Remove '=' at the beginning
        }
    } catch (error) {
        console.error('Error extracting craft information:', error);
        throw error;
    }

    return info;
}

// Function to extract part names from the craft file
function extractPartNames(data) {
    console.log('Extracting part names...');
    const partRegex = /([a-zA-Z]+)(?:_\d+)/g;
    const partNames = new Set();

    try {
        let match;
        while ((match = partRegex.exec(data)) !== null) {
            partNames.add(match[1]);
        }
    } catch (error) {
        console.error('Error extracting part names:', error);
        throw error;
    }

    return Array.from(partNames);
}

// Function to search for a part within the "Parts" folder of each mod
async function findPartInMods(partName, gamedataPath) {
    try {
        console.log(`Searching for part '${partName}' in mods...`);
        const modFolders = await fs.readdir(gamedataPath);
        const foundInMods = [];

        for (const modFolder of modFolders) {
            const modFolderPath = path.join(gamedataPath, modFolder);
            const partsFolderPath = path.join(modFolderPath, 'Parts');
            const partPath = await findPart(partName, partsFolderPath);
            if (partPath) {
                foundInMods.push(modFolder);
            }
        }

        return foundInMods.length > 0 ? foundInMods : ['UnknownMod'];
    } catch (error) {
        console.error('Error searching for part in mods:', error);
        throw error;
    }
}

// Function to search for a part in a directory (with nested subfolders)
async function findPart(partName, directory) {
    try {
        console.log(`Searching for part '${partName}' in directory: ${directory}`);
        const files = await fs.readdir(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = await fs.stat(filePath);

            if (stat.isDirectory()) {
                const result = await findPart(partName, filePath); // Recursively search subfolders
                if (result) {
                    return result;
                }
            } else if (file.endsWith('.cfg')) {
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
        console.error('Error searching for part:', error);
        throw error;
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
        const totalPartCount = partNames.length;

        // Directory to search for part paths
        const gamedataPath = path.join(__dirname, 'GameData');

        // Search for each part in parallel
        console.log('Searching for part paths...');
        const partDetails = {};
        for (const partName of partNames) {
            const partPath = await findPart(partName, gamedataPath);
            const modDetails = await findPartInMods(partName, gamedataPath);
            partDetails[partName] = {
                Path: partPath !== null ? partPath : `Part '${partName}' not found in any mod.`,
                UsageCount: partPath !== null ? 1 : 0,
                ModDetails: modDetails
            };
        }

        // Construct object with craft details, part details, and mod details
        const craftDetails = {
            CraftDetails: {
                ...craftInfo,
                TotalPartCount: totalPartCount
            },
            Parts: partDetails
        };

        // Write craft details to info.json
        console.log('Writing craft details to info.json...');
        await fs.writeFile('info.json', JSON.stringify(craftDetails, null, 2), 'utf8');
        console.log('Craft details have been written to info.json');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Call main function
main();
