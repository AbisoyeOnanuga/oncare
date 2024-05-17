# [Oncare](https://oncare.onrender.com/)

# Chemo-Tracker App

The Oncare Chemotherapy Side-Effects Tracking App (Chemo-Tracker) is a web-based platform designed to help patients undergoing chemotherapy manage their symptoms effectively. It allows patients to log their experiences, while doctors can review these notes and provide personalized responses. Here’s a comprehensive guide to understanding and navigating this repository.<br/>
![Web UI](https://github.com/AbisoyeOnanuga/oncare/blob/main/static/assets/images/PATEINT_TRACKER_side-effects.png?raw=true)

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [License](#license)

## Overview

Chemotherapy can be challenging, and patients often experience various side effects. This app aims to improve communication between patients and healthcare providers by allowing patients to submit detailed notes about their symptoms. Doctors can then provide timely responses, recommendations, and additional instructions.
[Oncare](https://oncare.onrender.com/)
## Features

- Patient Notes Submission:
    Patients can log their chemotherapy-related symptoms (e.g., nausea, fatigue, hair loss).
    Notes are stored securely in a MongoDB database, associated with the patient’s account.

- Doctor Responses:
    Doctors can access a list of patients and view their submitted notes.
    For each patient note, doctors can provide personalized responses and guidance.
    Responses are stored in the database, creating a seamless communication thread.

- Authentication and Security:
    The app ensures secure authentication using Auth0, allowing only authorized users (patients and doctors) to access the system.
    Environment variables protect sensitive information, such as API keys and database credentials.

## Technologies Used

- Python (Flask): Backend server handling routes, database interactions, and authentication.
- MongoDB: Database for storing patient notes and doctor responses.
- JavaScript (Vanilla): Frontend interactions, including fetching data and displaying notes.
- HTML/CSS: Basic UI components for patient and doctor views.

## Directory Structure

- `/static`: Contains the assets, css, js and scss folders.
- `/templates`: Contains the page files.
- `INSTALLATION.md`: Instructions to install _Oncare_.
- `LICENSE`: _TBD_.
- `main.py`: Contains the backend(Flask) definition file.
- `README.md`: Current file.
- `requirements.txt`: Requirements file.
- `style.css`: Custom CSS file.

## Getting Started
- This app runs with Python version 3.11.5.
- Clone this repository to your local machine `git clone https://github.com/AbisoyeOnanuga/oncare.git` and `cd oncare`.
- Set up your MongoDB database and configure environment variables.
- Install dependencies using `pip install -r requirements.txt`.
- Run the Flask app using `python main.py`.

## Usage

- Patient View:
    Patients can submit notes via the web interface.
    View submitted notes and any doctor responses.
    Update prescriptions or dosage based on doctor recommendations.
- Doctor View:
    Access patient notes and respond with personalized advice.
    Monitor patient progress and adjust treatment plans.

## License

We aim to provide a license for this project. We will make an update once we have made a decision.
