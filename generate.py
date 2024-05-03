import requests

# Sample medication list and patient note
medication_list = [
    {"name": "Aspirin", "dosage": "100mg", "frequency": "Daily"},
    {"name": "Metformin", "dosage": "500mg", "frequency": "Twice a day"},
    {"name": "Lisinopril", "dosage": "10mg", "frequency": "Daily"}
]
patient_note = "Patient reports experiencing intermittent headaches and dizziness over the past two weeks."

# Function to retrieve data from the Knowledge Graph API
def retrieve_kg_data(medications, note):
    # Replace with the actual KG API endpoint and query logic
    kg_response = requests.post('KG_API_ENDPOINT', json={'medications': medications, 'note': note})
    if kg_response.status_code == 200:
        return kg_response.json()
    else:
        raise Exception(f"KG API Error: {kg_response.status_code}")

# Function to call the Gemini model with context from KG
def call_gemini_with_context(kg_data, note):
    # Replace with the actual Gemini API endpoint and authorization logic
    gemini_response = requests.post(
        'GEMINI_API_ENDPOINT',
        headers={'Authorization': 'Bearer API_KEY'},
        json={'prompt': f"{kg_data} {note}", 'max_tokens': 512}
    )
    if gemini_response.status_code == 200:
        return gemini_response.json()['choices'][0]['text']
    else:
        raise Exception(f"Gemini API Error: {gemini_response.status_code}")

# Function to analyze the patient's note using KG + RAG
def analyze_note_with_kg_rag(medications, note):
    kg_data = retrieve_kg_data(medications, note)
    analysis = call_gemini_with_context(kg_data, note)
    return analysis

# Example usage
analysis_result = analyze_note_with_kg_rag(medication_list, patient_note)
print(analysis_result)
