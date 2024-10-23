from flask import Flask, render_template, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
import os
import json
import requests  # Import requests to make HTTP requests

app = Flask(__name__)

# Configurations for file upload
app.config["UPLOAD_FOLDER"] = "./uploads"
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)


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


# Route to load the lists from JSON and send to the frontend
@app.route("/analyze", methods=["GET"])
def analyze():
    try:
        with open("./data/lista.json") as json_file:
            data = json.load(json_file)
            lista_exonerados = data.get("lista_exonerados", [])
            lista_admitidos = data.get("lista_admitidos", [])

            return jsonify(
                {
                    "lista_exonerados": lista_exonerados,
                    "lista_admitidos": lista_admitidos,
                }
            )
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
