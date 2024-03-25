const axios = require('axios');

/**
 * Function to read Craft file content and extract its details and parts.
 * @param {string} fileContent - The content of the Craft file.
 * @returns {object|null} - An object containing craft details and parts, or null if an error occurs.
 */
function craftRead(fileContent) {
    try {
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

        const lines = fileContent.split('\n');
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

module.exports = {
    craftRead,
    fetchModPartsData,
    findPartDetails
};
