import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure the Google API key
GEMINI_API_KEY = os.getenv('GEMINI_KEY')  # Ensure this is set in your .env file

# Initialize the Gemini model with the API key
def initialize_model():
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel(
        'gemini-pro',
        generation_config=genai.GenerationConfig(
            max_output_tokens=2000,
            temperature=0.9,
        )
    )
    return model

# Function to analyze the patient's medication list and side effects
def analyze_patient_note(prompt):
    model = initialize_model()
    response = model.generate_content(prompt)
    return response.text