# Craft File Reader

[![GitHub stars](https://img.shields.io/github/stars/kspcommunity/Craft-File-Reader?style=social)](https://github.com/kspcommunity/Craft-File-Reader/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/kspcommunity/Craft-File-Reader?style=social)](https://github.com/kspcommunity/Craft-File-Reader/network)
[![GitHub watchers](https://img.shields.io/github/watchers/kspcommunity/Craft-File-Reader?style=social)](https://github.com/kspcommunity/Craft-File-Reader)
[![GitHub contributors](https://img.shields.io/github/contributors/kspcommunity/Craft-File-Reader)](https://github.com/kspcommunity/Craft-File-Reader/graphs/contributors)

Welcome to Craft File Reader! This repository is part of the KSP Community organization on GitHub.

## Overview

Craft File Reader is a tool for reading craft files used in the game Kerbal Space Program (KSP). It allows you to interact with craft files and extract useful information from them.

## Installation

You can install Craft File Reader via npm:

```bash
npm install @kspcommunity/craft-file-reader
```

## Usage

```javascript
const processCraftFile = require("@kspcommunity/craft-file-reader");

// Path to the Craft file
const craftFilePath = 'example.craft';

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
```

## Interact with Mod Parts Data

Craft File Reader can be used to interact with the data provided by [Mod Parts Lister](https://github.com/kspcommunity/Mod-Parts-Lister). Use both tools together for enhanced functionality.

## Acknowledgements

We would like to express our gratitude to Curseforge and Spacedock for their invaluable resources and support, without which this project would not have been possible.

## Disclaimer

KSP Community is an independent entity and is not affiliated with Curseforge, Spacedock, or Intercept Games.

## Additional Information

For more information about KSP Community, please visit our [main website](https://kspcommunity.com). Our Privacy Policy and Terms of Service are available on our website.

If you need further assistance or have any questions, feel free to reach out to us at [info@kspcommunity.com](mailto:info@kspcommunity.com).

Join our Discord server: [https://discord.gg/YCZ5YhQQ8A](https://discord.gg/YCZ5YhQQ8A)