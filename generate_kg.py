import os
import networkx as nx
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Configure the Google API key
GEMINI_API_KEY = os.getenv('GEMINI_KEY')  # Ensure this is set in your .env file

genai.configure(api_key=GEMINI_API_KEY)

# Load the knowledge graph
kg_path = 'general_medication_graph.gexf'  # Update with the actual path
knowledge_graph = nx.read_gexf(kg_path)

# Initialize the Gemini model with the API key
model = genai.GenerativeModel(
    'gemini-pro',
    generation_config=genai.GenerationConfig(
        max_output_tokens=2000,
        temperature=0.9,
    )
)

# Function to analyze the medication list using the knowledge graph
def analyze_medication_list(medication_list, knowledge_graph):
    side_effects_info = {}
    for medication in medication_list:
        # Initialize an empty list to store side effects for this medication
        side_effects_info[medication['name']] = []
        
        # Check if the medication node exists in the knowledge graph
        if medication['name'] in knowledge_graph.nodes:
            # Iterate over all edges connected to this medication node
            for edge in knowledge_graph.edges(medication['name'], data=True):
                # Check if the edge represents a side effect relationship
                if edge[2].get('relation') == 'side_effect':
                    # Get the target node of the edge, which represents a side effect
                    side_effect_node = edge[1]
                    # Add the side effect to the list for this medication
                    side_effects_info[medication['name']].append(side_effect_node)
        else:
            # Handle cases where medication is not in the graph
            side_effects_info[medication['name']] = ['No data available']
    return side_effects_info

# Sample cancer medication list for a given patient (replace with actual data)
medication_list = [
    {"name": "Tamoxifen", "dosage": "20mg", "frequency": "Once a day"},
    {"name": "Methotrexate", "dosage": "2.5mg", "frequency": "Once a week"},
    {"name": "Cisplatin", "dosage": "75mg/m2", "frequency": "Every 3 weeks"}
]

# Sample side effects note (replace with actual data)
side_effects_note = "Patient reports experiencing mild nausea and occasional dizziness, particularly after the last chemotherapy session."

# Function to generate a response based on medication list and side effects note
def generate_response(medication_list, side_effects_note, knowledge_graph):
    # Analyze the medication list using the knowledge graph
    side_effects_info = analyze_medication_list(medication_list, knowledge_graph)
    
    # Craft a detailed prompt for analyzing the patient's medication list and side effects
    prompt = (
        "As an AI trained in pharmacology, analyze the potential drug-related causes of side effects based on the patient's medication list. "
        f"Medications: {medication_list}. Reported side effects: {side_effects_note}. "
        #f"Knowledge Graph Analysis: {side_effects_info}. "
        "Provide detailed insights that can aid healthcare professionals in making informed treatment decisions."
    )

    # Generate content based on the engineered prompt
    response = model.generate_content(prompt)

    return response.text
    

# Automated testing function
def automated_testing(medication_list, side_effects_note, knowledge_graph):
    response_text = generate_response(medication_list, side_effects_note, knowledge_graph)
    print(f"Automated Test Response:\n{response_text}\n")

# Run automated testing
automated_testing(medication_list, side_effects_note, knowledge_graph)
