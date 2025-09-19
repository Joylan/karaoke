import csv
import os
from django.conf import settings

def carregar_musicas():
    caminho = os.path.join(settings.BASE_DIR, "musicas.csv")
    musicas = []
    with open(caminho, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter=";")  # <<< ponto e vírgula
        for row in reader:
            musicas.append({
                "codigo": row.get("codigo", ""),
                "cantor": row.get("cantor", ""),
                "musica": row.get("musicas", ""),  # <<< coluna "musicas"
            })
    return musicas