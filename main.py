from flask import Flask, request, jsonify, render_template, redirect, session, url_for
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from datetime import datetime
from pymongo import DESCENDING
from os import getenv
from dotenv import load_dotenv

import json
#from os import environ as env, use getenv
from urllib.parse import quote_plus, urlencode
from authlib.integrations.flask_client import OAuth
#from dotenv import find_dotenv, load_dotenv, use load_dotenv

load_dotenv()

app = Flask(__name__)
username = getenv('MONGO_USERNAME')
password = getenv('MONGO_PASSWORD')
app.config["MONGO_URI"] = f"mongodb+srv://{username}:{password}@cluster0.yrqjzc6.mongodb.net/chemo-tracker?retryWrites=true&w=majority&appName=Cluster0&tls=true&authSource=admin"
mongo = PyMongo(app)

@app.route("/")
def home():
    user_role = session.get("user_role")
    return render_template("index.html", session=session.get('user'), user_role=user_role, pretty=json.dumps(session.get('user'), indent=4))
@app.route("/patient")
def user():
    user_role = session.get("user_role")
    return render_template("user.html", session=session.get('user'), user_role=user_role, pretty=json.dumps(session.get('user'), indent=4))
@app.route("/doctor")
def doctor():
    user_role = session.get("user_role")
    return render_template("doctor.html", session=session.get('user'), user_role=user_role, pretty=json.dumps(session.get('user'), indent=4))

