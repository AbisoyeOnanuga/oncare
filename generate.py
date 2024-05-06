import os
import requests
from dotenv import load_dotenv
from google.generativeai import GenerativeModel, GenerationConfig

# Load environment variables from .env file
load_dotenv()


# Configure the Google API key
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')  # Replace with your actual Google API key

# Initialize the Gemini model with safety settings and the API key
model = GenerativeModel(
    'gemini-pro',
    generation_config=GenerationConfig(
        max_output_tokens=2000,
        temperature=0.9,
    ),
    api_key=GOOGLE_API_KEY  # Pass the API key here
)

# Sample medication list and patient note
medication_list = [
    {"name": "Aspirin", "dosage": "100mg", "frequency": "Daily"},
    {"name": "Metformin", "dosage": "500mg", "frequency": "Twice a day"},
    {"name": "Lisinopril", "dosage": "10mg", "frequency": "Daily"}
]
patient_note = "Patient reports experiencing intermittent headaches and dizziness over the past two weeks."

# Placeholder for id_to_name_map (replace with actual mapping)
id_to_name_map = {
    "medication_id_1": "Medication Name 1",
    "medication_id_2": "Medication Name 2",
    # Add more mappings as needed
}


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


# New function to handle the SPOKE API response
def process_spoke_response(response_data):
    # Extract relevant data from the response
    # Assuming 'relationships' is the key with the needed information
    relationships = response_data.get('relationships', [])
    # Filter for relevant relationships and map to medication names
    medication_relations = [
        rel for rel in relationships if rel.get('neo4j_type') == 'CAUSES_CcSE'
    ]
    # Example: Convert medication IDs to names
    medication_names = [id_to_name_map.get(rel['source'], "Unknown") for rel in medication_relations]
    return medication_names


# Updated retrieve_kg_data function
def retrieve_kg_data(medications, note):
    # Call the get_side_effect_data function
    side_effect = "Headache"  # Replace with the actual side effect you're querying
    try:
        response_data = get_side_effect_data(side_effect)
        # Process the response to get medication names
        medication_names = process_spoke_response(response_data)
        # Combine with existing medications list
        combined_medications = medications + medication_names
        # Continue with the rest of the function...
        return combined_medications
    except Exception as e:
        print(str(e))


# Function to call the Gemini model with context from KG
def call_gemini_with_context(kg_data, note):
    # Generate content with the Gemini model
    response = model.generate_content(
        f"{kg_data} {note}",
        safety_settings={'HARASSMENT': 'block_none'}
    )
    # Check if the response is safe to use
    if all(rating.probability == 'NEGLIGIBLE' for rating in response.safety_ratings):
        return response.text
    else:
        raise Exception("Content flagged by safety settings.")


# Example usage
analysis_result = analyze_note_with_kg_rag(medication_list, patient_note)
print(analysis_result)