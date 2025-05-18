from typing import List
from get_predictions import Prediction
import pandas as pd
import numpy as np
from collections import Counter
from sklearn.cluster import KMeans

def get_alarms(detecciones: List[Prediction], locations_df):

    # Estante principal
    nombres_detectados = [d.nombre.lower().strip() for d in detecciones]
    estantes_detectados = []

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

    df_final.drop(columns=["nombre_normalizado"], inplace=True)
    df_final["charola_cluster"] = df_final["charola_cluster"].fillna(-1).astype(int)
    df_final["Charola"] = df_final["Charola"].fillna(-1).astype(int)


    # --- Clasificaciones ---
    productos_mal_estante = [
        {
            "id": locations_df[locations_df["nombre_normalizado"] == d.nombre.lower().strip()]["CB"].values[0]
            if not locations_df[locations_df["nombre_normalizado"] == d.nombre.lower().strip()].empty else None,
            "nombre": d.nombre,
            "bbox": d.bbox,
            "clase": "Mal Estante"
        }
        for d in detecciones
        if d.nombre in nombres_fuera_de_estante
    ]

    productos_faltantes = [
        {
            "id": locations_df[locations_df["Nombre"] == nombre]["CB"].values[0]
            if not locations_df[locations_df["Nombre"] == nombre].empty else None,
            "nombre": nombre,
            "bbox": [],
            "clase": "Producto faltante"
        }
        for nombre in no_detectados
    ]

    productos_mal_charola = []
    for _, row in df_final.iterrows():
        if row["charola_cluster"] != row["Charola"]:
            productos_mal_charola.append({
                "id": row["CB"],
                "nombre": row["nombre"],
                "bbox": row["bbox"],
                "clase": "Mal charola"
            })

    df_final_filtrado = df_final[df_final["charola_cluster"] == df_final["Charola"]].copy()

    productos_mal_posicion = []
    for charola in df_final_filtrado["Charola"].unique():
        grupo = df_final_filtrado[df_final_filtrado["Charola"] == charola].copy()
        grupo["centro_x"] = grupo["bbox"].apply(lambda b: (b[0] + b[2]) / 2)
        grupo_ordenado = grupo.sort_values(by="centro_x").reset_index(drop=True)

        bloques = []
        bloque_actual = {
            "nombre": grupo_ordenado.loc[0, "nombre"],
            "centro_xs": [grupo_ordenado.loc[0, "centro_x"]],
            "planograma": grupo_ordenado.loc[0, "Posicion en Charola"],
            "bbox": grupo_ordenado.loc[0, "bbox"],
            "id": grupo_ordenado.loc[0, "CB"]
        }

        for i in range(1, len(grupo_ordenado)):
            fila = grupo_ordenado.loc[i]
            if fila["nombre"] == bloque_actual["nombre"]:
                bloque_actual["centro_xs"].append(fila["centro_x"])
            else:
                bloques.append(bloque_actual)
                bloque_actual = {
                    "nombre": fila["nombre"],
                    "centro_xs": [fila["centro_x"]],
                    "planograma": fila["Posicion en Charola"],
                    "bbox": fila["bbox"],
                    "id": fila["CB"]
                }
        bloques.append(bloque_actual)

        for b in bloques:
            b["centro_x"] = sum(b["centro_xs"]) / len(b["centro_xs"])
        bloques = sorted(bloques, key=lambda x: x["centro_x"])

        for i, bloque in enumerate(bloques):
            if bloque["planograma"] != (i + 1):
                productos_mal_posicion.append({
                    "id": bloque["id"],
                    "nombre": bloque["nombre"],
                    "bbox": bloque["bbox"],
                    "clase": "Mal posición"
                })

    # --- Productos bien acomodados ---
    errores_set = {(d["nombre"], tuple(d["bbox"])) for d in productos_mal_charola + productos_mal_posicion + productos_mal_estante}

    productos_bien_acomodados = [
        {
            "id": locations_df[locations_df["nombre_normalizado"] == d.nombre.lower().strip()]["CB"].values[0]
            if not locations_df[locations_df["nombre_normalizado"] == d.nombre.lower().strip()].empty else None,
            "nombre": d.nombre,
            "bbox": d.bbox,
            "clase": "Bien acomodado"
        }
        for d in detecciones
        if (d.nombre, tuple(d.bbox)) not in errores_set
        and d.nombre not in no_detectados
        and d.nombre not in nombres_fuera_de_estante
    ]

    # --- Combinar y exportar ---
    resultado_final = (
        productos_mal_estante +
        productos_faltantes +
        productos_mal_charola +
        productos_mal_posicion +
        productos_bien_acomodados
    )

    return resultado_final