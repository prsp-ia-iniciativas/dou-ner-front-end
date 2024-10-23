from flask import Flask, render_template, request, redirect, url_for
from werkzeug.utils import secure_filename
import os

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
    lista_exonerados = [
        "Lucas Silva",
        "Ana Pereira",
        "João Costa",
        "Mariana Souza",
        "Carlos Lima",
    ]
    lista_admitidos = [
        "Roberto Nunes",
        "Isabela Castro",
        "Thiago Mendes",
        "Clara Moreira",
        "Leonardo Barbosa",
    ]
    return render_template(
        "index.html", lista_exonerados=lista_exonerados, lista_admitidos=lista_admitidos
    )


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


if __name__ == "__main__":
    app.run(debug=True)
