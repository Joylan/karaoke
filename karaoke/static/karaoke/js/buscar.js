document.addEventListener("DOMContentLoaded", function() {
    const campoBusca = document.getElementById("campo-busca");
    const resultado = document.getElementById("resultado");
    const status = document.getElementById("status-busca");
    const btnLimpar = document.getElementById("btn-limpar");
    const MAX_DISPLAY = 1000; // Limite de registros exibidos
    let primeiraExibicao = true; // flag para mostrar mensagem inicial

    let timeout = null;

    function buscarMusicas() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const valor = campoBusca.value.trim();

            let url = '/buscar/';
            if (valor !== "") {
                url += `?q=${encodeURIComponent(valor)}`;
                status.classList.remove("d-none", "alert-success", "alert-danger");
                status.classList.add("alert-info");
                status.innerText = "Buscando músicas... ⏳";
            } else {
                status.classList.add("d-none"); // campo vazio → oculta status
            }

            fetch(url)
                .then(res => res.json())
                .then(dados => {
                    resultado.innerHTML = "";

                    const displayCount = Math.min(dados.length, MAX_DISPLAY);

                    for (let i = 0; i < displayCount; i++) {
                        const m = dados[i];
                        resultado.innerHTML += `
                            <tr>
                                <td>${m.codigo}</td>
                                <td>${m.cantor}</td>
                                <td>${m.musica}</td>
                            </tr>
                        `;
                    }

                    // Mostra número de resultados apenas se houver busca
                    if (valor !== "") {
                        status.classList.remove("alert-info", "alert-danger");
                        status.classList.add("alert-success");
                        status.innerText = `Mostrando ${displayCount} de ${dados.length} resultado(s)`;
                    } else if (primeiraExibicao) {
                        // Primeira vez mostrando todos os registros
                        status.classList.remove("d-none", "alert-danger");
                        status.classList.add("alert-success");
                        status.innerText = `Total de músicas disponíveis: ${dados.length}`;
                        primeiraExibicao = false; // não mostrar mais depois
                        setTimeout(() => status.classList.add("d-none"), 3000); // some após 3s
                    }
                })
                .catch(err => {
                    console.error("Erro na busca:", err);
                    if (valor !== "") {
                        status.classList.remove("alert-info", "alert-success");
                        status.classList.add("alert-danger");
                        status.innerText = "Erro ao buscar músicas ❌";
                    }
                });
        }, 1000); // debounce 1 segundo
    }

    campoBusca.addEventListener("input", buscarMusicas);

    btnLimpar.addEventListener("click", function() {
        campoBusca.value = "";
        buscarMusicas(); // exibe os registros, limitado a 1000
    });

    // Preenche a tabela ao carregar e mostra mensagem inicial
    buscarMusicas();
});