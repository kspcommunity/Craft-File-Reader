const fs = require('fs');
const { craftRead, fetchModPartsData, findPartDetails } = require('./index');

// Read the content of the Craft file
const craftFilePath = 'example.craft'; // Replace this with the path to your Craft file
try {
    const craftFileContent = fs.readFileSync(craftFilePath, 'utf8');
    
    // Use the craftRead function to extract craft details and parts
    const craftData = craftRead(craftFileContent);
    if (craftData) {
        console.log('Craft Details:');
        console.log('Ship:', craftData.ship);
        console.log('Description:', craftData.description);
        console.log('Version:', craftData.version);
        console.log('Type:', craftData.type);
        console.log('Size:', craftData.size);
        console.log('Vessel Type:', craftData.vesselType);
        console.log('Total Part Count:', craftData.totalPartCount);
        console.log('Parts:', craftData.parts);
    } else {
        console.error('Failed to read craft file or no parts found.');
    }
} catch (error) {
    console.error('Error reading craft file:', error);
}
