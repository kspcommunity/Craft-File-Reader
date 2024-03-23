const axios = require('axios');
const fs = require('fs');

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

// Function to read the example.craft file and extract parts
function readCraftFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const parts = extractParts(data);
        return parts;
    } catch (err) {
        console.error('Error reading the file:', err);
        return [];
    }
}

// Function to extract parts from the craft file
function extractParts(data) {
    const parts = [];
    const lines = data.split('\n');
    let isPartSection = false;
    for (let line of lines) {
        line = line.trim();
        if (line.startsWith("PART")) {
            isPartSection = true;
            continue;
        }
        if (isPartSection && line.startsWith("part =")) {
            const partName = line.split('=')[1].trim().split('_')[0];
            parts.push(partName);
        } else if (isPartSection && line.startsWith("}")) {
            isPartSection = false;
        }
    }
    return parts;
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
    const craftFilename = 'example.craft';
    const modPartsUrl = 'https://mod-parts.kspcommunity.com/data.json';

    // Fetch mod parts data
    const modPartsData = await fetchModPartsData(modPartsUrl);
    if (!modPartsData) {
        console.log('Failed to fetch mod parts data. Exiting...');
        return;
    }

    // Read craft file and extract parts
    const parts = readCraftFile(craftFilename);
    if (parts.length === 0) {
        console.log('No parts found in the craft file.');
        return;
    }

    // Check each part against mod parts data and print details if found
    console.log('Parts in the craft file:');
    for (const part of parts) {
        const partDetails = findPartDetails(part, modPartsData);
        if (partDetails) {
            console.log(`- Part: ${partDetails.partName}`);
            console.log(`  Mod: ${partDetails.modName}`);
            console.log(`  Preferred Name: ${partDetails.preferredName}`);
            console.log(`  Link: ${partDetails.link}`);
            console.log(`  File Path: ${partDetails.filePath}`);
        } else {
            console.log(`- Part: ${part} (Not found in mod parts data)`);
        }
    }
}

// Run the program
main();
