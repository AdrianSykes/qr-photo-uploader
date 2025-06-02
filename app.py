import os
import io
from flask import Flask, render_template, request, redirect, session, url_for
from flask_session import Session
from dotenv import load_dotenv
from PIL import Image
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
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

def compress_image(file_stream):
    try:
        image = Image.open(file_stream)
        compressed_io = io.BytesIO()
        image.convert("RGB").save(compressed_io, format='JPEG', quality=85)
        compressed_io.seek(0)
        return compressed_io
    except Exception as e:
        print("Compression failed:", e)
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

        # Check file size
        file.seek(0, 2)
        file_size = file.tell()
        file.seek(0)

        if file_size > MAX_FILE_SIZE:
            compressed = compress_image(file)
            if not compressed or compressed.getbuffer().nbytes > MAX_FILE_SIZE:
                return render_template("index.html", error="File too large (even after compression). Max size is 10MB.", uploaded=uploaded, max_uploads=MAX_UPLOADS)
            file_to_upload = compressed
        else:
            file_to_upload = file

        try:
            cloudinary.uploader.upload(file_to_upload, folder="wedding")
            session["uploaded"] = uploaded + 1
            return redirect(url_for("success"))
        except Exception as e:
            return render_template("index.html", error=f"Upload failed: {str(e)}", uploaded=uploaded, max_uploads=MAX_UPLOADS)

    return render_template("index.html", uploaded=uploaded, max_uploads=MAX_UPLOADS)

@app.route("/success")
def success():
    return render_template("success.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))

