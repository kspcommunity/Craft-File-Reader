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

The `processCraftFile` function provided by Craft File Reader allows you to analyze Craft files. Here's how you can use it:

1. Import the function into your Node.js script:

    ```javascript
    const processCraftFile = require('@kspcommunity/craft-file-reader');
    ```

2. Call the function with the path to the Craft file as an argument:

    ```javascript
    const craftFilePath = '/path/to/your/craft_file.craft';
    const result = await processCraftFile(craftFilePath);
    ```

    The `processCraftFile` function returns a Promise, so it's recommended to use `await` or `.then()` to handle the result.

3. Handle the result:

    If successful, the function returns an object containing details about the craft and its parts. If any error occurs during the process, it returns `null`.

    ```javascript
    if (result) {
        console.log('Craft Details:', result.craftDetails);
        console.log('Parts Details:', result.partsDetails);
    } else {
        console.error('Error processing the craft file.');
    }
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
