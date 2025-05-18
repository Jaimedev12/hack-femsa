from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import os


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


# Simulate AI anomaly detection (replace with your model)
def detect_anomalies(image_path):
    # Replace this with your actual AI model logic
    return "No anomalies detected"  # Example response

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Save the image temporarily
    if not file.filename:
        return jsonify({"error": "Invalid file name"}), 400
    image_path = os.path.join('uploads', file.filename)
    os.makedirs('uploads', exist_ok=True)
    file.save(image_path)

    # Run AI model (replace with your code)
    result = detect_anomalies(image_path)

    return jsonify({"result": result})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)