function processCraftFile() {
    var fileInput = document.getElementById('fileInput');
    var outputDiv = document.getElementById('output');
    
    var file = fileInput.files[0];
    if (!file) {
        outputDiv.innerHTML = 'No file selected.';
        return;
    }

    var reader = new FileReader();
    reader.onload = function(event) {
        var craftData = event.target.result;
        var craftInfo = getCraftInfo(craftData);
        displayCraftInfo(craftInfo);
    };
    reader.readAsText(file);
}

function getCraftInfo(data) {
    var lines = data.split('\n');
    var craftInfo = {
        name: '',
        description: '',
        type: '',
        version: '',
        size: '',
        height: '',
        width: '',
        length: '',
        parts: {}
    };

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line.startsWith('ship =')) {
            craftInfo.name = line.split('=')[1].trim();
        } else if (line.startsWith('description =')) {
            craftInfo.description = line.split('=')[1].trim();
        } else if (line.startsWith('type =')) {
            craftInfo.type = line.split('=')[1].trim();
        } else if (line.startsWith('version =')) {
            craftInfo.version = line.split('=')[1].trim();
        } else if (line.startsWith('size =')) {
            craftInfo.size = line.split('=')[1].trim();
            var dimensions = craftInfo.size.split(',');
            craftInfo.height = parseFloat(dimensions[0]).toFixed(2);
            craftInfo.width = parseFloat(dimensions[1]).toFixed(2);
            craftInfo.length = parseFloat(dimensions[2]).toFixed(2);
        } else if (line.startsWith('PART')) {
            var partName = '';
            for (var j = i + 1; j < lines.length; j++) {
                var partLine = lines[j].trim();
                if (partLine.startsWith('part =')) {
                    partName = partLine.split('=')[1].trim().split('_')[0]; // Extract base name
                } else if (partLine.startsWith('}')) {
                    if (partName !== '') {
                        if (craftInfo.parts.hasOwnProperty(partName)) {
                            craftInfo.parts[partName]++;
                        } else {
                            craftInfo.parts[partName] = 1;
                        }
                    }
                    break;
                }
            }
        }
    }

    return craftInfo;
}

function displayCraftInfo(info) {
    var outputDiv = document.getElementById('output');
    var totalParts = Object.values(info.parts).reduce((acc, val) => acc + val, 0); // Calculate total part count
    outputDiv.innerHTML = `
        <strong>Name:</strong> ${info.name}<br>
        <strong>Description:</strong> ${info.description}<br>
        <strong>Type:</strong> ${info.type}<br>
        <strong>Version:</strong> ${info.version}<br>
        <strong>Height:</strong> ${info.height} m<br>
        <strong>Width:</strong> ${info.width} m<br>
        <strong>Length:</strong> ${info.length} m<br><br>
        <strong>Total Part Count:</strong> ${totalParts}<br><br>
        <table>
            <tr>
                <th>Part Name</th>
                <th>Quantity</th>
            </tr>
            ${Object.entries(info.parts).map(([partName, quantity]) => `
                <tr>
                    <td>${partName}</td>
                    <td>${quantity}</td>
                </tr>
            `).join('')}
        </table>
    `;
}
