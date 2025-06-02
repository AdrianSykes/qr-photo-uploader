import os
import io
from flask import Flask, render_template, request, redirect, session, url_for
from flask_session import Session
from dotenv import load_dotenv
from PIL import Image  # Needed for compression
import cloudinary
import cloudinary.uploader

# -----------------------
# Load environment variables
# -----------------------
load_dotenv()

# -----------------------
# Flask app setup
# -----------------------
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# -----------------------
# Cloudinary config
# -----------------------
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# -----------------------
# Upload limits
# -----------------------
MAX_UPLOADS = 30
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# -----------------------
# Image compression helper
# -----------------------
def compress_image(file_stream, target_size=MAX_FILE_SIZE):
    try:
        image = Image.open(file_stream)
        image = image.convert("RGB")  # Ensure JPEG-compatible
        quality = 85

        for attempt in range(5):  # Try reducing quality
            compressed_io = io.BytesIO()
            image.save(compressed_io, format="JPEG", quality=quality)
            size = compressed_io.tell()
            if size <= target_size:
                compressed_io.seek(0)
                print(f"✔ Compressed to {size / 1024:.1f} KB with quality={quality}")
                return compressed_io
            print(f"⚠ Still too big ({size / 1024:.1f} KB), reducing quality to {quality - 15}")
            quality -= 15

        print("❌ Unable to compress below target size.")
        return None
    except Exception as e:
        print("❌ Compression failed:", e)
        return None

# -----------------------
# Home page + upload handling
# -----------------------
@app.route("/", methods=["GET", "POST"])
def index():
    uploaded = session.get("uploaded", 0)

    if request.method == "POST":
        if uploaded >= MAX_UPLOADS:
            return render_template("index.html", error="Upload limit reached.", uploaded=uploaded, max_uploads=MAX_UPLOADS)

        file = request.files.get("photo")
        if not file:
            return render_template("index.html", error="No file selected.", uploaded=uploaded, max_uploads=MAX_UPLOADS)

        # Check original file size
        file.seek(0, 2)
        file_size = file.tell()
        file.seek(0)

        if file_size > MAX_FILE_SIZE:
            compressed = compress_image(file)
            if compressed:
                file_to_upload = compressed
            else:
                return render_template("index.html", error="File too large (even after multiple compression attempts). Please upload a smaller image.", uploaded=uploaded, max_uploads=MAX_UPLOADS)
        else:
            file_to_upload = file

        try:
            cloudinary.uploader.upload(file_to_upload, folder="wedding")
            session["uploaded"] = uploaded + 1
            return redirect(url_for("success"))
        except Exception as e:
            return render_template("index.html", error=f"Upload failed: {str(e)}", uploaded=uploaded, max_uploads=MAX_UPLOADS)

    return render_template("index.html", uploaded=uploaded, max_uploads=MAX_UPLOADS)

# -----------------------
# Success page
# -----------------------
@app.route("/success")
def success():
    return render_template("success.html")

# -----------------------
# Run the app
# -----------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
