const axios = require('axios');

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

// Function to find part details by name
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

// Main function to prompt user for a part name and return its details
async function main() {
    const modPartsUrl = 'https://mod-parts.kspcommunity.com/data.json';

    // Fetch mod parts data
    const modPartsData = await fetchModPartsData(modPartsUrl);
    if (!modPartsData) {
        console.log('Failed to fetch mod parts data. Exiting...');
        return;
    }

    // Prompt user for a part name
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('Enter the name of a part: ', async (partName) => {
        readline.close();

        // Find details of the entered part name
        const partDetails = findPartDetails(partName, modPartsData);
        if (partDetails) {
            console.log('Part Details:');
            console.log(`- Part: ${partDetails.partName}`);
            console.log(`- Mod: ${partDetails.modName}`);
            console.log(`- Mod Preferred Name: ${partDetails.preferredName}`);
            console.log(`- Link: ${partDetails.link}`);
            console.log(`- File Path: ${partDetails.filePath}`);
        } else {
            console.log(`Part "${partName}" not found in mod parts data.`);
        }
    });
}

// Run the program
main();
