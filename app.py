import os
import uuid
from flask import Flask, request, redirect, url_for, render_template, send_file
from werkzeug.utils import secure_filename
import dropbox
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()  # Load from .env

# === Flask App Setup ===
app = Flask(__name__)

# === Dropbox Auth using Refresh Token ===
DROPBOX_APP_KEY = os.getenv("DROPBOX_APP_KEY")
DROPBOX_APP_SECRET = os.getenv("DROPBOX_APP_SECRET")
DROPBOX_REFRESH_TOKEN = os.getenv("DROPBOX_REFRESH_TOKEN")

dbx = dropbox.Dropbox(
    app_key=DROPBOX_APP_KEY,
    app_secret=DROPBOX_APP_SECRET,
    oauth2_refresh_token=DROPBOX_REFRESH_TOKEN
)

# === Routes ===

@app.route('/')
def index():
    return render_template('index.html')  # Make sure 'templates/index.html' exists

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files.get('photo')
    if not file:
        return "No file uploaded", 400

    # Process and save image to Dropbox
    filename = secure_filename(file.filename)
    image_bytes = BytesIO()
    image = Image.open(file.stream)
    image.save(image_bytes, format=image.format)
    image_bytes.seek(0)

    # Generate unique filename
    unique_name = f"/uploads/{uuid.uuid4().hex}_{filename}"

    try:
        dbx.files_upload(image_bytes.read(), unique_name)
    except dropbox.exceptions.ApiError as e:
        return f"Dropbox upload failed: {str(e)}", 500

    return f"Upload successful: {unique_name}", 200

@app.route('/health')
def health_check():
    return "OK", 200

# === Entry Point ===

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)


