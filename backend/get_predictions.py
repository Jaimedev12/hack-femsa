from typing import List
from attr import dataclass
from inference_sdk import InferenceHTTPClient

@dataclass
class Prediction:
    bbox: List[float]
    nombre: str
    conf: str

def get_predictions(image_path: str, confidence: float) -> List[Prediction]:
    client = InferenceHTTPClient(
        api_url="https://detect.roboflow.com",
        api_key="rUbMldeZDFnHqBMaEUag"
    )

    result = client.run_workflow(
        workspace_name="yolotest1-kvgfk",
        workflow_id="shelfdetection",
        images={
            "image": image_path
        },
        parameters={
            "confidence": confidence,
        },
        use_cache=False # cache workflow definition for 15 minutes
    )


    predictions: List[Prediction] = []
    # print(result[0]["predictions"]["predictions"])
    for pred in result[0]["predictions"]["predictions"]:
        class_name = pred["class"]
        conf = pred["confidence"]
        bbox = [0.0, 0.0, 0.0, 0.0]
        bbox[0] = pred["x"] - (pred["width"] / 2)
        bbox[1] = pred["y"] - (pred["height"] / 2)
        bbox[2] = pred["x"] + (pred["width"] / 2)
        bbox[3] = pred["y"] + (pred["height"] / 2)
        predictions.append(Prediction(nombre=class_name, conf=conf, bbox=bbox))

    return predictions

if __name__ == "__main__":
    image_path = "uploads/image.jpg"  # Replace with your image path
    confidence = 0.04  # Replace with your confidence threshold
    predictions = get_predictions(image_path, confidence)
    for pred in predictions:
        print(f"Nombre: {pred.nombre}, BBox: {pred.bbox}, Confidence: {pred.conf}")