from typing import List
from get_predictions import Prediction
import pandas as pd
import numpy as np
from collections import Counter
from sklearn.cluster import KMeans

def get_cluster_dataframe(detecciones: List[Prediction], locations_df):

    # Estante principal
    nombres_detectados = [d.nombre.lower().strip() for d in detecciones]
    estantes_detectados = []

    print(nombres_detectados)

    for nombre in nombres_detectados:
        match = locations_df[locations_df["nombre_normalizado"] == nombre]
        if not match.empty:
            estantes_detectados.append(match["Estante"].values[0])

    estante_principal = Counter(estantes_detectados).most_common(1)[0][0]
    df_estante = locations_df[locations_df["Estante"] == estante_principal].copy()

    # Detecciones fuera del estante
    nombres_estante_principal = set(df_estante["nombre_normalizado"])
    nombres_fuera_de_estante = [
        d.nombre for d in detecciones
        if d.nombre.lower().strip() not in nombres_estante_principal
    ]

    # Faltantes
    no_detectados = df_estante[
        ~df_estante["nombre_normalizado"].isin(nombres_detectados)
    ]["Nombre"].tolist()

    # --- KMeans para clustering por charola ---
    factor_y = 100
    centroides = []
    nombres = []
    bboxes = []

    for d in detecciones:
        x1, y1, x2, y2 = d.bbox
        cx = (x1 + x2) / 2
        cy = (y1 + y2) / 2
        centroides.append([cx, cy * factor_y])
        nombres.append(d.nombre)
        bboxes.append(d.bbox)

    centroides = np.array(centroides)
    kmeans = KMeans(n_clusters=4, random_state=42).fit(centroides)
    labels = kmeans.labels_

    centroides_orig = np.array([[x, y / factor_y] for x, y in centroides])
    cluster_means = {}
    for i in range(4):
        mask = labels == i
        y_values = centroides_orig[mask][:, 1]
        cluster_means[i] = np.mean(y_values)
        
    orden_clusters = sorted(cluster_means.items(), key=lambda x: x[1])
    etiquetas_charola = {cluster_id: f"{4 - i}" for i, (cluster_id, _) in enumerate(orden_clusters)}

    df_resultados = pd.DataFrame({
        "nombre": nombres,
        "bbox": bboxes,
        "charola_cluster": [etiquetas_charola[c] for c in labels]
    })
    df_resultados["nombre_normalizado"] = df_resultados.nombre.str.lower().str.strip()
    df_estante["nombre_normalizado"] = df_estante["Nombre"].str.lower().str.strip()

    df_final = pd.merge(
        df_resultados,
        df_estante[["CB", "nombre_normalizado", "Charola", "Posicion en Charola"]],
        on="nombre_normalizado",
        how="left"
    )

    return df_final