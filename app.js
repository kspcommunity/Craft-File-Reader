function processCraftFile() {
    const craftFileInput = document.getElementById('craftFileInput');
    const craftDetailsDiv = document.getElementById('craftDetails');

    // Check if a file is selected
    if (craftFileInput.files.length === 0) {
        alert('Please select a Craft file.');
        return;
    }

    const craftFile = craftFileInput.files[0];

    // Read the contents of the Craft file
    const reader = new FileReader();
    reader.onload = function (event) {
        const craftContent = event.target.result;
        const craftDetails = parseCraftFile(craftContent);

        // Display Craft file details
        craftDetailsDiv.innerHTML = '<h2>Craft File Details</h2>';
        for (const field in craftDetails) {
            craftDetailsDiv.innerHTML += `<p><strong>${field}:</strong> ${craftDetails[field]}</p>`;
        }
    };

    reader.readAsText(craftFile);
}

function parseCraftFile(craftContent) {
    const craftDetails = {};

    // Split the content into lines
    const lines = craftContent.split('\n');

    // Iterate through each line and extract details
    lines.forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            craftDetails[key.trim()] = value.trim();
        }
    });

    return craftDetails;
}
