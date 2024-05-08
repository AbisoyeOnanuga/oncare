import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure the Google API key
GEMINI_API_KEY = os.getenv('GEMINI_KEY')  # Ensure this is set in your .env file

genai.configure(api_key=GEMINI_API_KEY)

# Initialize the Gemini model with the API key
model = genai.GenerativeModel(
    'gemini-pro',
    generation_config=genai.GenerationConfig(
        max_output_tokens=2000,
        temperature=0.9,
    )
)

# Sample cancer medication list for a given patient (replace with actual data)
medication_list = [
    {"name": "Tamoxifen", "dosage": "20mg", "frequency": "Once a day"},
    {"name": "Methotrexate", "dosage": "2.5mg", "frequency": "Once a week"},
    {"name": "Cisplatin", "dosage": "75mg/m2", "frequency": "Every 3 weeks"}
]

# Craft a detailed prompt for analyzing the patient's medication list
prompt = (
    "As an AI trained in pharmacology, analyze the potential drug related side effects of the patient's medication list. "
    f"{medication_list}. Consider each medication's dosages, frequencies, and any reported symptoms. "
    # "Use the 'general_medication_graph.gexf' knowledge graph to detect likely causes of side effects. "
    "Provide detailed insights that can aid healthcare professionals in making informed treatment decisions."
)

# Example usage: Generate content based on the engineered prompt
response = model.generate_content(prompt)

# Print the generated response
print(response.text)