from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import os
import pandas as pd
from get_predictions import get_predictions
from get_alarms import get_alarms
import numpy as np


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
    image_path = os.path.join('uploads', "image.jpg")
    os.makedirs('uploads', exist_ok=True)
    file.save(image_path)

    # Run AI model (replace with your code)
    result = detect_anomalies(image_path)

    return jsonify({"result": result})

def mapear_alerta(clase_raw) -> str:
    """
    Convierte el valor de `clase` en la cadena de `alerta` deseada.
    """
    if not isinstance(clase_raw, str):
        return ""
    if clase_raw == "Bien acomodado":
        return "Producto correcto"
    if clase_raw == "Producto faltante":
        return "Producto faltante"
    # Cualquier valor que empiece con "Mal"
    if clase_raw.startswith("Mal"):
        return "Producto mal acomodado"
    # Por defecto: devolvemos la misma clase o texto vacío
    return clase_raw

@app.route('/get_alarms', methods=['GET'])
def get_alarms_endpoint():
    image_path = "uploads/image.jpg"  # Reemplaza con tu lógica real
    confidence = 0.04
    predictions = get_predictions(image_path, confidence)
    
    # Cargo el CSV de ubicaciones para normalizar nombres (tal como ya lo tenías)
    locations_df = pd.read_csv("locations.csv")
    locations_df["nombre_normalizado"] = locations_df["Nombre"].str.strip().str.lower()
    
    # Obtengo la lista de alarms según tu lógica actual
    alarms = get_alarms(predictions, locations_df)
    
    # Me aseguro de que `bbox` sea lista Python
    for alarm in alarms:
        if isinstance(alarm.get("bbox", None), np.ndarray):
            alarm["bbox"] = alarm["bbox"].tolist()
        # También aseguro que los tipos numpy se conviertan a Python nativo
        for k, v in list(alarm.items()):
            if isinstance(v, np.integer):
                alarm[k] = int(v)
            elif isinstance(v, np.floating):
                alarm[k] = float(v)
            elif isinstance(v, np.ndarray):
                alarm[k] = v.tolist()

    # Construyo el nuevo arreglo transformado
    salida_transformada = []
    for idx, alarm in enumerate(alarms, start=1):
        # 1) ID incremental (string)
        nuevo_id = str(idx)
        
        # 2) Nombre (si no existe o es None, pongo "")
        nombre = alarm.get("nombre")
        if not isinstance(nombre, str):
            nombre = ""
        
        # 3) BBox (si no existe o no es lista, dejo [])
        bbox_raw = alarm.get("bbox", [])
        bbox_final = []
        if isinstance(bbox_raw, list):
            # Filtrar solo números (por si hubiera algo raro)
            bbox_final = [float(x) for x in bbox_raw if isinstance(x, (int, float))]
        
        # 4) Alerta (mapeo desde `clase`)
        alerta = mapear_alerta(alarm.get("clase"))
        
        salida_transformada.append({
            "id": nuevo_id,
            "nombre": nombre,
            "bbox": bbox_final,
            "alerta": alerta
        })

    # Para depuración:
    print(f"Returning {len(salida_transformada)} alarms (formateadas).")
    
    return jsonify({"alarms": salida_transformada})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)