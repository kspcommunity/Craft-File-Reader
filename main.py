import re

def read_craft_file(file_path):
    try:
        with open(file_path, 'r') as file:
            craft_content = file.read()
            return craft_content
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found.")
        return None

def extract_craft_info(craft_content):
    craft_info = {}

    # Extracting craft name
    match = re.search(r'#autoLOC_\d+ //#autoLOC_\d+ = (.+)', craft_content)
    if match:
        craft_info['Craft Name'] = match.group(1)

    # Extracting parts count
    parts_count = len(re.findall(r'PART\s*{', craft_content))
    craft_info['Parts Count'] = parts_count

    # Add more fields as needed

    return craft_info

# Example usage:
craft_file_path = 'Gull.craft'
craft_content = read_craft_file(craft_file_path)

if craft_content:
    craft_info = extract_craft_info(craft_content)

    print("Craft Name:", craft_info.get('Craft Name', 'Not available'))
    print("Parts Count:", craft_info.get('Parts Count', 'Not available'))
    # Add more fields as needed
