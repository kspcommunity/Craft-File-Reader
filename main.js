const axios = require('axios');
const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
let chalk;
const chalkPromise = import('chalk').then(module => {
    chalk = module.default;
});

// Function to fetch the JSON data from the provided URL
async function fetchModPartsData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(chalk.red('Error fetching mod parts data:'), error);
        return null;
    }
}

// Function to read the craft file and extract craft details and parts
function readCraftFile(filename) {
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
        console.error(chalk.red('Error reading the file:'), err);
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
        console.error(chalk.red('Failed to fetch mod parts data. Exiting...'));
        return;
    }

    // Ask the user to input the file path
    readline.question(chalk.yellow('Enter the path to the Craft file: '), async (craftFilename) => {
        // Read craft file and extract craft details and parts
        const craftData = readCraftFile(craftFilename);
        if (!craftData || craftData.parts.length === 0) {
            console.error(chalk.red('No parts found in the craft file.'));
            readline.close();
            return;
        }

        // Print craft details
        console.log(chalk.yellow('Craft Details:'));
        console.log(chalk.yellow(`- Ship: ${craftData.ship}`));
        console.log(chalk.yellow(`- Description: ${craftData.description}`));
        console.log(chalk.yellow(`- Version: ${craftData.version}`));
        console.log(chalk.yellow(`- Type: ${craftData.type}`));
        console.log(chalk.yellow(`- Size: ${craftData.size}`));
        console.log(chalk.yellow(`- Vessel Type: ${craftData.vesselType}`));
        console.log(chalk.yellow(`- Total Part Count: ${craftData.totalPartCount}`));

        // Print parts details
        console.log(chalk.blue('Parts in the craft file:'));
        for (const part of craftData.parts) {
            const partDetails = findPartDetails(part, modPartsData);
            if (partDetails) {
                console.log(chalk.green.bold(`- Part: ${partDetails.partName}`));
                console.log(chalk.green(`  Mod: ${partDetails.modName}`));
                console.log(chalk.green.dim(`  Mod Preferred Name: ${partDetails.preferredName}`));
                console.log(chalk.green.italic(`  Link: ${partDetails.link}`));
                console.log(chalk.green(`  File Path: ${partDetails.filePath}`));
            } else {
                console.log(chalk.red(`- Part: ${part} (Not found in mod parts data)`));
            }
        }
        readline.close();
    });

}

// Run the program
main();
