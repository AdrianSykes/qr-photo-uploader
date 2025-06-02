import os
from flask import Flask, render_template, request, redirect, session, url_for
from flask_session import Session
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

MAX_UPLOADS = 30

@app.route("/", methods=["GET", "POST"])
def index():
    uploaded = session.get("uploaded", 0)
    if request.method == "POST":
        if uploaded >= MAX_UPLOADS:
            return render_template("index.html", error="Upload limit reached.", uploaded=uploaded, max_uploads=MAX_UPLOADS)

        file = request.files.get("photo")
        if file:
            cloudinary.uploader.upload(file, folder="wedding")
            session["uploaded"] = uploaded + 1
            return redirect(url_for("success"))
    return render_template("index.html", uploaded=uploaded, max_uploads=MAX_UPLOADS)

@app.route("/success")
def success():
    return render_template("success.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))



