import os
import io
from flask import Flask, render_template, request, redirect, session, url_for
from flask_session import Session
from dotenv import load_dotenv
from PIL import Image
import cloudinary
import cloudinary.uploader

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

# Secret key and session config
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY") or "change-me"
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_COOKIE_NAME"] = "session"
Session(app)

# Cloudinary config
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

MAX_UPLOADS = 30
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def compress_image(file_stream, target_size=MAX_FILE_SIZE):
    try:
        image = Image.open(file_stream)
        image = image.convert("RGB")
        quality = 85

        for _ in range(5):
            compressed_io = io.BytesIO()
            image.save(compressed_io, format="JPEG", quality=quality)
            size = compressed_io.tell()
            if size <= target_size:
                compressed_io.seek(0)
                return compressed_io
            quality -= 15
            if quality <= 10:
                break
        return None
    except Exception as e:
        print("Compression error:", e)
        return None

@app.route("/", methods=["GET", "POST"])
def index():
    uploaded = session.get("uploaded", 0)

    if request.method == "POST":
        if uploaded >= MAX_UPLOADS:
            return render_template("index.html", error="Upload limit reached.", uploaded=uploaded, max_uploads=MAX_UPLOADS)

        file = request.files.get("photo")
        if not file:
            return render_template("index.html", error="No file selected.", uploaded=uploaded, max_uploads=MAX_UPLOADS)

        file.seek(0, 2)
        file_size = file.tell()
        file.seek(0)

        if file_size > MAX_FILE_SIZE:
            compressed = compress_image(file)
            if not compressed:
                return render_template("index.html", error="File too large even after compression.", uploaded=uploaded, max_uploads=MAX_UPLOADS)
            upload_file = compressed
        else:
            upload_file = file

        try:
            cloudinary.uploader.upload(upload_file, folder="wedding")
            session["uploaded"] = uploaded + 1
            return redirect(url_for("success"))
        except Exception as e:
            return render_template("index.html", error=f"Upload failed: {str(e)}", uploaded=uploaded, max_uploads=MAX_UPLOADS)

    return render_template("index.html", uploaded=uploaded, max_uploads=MAX_UPLOADS)

@app.route("/success")
def success():
    return render_template("success.html")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

