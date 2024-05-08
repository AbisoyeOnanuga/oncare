import pandas as pd
import networkx as nx

# Load data from CSV files
disease_features_df = pd.read_csv('data/disease_features.csv')
drug_features_df = pd.read_csv('data/drug_features.csv')
# Load the kg.csv file with explicit data types and low_memory=False
# Load the kg.csv file with explicit data types and low_memory=False
kg_df = pd.read_csv('data/kg.csv', dtype={
    'relation': str,
    'display_relation': str,
    'x_index': int,
    'x_id': str,
    'x_type': str,
    'x_name': str,
    'x_source': str,
    'y_index': int,
    'y_id': str,
    'y_type': str,
    'y_name': str,
    'y_source': str
}, low_memory=False)

# Preprocess data (fill missing values, standardize text, etc.)
disease_features_df.fillna('Unknown', inplace=True)
drug_features_df.fillna('Unknown', inplace=True)

# Initialize the graph
G = nx.Graph()

# Add disease nodes
for index, row in disease_features_df.iterrows():
    disease_id = row['mondo_id']
    G.add_node(disease_id, type='disease', name=row['mondo_name'], definition=row['mondo_definition'])
    # Add other disease-related attributes (e.g., prevalence, clinical description)

# Add drug nodes
for index, row in drug_features_df.iterrows():
    drug_id = row['node_index']
    G.add_node(drug_id, type='drug', name=row['description'], half_life=row['half_life'])
    # Add other drug-related attributes (e.g., indication, mechanism of action)

# Create edges based on "drug_effect" relation
for index, row in kg_df.iterrows():
    if row['relation'] == 'drug_effect':
        G.add_edge(row['x_id'], row['y_id'], relation='side_effect')

# Example: Calculate PageRank scores
# Calculate PageRank scores
pagerank_scores = nx.pagerank(G)

# Find influential drugs (highest PageRank scores)
influential_drugs = {}
for node, score in pagerank_scores.items():
    if node in G.nodes and 'type' in G.nodes[node]:
        if G.nodes[node]['type'] == 'drug':
            influential_drugs[node] = score

# Output the graph to a file (e.g., CSV or JSON)
nx.write_gexf(G, 'general_medication_graph.gexf')

# Print influential drugs (for demonstration purposes)
print("Influential drugs:")
for drug_id, score in influential_drugs.items():
    print(f"{G.nodes[drug_id]['name']} (ID: {drug_id}), PageRank Score: {score:.4f}")
