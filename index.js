const fs = require('fs');

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
        console.error('Error reading the Craft file:', err);
        return null;
    }
}

// Function to fetch the JSON data from the provided URL
async function fetchModPartsData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Unable to fetch mod parts data, status:', response.status, response.statusText);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching mod parts data from URL:', url);
        console.error('Error details:', error.message);
        return null;
    }
}

// Function to check if a part exists in the mod parts data and retrieve its details
function findPartDetails(partName, modPartsData) {
    if (!modPartsData || !Array.isArray(modPartsData)) {
        console.error('Invalid mod parts data.');
        return null;
    }
    for (const mod of modPartsData) {
        if (!mod.parts || !Array.isArray(mod.parts)) {
            console.error('Invalid parts data in mod:', mod.modName);
            continue;
        }
        for (const part of mod.parts) {
            if (!part || typeof part !== 'object' || !part.name) {
                console.error('Invalid part data in mod:', mod.modName);
                continue;
            }
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
    console.error('Part not found in mod parts data:', partName);
    return null;
}

// Main function to process the craft file
async function processCraftFile(craftFilePath) {
    const modPartsUrl = 'https://mod-parts.kspcommunity.com/data.json';

    // Fetch mod parts data
    const modPartsData = await fetchModPartsData(modPartsUrl);
    if (!modPartsData) {
        console.error('Failed to fetch mod parts data from URL:', modPartsUrl);
        return null;
    }

    // Read craft file and extract craft details and parts
    const craftData = craftRead(craftFilePath);
    if (!craftData || craftData.parts.length === 0) {
        console.error('No valid craft data found in the Craft file:', craftFilePath);
        return null;
    }

    // Check parts against mod parts data
    const processedCraftData = {
        craftDetails: craftData,
        partsDetails: []
    };
    for (const part of craftData.parts) {
        const partDetails = findPartDetails(part, modPartsData);
        if (partDetails) {
            processedCraftData.partsDetails.push(partDetails);
        } else {
            processedCraftData.partsDetails.push({ partName: part, notFoundInModData: true });
        }
    }
    return processedCraftData;
}

// Export the processCraftFile function to make it accessible to other modules
module.exports = processCraftFile;
