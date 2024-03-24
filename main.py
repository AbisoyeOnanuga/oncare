from flask import Flask
from flask_pymongo import PyMongo
from requests import request

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://abisoyeart:abisoyeart@cluster0.yrqjzc6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongo = PyMongo(app)

@app.route('/add_note', methods=['POST'])
def add_note():
    note = request.form['note']
    # Add the note to the database
    mongo.db.notes.insert_one({'note': note})
    return 'Note added'