@app.route('/patient/add_note', methods=['POST'])
def add_note():
    try:
        data = request.get_json()
        note = {
            "user_id": data.get("user_id"),
            "type": data.get("type"),
            "content": data.get("content"),
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        date = datetime.now()  # Use server time for consistency
        # Add the note to the database
        result = mongo.db.patientnotes.insert_one(note)
        return jsonify({'result': 'Note added', 'id': str(result.inserted_id), 'date': date.isoformat()})
    except Exception as e:
        # Log the exception and return an error response
        app.logger.error(f"Error adding note: {e}")
        return jsonify({'error': 'An error occurred while adding the note'}), 500
        
@app.route('/patient/get_all_notes', methods=['GET'])
def get_all_notes():
    try:
        # Retrieve the 'sub' value (user ID) from the session
        user_id = session.get('sub')  # Replace with the actual session variable name

        # Fetch notes associated with the user ID
        patient_notes = mongo.db.patientnotes.find({'user_id': user_id}).sort('date', DESCENDING)
        notes_list = []
        for note in patient_notes:
            notes_list.append({
                'id': str(note['_id']),
                'content': note['content'],
                'date': note['created_at'],
                'last updated': note['updated_at']
            })
        return jsonify(notes_list)
    except Exception as e:
        return jsonify({'error': str(e)}), 50

@app.route('/patient/get_note_content/<note_id>', methods=['GET'])
def get_note_content(note_id):
    try:
        user_id = session.get('sub')
        note = mongo.db.patientnotes.find_one({'_id': ObjectId(note_id), 'user_id': user_id})
        if note:
            return jsonify(note['content'])
        else:
            return jsonify({'error': 'Note not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/patient/update_note/<note_id>', methods=['POST'])
def update_note(note_id):
    try:
        data = request.get_json()
        user_id = session.get('sub')
        result = mongo.db.patientnotes.update_one(
            {'_id': ObjectId(note_id), 'user_id': user_id},
            {'$set': {'content': data['content'], 'updated_at': datetime.now()}}
        )
        if result.modified_count:
            return jsonify({'result': 'Note updated'}), 200
        else:
            return jsonify({'error': 'Note not found or not updated'}), 404
    except Exception as e:
        return jsonify({'error': 'An error occurred'}), 500

@app.route('/patient/delete_note/<note_id>', methods=['DELETE'])
def delete_note(note_id):
    try:
        # Convert the string ID to a MongoDB ObjectId
        user_id = session.get('sub')
        object_id = ObjectId(note_id)
        result = mongo.db.patientnotes.delete_one({'_id': object_id, 'user_id': user_id})
        if result.deleted_count:
            return jsonify({'result': 'Note deleted'}), 200
        else:
            return jsonify({'error': 'Note not found'}), 404
    except Exception as e:
        app.logger.error(f"Error deleting note: {e}")
        return jsonify({'error': 'An error occurred while deleting the note'}), 500

@app.route('/doctor/get_all_patients', methods=['GET'])
def get_all_patients():
    # Use aggregation to get a distinct list of user_ids
    pipeline = [
        {"$group": {"_id": "$user_id", "count": {"$sum": 1}}}
    ]
    patients = mongo.db.patientnotes.aggregate(pipeline)
    patients_list = [{"id": patient["_id"], "name": "Patient " + patient["_id"]} for patient in patients]
    return jsonify(patients_list)

@app.route('/doctor/get_patient_notes/<patientId>', methods=['GET'])
def get_patient_notes(patientId):
    # Fetch notes for a specific patient from the 'patientnotes' collection
    patient_notes = mongo.db.patientnotes.find({'user_id': patientId}).sort('date', DESCENDING)
    notes_list = []
    for note in patient_notes:
        notes_list.append({
            'id': str(note['_id']),
            'content': note['content'],
            'date': note['created_at'],
            'last updated': note['updated_at']
        })
    return jsonify(notes_list)

@app.route('/doctor/get_patient_content/<note_id>', methods=['GET'])
def get_patient_content(note_id):
    try:
        note = mongo.db.patientnotes.find_one({'_id': ObjectId(note_id)})
        if note:
            return jsonify(note['content'])
        else:
            return jsonify({'error': 'Note not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/doctor/add_response_to_note/<note_id>', methods=['POST'])
def add_response_to_note(note_id):
    try:
        data = request.get_json()
        # Add the doctor's response to the patient's note
        result = mongo.db.patientnotes.update_one(
            {'_id': ObjectId(note_id)},
            {'$set': {'doctor_responses': {
                'doctor_id': data['doctor_id'],  # Replace with actual doctor ID
                'response_content': data['response_content'],
                'timestamp': datetime.now()
            }}}
        )
        if result.modified_count:
            return jsonify({'result': 'Response added'}), 200
        else:
            return jsonify({'error': 'Note not found or response not added'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/doctor/get_doctor_note/<note_id>', methods=['GET'])
def get_doctor_note(note_id):
    try:
        note_document = mongo.db.patientnotes.find_one({'_id': ObjectId(note_id)})
        if note_document:
            return jsonify(note_document['doctor_responses'])
        else:
            return jsonify({'error': 'Note not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

app.secret_key = getenv("APP_SECRET_KEY")

oauth = OAuth(app)

oauth.register(
    "auth0",
    client_id = getenv("AUTH0_CLIENT_ID"),
    client_secret = getenv("AUTH0_CLIENT_SECRET"),
    client_kwargs = {
        "scope": "openid profile email",
    },
    server_metadata_url = f'https://{getenv("AUTH0_DOMAIN")}/.well-known/openid-configuration'
)

@app.route("/login")
def login():
    user_role = request.args.get("role")  # Extract role from query parameters
    return oauth.auth0.authorize_redirect(
        redirect_uri=url_for("callback", _external=True , role=user_role)
    )

@app.route("/callback", methods=["GET", "POST"])
def callback():
    user_role = request.args.get("role")
    print(f"User role: {user_role}")  # Add this line for debugging
    token = oauth.auth0.authorize_access_token()
    session["user"] = token
    session["user_role"] = user_role
    # Extract the 'sub' value from the userinfo
    user_id = request.args.get("sub", "")  # Get the 'sub' value or an empty string
    session["sub"] = user_id
    if user_role == "patient":
        return redirect(url_for("user"))
    elif user_role == "doctor":
        return redirect(url_for("doctor"))
    else:
        return redirect(url_for("home"))  # Default to home if no role specified

@app.route("/logout")
def logout():
    session.clear()
    return redirect(
        "https://" + getenv("AUTH0_DOMAIN")
        + "/v2/logout?"
        + urlencode(
            {
                "returnTo": url_for("home", _external=True),
                "client_id": getenv("AUTH0_CLIENT_ID"),
            },
            quote_via=quote_plus,
        )
    )

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
