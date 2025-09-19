from django.shortcuts import render
from django.http import JsonResponse
from .utils import carregar_musicas

def index(request):
    musicas = carregar_musicas()
    return render(request, "karaoke/index.html", {"musicas": musicas})


def buscar(request):
    query = request.GET.get("q", "").lower()
    musicas = carregar_musicas()
    try:
        if query:
            # filtro seguro, ignora campos vazios e evita erros com lower()
            musicas = [
                m for m in musicas
                if query in (m.get("cantor") or "").lower()
                   or query in (m.get("musica") or "").lower()
            ]
        return JsonResponse(musicas, safe=False)  # remove [:50] para mostrar todos
    except Exception as e:
        return JsonResponse({"erro": str(e)}, status=500)
#
# def buscar(request):
#     query = request.GET.get("q", "").lower()
#     musicas = carregar_musicas()
#     try:
#         if query:
#             # filtro seguro, ignora campos vazios e evita erros com lower()
#             musicas = [
#                 m for m in musicas
#                 if query in (m.get("cantor") or "").lower()
#                    or query in (m.get("musica") or "").lower()
#             ]
#         return JsonResponse(musicas[:1000], safe=False)  # opcional: limitar a 50 resultados
#     except Exception as e:
#         return JsonResponse({"erro": str(e)}, status=500)