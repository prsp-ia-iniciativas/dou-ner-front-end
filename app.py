from flask import Flask, render_template, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
import os
import json
import requests
import random
from datetime import datetime, timedelta

# Sample fake data for categories and subcategories
CATEGORIES = [
    "Secretaria de Meio Ambiente",
    "Casa Civil",
    "Secretaria de Administração",
    "Secretaria de Educação",
    "Secretaria de Esportes",
    "Secretaria de Saúde",
    "Secretaria de Cultura",
    "Secretaria de Justiça",
    "Secretaria de Transporte",
]

SUBCATEGORIES = [
    "Coordenadoria Geral",
    "Gabinete do Secretário",
    "Administração Geral",
    "Diretoria de Ensino",
    "Coordenadoria de Esportes",
    "Administração de Saúde",
    "Coordenadoria Cultural",
    "Procuradoria Geral",
    "Coordenadoria de Transporte",
]


app = Flask(__name__)

# Configurations for file upload
app.config["UPLOAD_FOLDER"] = "./uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


# Generate a random date within the last year
def generate_random_date():
    today = datetime.now()
    random_days = random.randint(1, 365)
    random_date = today - timedelta(days=random_days)
    return random_date.strftime("%Y-%m-%d")


# Generate fake details for categoria and subcategoria
def generate_fake_data(person_name):
    return {
        "nome": person_name,
        "categoria": random.choice(CATEGORIES),
        "subcategoria": random.choice(SUBCATEGORIES),
        "data": generate_random_date(),
    }


# Allowed file extensions
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ["pdf"]


# Route for the home page
@app.route("/")
def index():
    return render_template("index.html")


# Route to handle file upload
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return redirect(url_for("index"))

    file = request.files["file"]

    if file.filename == "":
        return redirect(url_for("index"))

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)

        # Perform the external file upload using requests
        try:
            with open(file_path, "rb") as f:
                response = requests.post(
                    "https://demo-prodesp-demo.apps.cluster-pqppz.pqppz.sandbox745.opentlc.com",
                    files={"myFile": f},
                    headers={"Content-Type": "multipart/form-data"},
                )

            # Check the response from the external server
            if response.status_code == 200:
                print("Upload successful")
                return f"File uploaded successfully! Server Response: {response.text}"
            else:
                print("Not successful")
                return (
                    f"Failed to upload file. Server Response: {response.text}",
                    response.status_code,
                )

        except Exception as e:
            return f"An error occurred while uploading the file: {str(e)}", 500

    return redirect(url_for("index"))


# Route to handle file upload and analyze the content
@app.route("/analyze", methods=["POST"])
def analyze():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(file_path)

        # Perform the external file upload using requests
        try:
            with open(file_path, "rb") as f:
                response = requests.post(
                    "https://demo-prodesp-demo.apps.cluster-pqppz.pqppz.sandbox745.opentlc.com",
                    files={"file": f},
                    headers={"Accept": "application/json"},
                )

            # Check the response from the external server
            if response.status_code == 200:
                # Transform the response JSON
                original_data = response.json()

                # Transform exoneration list
                exonerados = [
                    generate_fake_data(person)
                    for person in original_data.get("exoneração", [])
                ]

                # Transform nomination list
                nomeados = [
                    generate_fake_data(person)
                    for person in original_data.get("nomeação", [])
                ]

                # Construct the final transformed response
                transformed_data = {
                    "exoneração": exonerados,
                    "nomeação": nomeados,
                }

                # Return the transformed JSON response to the frontend
                return jsonify(transformed_data)

            else:
                return (
                    jsonify(
                        {"error": "Failed to analyze file", "details": response.text}
                    ),
                    response.status_code,
                )

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({"error": "Invalid file type"}), 400


if __name__ == "__main__":
    app.run(debug=True)

