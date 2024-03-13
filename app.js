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

        // Send data to Discord webhook
        sendDataToWebhook(craftDetails);
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

async function sendDataToWebhook(data) {
    const webhookURL = 'https://discord.com/api/webhooks/1217531377029877853/pahLZCGDqWpFIU5MlZO_ppJnC2ZB-wMpHLPtxlnaKfGPsugCeFX-oty63anrY3kwDa3R'; // Replace with your actual Discord webhook URL

    if (!webhookURL) {
        console.error('Webhook URL not provided.');
        return;
    }

    try {
        const formData = new FormData();
        formData.append('file', new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), 'craft_details.json');

        const response = await fetch(webhookURL, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            console.log('Data sent to Discord webhook successfully.');
        } else {
            console.error('Failed to send data to Discord webhook:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending data to Discord webhook:', error);
    }
}

