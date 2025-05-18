from get_predictions import get_predictions
from get_alarms import get_alarms
import pandas as pd

def main():
    # Example usage
    image_path = "uploads/image.jpg"  # Replace with your image path
    confidence = 0.04  # Replace with your confidence threshold
    predictions = get_predictions(image_path, confidence)
    
    locations_df = pd.read_csv("locations.csv")
    
    # Normalize product names for better matching
    locations_df["nombre_normalizado"] = locations_df["Nombre"].str.strip().str.lower()
    
    # Process predictions and get alarms
    alarms = get_alarms(predictions, locations_df)
    print(alarms)


if __name__ == "__main__":
    main()