from flask import Flask, request, render_template, redirect, make_response
import cloudinary
import cloudinary.uploader
import os
from dotenv import load_dotenv
from datetime import timedelta
import uuid

# Load config
load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

UPLOAD_LIMIT = 30

@app.route('/')
def index():
    uploads = request.cookies.get('uploads')
    uploads = int(uploads) if uploads else 0
    return render_template("index.html", remaining=UPLOAD_LIMIT - uploads)

@app.route('/upload', methods=['POST'])
def upload():
    uploads = request.cookies.get('uploads')
    uploads = int(uploads) if uploads else 0

    if uploads >= UPLOAD_LIMIT:
        return "Upload limit reached", 403

    file = request.files['photo']
    if file:
        public_id = str(uuid.uuid4())
        result = cloudinary.uploader.upload(file, public_id=f"wedding/{public_id}")
        uploads += 1
        resp = make_response(redirect('/'))
        resp.set_cookie('uploads', str(uploads), max_age=60*60*24*365)
        return resp
    return "No file uploaded", 400
app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))




