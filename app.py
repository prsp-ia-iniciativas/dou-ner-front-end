from flask import Flask, render_template, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
import os
import json

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
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
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
