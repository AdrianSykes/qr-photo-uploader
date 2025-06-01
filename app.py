
import os
import uuid
import io
from flask import Flask, request, render_template, jsonify, session, send_from_directory
from flask_session import Session
from werkzeug.utils import secure_filename
import dropbox
from PIL import Image

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

# Dropbox token from environment variable
DROPBOX_ACCESS_TOKEN = os.getenv("DROPBOX_ACCESS_TOKEN")

dbx = dropbox.Dropbox("DROPBOX_ACCESS_TOKEN")

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def index():
    if 'photo_count' not in session:
        session['photo_count'] = 0
    return render_template('index.html', count=session['photo_count'])

@app.route('/upload', methods=['POST'])
def upload():
    if 'photo_count' not in session:
        session['photo_count'] = 0

    if session['photo_count'] >= 100:
        return jsonify({'success': False, 'message': 'Upload limit reached (100).'})

    if 'photo' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'})

    file = request.files['photo']
    if file.filename == '':
        return jsonify({'success': False, 'message': 'No selected file'})

    filename = secure_filename(f"{uuid.uuid4().hex}.jpg")
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)

    with open(file_path, 'rb') as f:
        dbx.files_upload(f.read(), f'/QRPhotos/{filename}')

    session['photo_count'] += 1
    return jsonify({'success': True, 'message': f'Uploaded ({session["photo_count"]}/100)'})

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)
