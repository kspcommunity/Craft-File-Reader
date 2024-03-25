const axios = require('axios');
const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * Function to read a Craft file and extract its details and parts.
 * @param {string} filename - The path to the Craft file.
 * @returns {object|null} - An object containing craft details and parts, or null if an error occurs.
 */
function craftRead(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const craftData = {
            ship: '',
            description: '',
            version: '',
            type: '',
            size: '',
            vesselType: '',
            totalPartCount: 0,
            parts: []
        };

        const lines = data.split('\n');
        let isPartSection = false;
        let typeFound = false; // Flag to track if type has been found
        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("ship")) {
                craftData.ship = line.split('=')[1].trim();
            } else if (line.startsWith("description")) {
                craftData.description = line.split('=')[1].trim();
            } else if (line.startsWith("version")) {
                craftData.version = line.split('=')[1].trim();
            } else if (line.startsWith("size")) {
                craftData.size = line.split('=')[1].trim();
            } else if (line.startsWith("vesselType")) {
                craftData.vesselType = line.split('=')[1].trim();
            } else if (line.startsWith("type") && !typeFound) { // Check if type has been found
                craftData.type = line.split('=')[1].trim();
                typeFound = true; // Set flag to true after first occurrence is found
            } else if (line.startsWith("PART")) {
                isPartSection = true;
                continue;
            } else if (isPartSection && line.startsWith("}")) {
                isPartSection = false;
            }
            // Counting parts
            if (isPartSection && line.startsWith("part =")) {
                craftData.totalPartCount++;
                const partName = line.split('=')[1].trim().split('_')[0];
                craftData.parts.push(partName);
            }
        }
        return craftData;
    } catch (err) {
        console.error('Error reading the file:', err);
        return null;
    }
}

// Function to fetch the JSON data from the provided URL
async function fetchModPartsData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching mod parts data:', error);
        return null;
    }
}

// Function to check if a part exists in the mod parts data and retrieve its details
function findPartDetails(partName, modPartsData) {
    for (const mod of modPartsData) {
        for (const part of mod.parts) {
            if (part.name === partName) {
                return {
                    partName: part.name,
                    modName: mod.modName,
                    preferredName: mod.preferredName,
                    link: mod.link,
                    filePath: part.filePath
                };
            }
        }
    }
    return null;
}

// Main function to run the program
async function main() {
    const modPartsUrl = 'https://mod-parts.kspcommunity.com/data.json';

    // Fetch mod parts data
    const modPartsData = await fetchModPartsData(modPartsUrl);
    if (!modPartsData) {
        console.error('Failed to fetch mod parts data. Exiting...');
        return;
    }

    // Ask the user to input the file path
    readline.question('Enter the path to the Craft file: ', async (craftFilename) => {
        // Read craft file and extract craft details and parts
        const craftData = craftRead(craftFilename);
        if (!craftData || craftData.parts.length === 0) {
            console.error('No parts found in the craft file.');
            readline.close();
            return;
        }

        // Print craft details
        console.log('\nCraft Details:');
        console.log(`- Ship: ${craftData.ship}`);
        console.log(`- Description: ${craftData.description}`);
        console.log(`- Version: ${craftData.version}`);
        console.log(`- Type: ${craftData.type}`);
        console.log(`- Size: ${craftData.size}`);
        console.log(`- Vessel Type: ${craftData.vesselType}`);
        console.log(`- Total Part Count: ${craftData.totalPartCount}`);

        // Print parts details
        console.log('\nParts in the craft file:');
        for (const part of craftData.parts) {
            const partDetails = findPartDetails(part, modPartsData);
            if (partDetails) {
                console.log(`\n   Part: ${partDetails.partName}`);
                console.log(`     Mod: ${partDetails.modName}`);
                console.log(`     Mod Preferred Name: ${partDetails.preferredName}`);
                console.log(`     Link: ${partDetails.link}`);
                console.log(`     File Path: ${partDetails.filePath}`);
            } else {
                console.log(`\n   Part: ${part} (Not found in mod parts data)`);
            }
        }
        readline.close();
    });

}

// Run the program
main();

// Export the craftRead function to make it accessible to other modules
module.exports = craftRead;
