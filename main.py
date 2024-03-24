from flask import Flask, request, jsonify, render_template
from flask_pymongo import PyMongo
from bson.json_util import dumps

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://abisoyeart:abisoyeart@cluster0.yrqjzc6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongo = PyMongo(app)

@app.route("/")
def home():
    return render_template("user.html")

@app.route('/add_note', methods=['POST'])
def add_note():
    data = request.get_json()
    note = data['note']
    date = data['date']
    # Add the note to the database
    result = mongo.db.notes.insert_one({'note': note, 'date': date})
    return jsonify({'result': 'Note added', 'id': str(result.inserted_id)})

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
