import requests

def get_side_effect_data(side_effect):
    # URL encode the side effect to handle any special characters
    side_effect_encoded = requests.utils.quote(side_effect)
    
    # Construct the API endpoint
    api_endpoint = f"https://spoke.rbvi.ucsf.edu/api/v1/neighborhood/SideEffect/name/{side_effect_encoded}"
    
    # Send the GET request to the SPOKE Neighbourhood Explorer API
    response = requests.get(api_endpoint)
    
    # Check if the request was successful
    if response.status_code == 200:
        # Return the JSON response
        return response.json()
    else:
        # Handle errors
        raise Exception(f"API Request Error: {response.status_code} - {response.text}")

# Example usage
try:
    side_effect = "Headache"  # Replace with the actual side effect you're querying
    data = get_side_effect_data(side_effect)
    print(data)
except Exception as e:
    print(str(e))