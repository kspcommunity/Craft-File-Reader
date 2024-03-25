const processCraftFile = require('./index');

// Path to the Craft file
const craftFilePath = 'crafts/Saab JAS 39 Gripen.craft';

// Call the processCraftFile function to process the Craft file
processCraftFile(craftFilePath)
    .then(processedCraftData => {
        if (processedCraftData) {
            // Print craft details
            console.log('\nCraft Details:');
            console.log(`- Ship: ${processedCraftData.craftDetails.ship}`);
            console.log(`- Description: ${processedCraftData.craftDetails.description}`);
            console.log(`- Version: ${processedCraftData.craftDetails.version}`);
            console.log(`- Type: ${processedCraftData.craftDetails.type}`);
            console.log(`- Size: ${processedCraftData.craftDetails.size}`);
            console.log(`- Vessel Type: ${processedCraftData.craftDetails.vesselType}`);
            console.log(`- Total Part Count: ${processedCraftData.craftDetails.totalPartCount}`);

            // Print parts details
            console.log('\nParts in the craft file:');
            for (const partDetails of processedCraftData.partsDetails) {
                if (partDetails.notFoundInModData) {
                    console.log(`\nPart: ${partDetails.partName} (Not found in mod parts data)`);
                } else {
                    console.log(`\n   Part: ${partDetails.partName}`);
                    console.log(`     Mod: ${partDetails.modName}`);
                    console.log(`     Mod Preferred Name: ${partDetails.preferredName}`);
                    console.log(`     Link: ${partDetails.link}`);
                    console.log(`     File Path: ${partDetails.filePath}`);
                }
            }
        } else {
            console.log('Failed to process the Craft file.');
        }
    })
    .catch(error => {
        console.error('Error processing the Craft file:', error);
    });
