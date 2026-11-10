
/* =========================================================
   ENTRE PÁGINAS — script.js
   Thais: eventos, validação e manipulação do DOM
   ========================================================= */

/* INTERAÇÃO A — abas e cadastro de novas indicações */
const botoesAbas = document.querySelectorAll(".aba-botao");
const conteudosAbas = document.querySelectorAll(".conteudo-aba");

function selecionarAba(idAba) {
    conteudosAbas.forEach((conteudo) => {
        conteudo.classList.toggle("visivel", conteudo.id === idAba);
    });

    botoesAbas.forEach((botao) => {
        const selecionado = botao.dataset.aba === idAba;
        botao.classList.toggle("ativa", selecionado);
        botao.setAttribute("aria-selected", String(selecionado));
    });
}

botoesAbas.forEach((botao) => {
    botao.addEventListener("click", () => selecionarAba(botao.dataset.aba));
});

const campoNovoLivro = document.getElementById("thais_novo_livro");
const botaoAdicionarLivro = document.getElementById("thais_adicionar_livro");
const listaNovidades = document.getElementById("thais_lista_novidades");

botaoAdicionarLivro.addEventListener("click", function () {
    const titulo = campoNovoLivro.value.trim();

    if (titulo === "") {
        alert("Digite o nome de um livro antes de adicionar.");
        return;
    }

    const novoItem = document.createElement("li");
    novoItem.textContent = titulo;
    listaNovidades.appendChild(novoItem);

    campoNovoLivro.value = "";
    campoNovoLivro.focus();
});


/* INTERAÇÃO B — FAQ: accordion e busca instantânea */
const perguntasFaq = document.querySelectorAll(".faq-item");
const campoBuscaFaq = document.getElementById("gabi_busca_faq");
const mensagemSemResultado = document.getElementById("gabi_sem_resultado");

perguntasFaq.forEach((item) => {
    const botao = item.querySelector(".faq-pergunta");

    botao.addEventListener("click", () => {
        const estavaAberto = item.classList.contains("aberto");

        perguntasFaq.forEach((outraPergunta) => {
            outraPergunta.classList.remove("aberto");
            outraPergunta.querySelector("span").textContent = "+";
        });

        if (!estavaAberto) {
            item.classList.add("aberto");
            botao.querySelector("span").textContent = "−";
        }
    });
});

campoBuscaFaq.addEventListener("input", () => {
    const termo = campoBuscaFaq.value.trim().toLocaleLowerCase("pt-BR");
    let quantidadeVisivel = 0;

    perguntasFaq.forEach((item) => {
        const texto = item.textContent.toLocaleLowerCase("pt-BR");
        const corresponde = texto.includes(termo);

        item.hidden = !corresponde;

        if (!corresponde) {
            item.classList.remove("aberto");
        }

        if (corresponde) {
            quantidadeVisivel++;
        }
    });

    mensagemSemResultado.hidden = quantidadeVisivel !== 0;
});


/* INTERAÇÃO E — lista dinâmica de leitura */
const campoNovoItem = document.getElementById("gabi_novo_item");
const botaoNovoItem = document.getElementById("gabi_adicionar_item");
const botaoLimparLista = document.getElementById("gabi_limpar_lista");
const listaLeitura = document.getElementById("gabi_lista_leitura");
const contadorLista = document.getElementById("gabi_contador");
const botoesFiltro = document.querySelectorAll(".filtro");

let livrosLeitura = [];
let filtroAtual = "todos";
let proximoId = 1;

function atualizarLista() {
    listaLeitura.innerHTML = "";

    const livrosFiltrados = livrosLeitura.filter((livro) => {
        if (filtroAtual === "todos") return true;

        return filtroAtual === "concluido"
            ? livro.concluido
            : !livro.concluido;
    });

    contadorLista.textContent = livrosLeitura.length;

    if (livrosFiltrados.length === 0) {
        const vazio = document.createElement("li");

        vazio.className = "lista-vazia";
        vazio.textContent = livrosLeitura.length === 0
            ? "Sua lista está vazia. Adicione um livro!"
            : "Não há livros neste filtro.";

        listaLeitura.appendChild(vazio);
        return;
    }

    livrosFiltrados.forEach((livro) => {
        const item = document.createElement("li");

        item.className = "item-leitura";

        if (livro.concluido) {
            item.classList.add("concluido");
        }

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = livro.concluido;
        checkbox.setAttribute("aria-label", "Marcar livro como concluído");

        checkbox.addEventListener("change", () => {
            livro.concluido = checkbox.checked;
            atualizarLista();
        });

        const titulo = document.createElement("span");

        titulo.className = "titulo-item";
        titulo.textContent = livro.titulo;

        const editar = document.createElement("button");

        editar.type = "button";
        editar.textContent = "Editar";

        editar.addEventListener("click", () => {
            const novoTitulo = prompt("Edite o título do livro:", livro.titulo);

            if (novoTitulo === null) return;

            if (novoTitulo.trim() === "") {
                alert("O título não pode ficar vazio.");
                return;
            }

            livro.titulo = novoTitulo.trim();
            atualizarLista();
        });

        const excluir = document.createElement("button");

        excluir.type = "button";
        excluir.textContent = "Excluir";

        excluir.addEventListener("click", () => {
            livrosLeitura = livrosLeitura.filter(
                (registro) => registro.id !== livro.id
            );

            atualizarLista();
        });

        item.append(checkbox, titulo, editar, excluir);
        listaLeitura.appendChild(item);
    });
}

function adicionarLivroNaLista() {
    const titulo = campoNovoItem.value.trim();

    if (titulo === "") {
        alert("Digite o título de um livro para adicionar à sua lista.");
        campoNovoItem.focus();
        return;
    }

    livrosLeitura.push({
        id: proximoId,
        titulo: titulo,
        concluido: false
    });

    proximoId++;

    campoNovoItem.value = "";

    atualizarLista();
    campoNovoItem.focus();
}

botaoNovoItem.addEventListener("click", adicionarLivroNaLista);

campoNovoItem.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        adicionarLivroNaLista();
    }
});

botaoLimparLista.addEventListener("click", () => {
    if (livrosLeitura.length === 0) {
        alert("A lista já está vazia.");
        return;
    }

    if (confirm("Deseja apagar todos os livros da lista?")) {
        livrosLeitura = [];
        atualizarLista();
    }
});

botoesFiltro.forEach((botao) => {
    botao.addEventListener("click", () => {
        filtroAtual = botao.dataset.filtro;

        botoesFiltro.forEach((filtro) => {
            filtro.classList.remove("ativo");
        });

        botao.classList.add("ativo");

        atualizarLista();
    });
});


/* Personalização global: modo claro/escuro */
const botaoTema = document.getElementById("thais_tema");

botaoTema.addEventListener("click", () => {
    const escuroAtivo = document.body.classList.toggle("modo-escuro");

    botaoTema.textContent = escuroAtivo
        ? "Ativar modo claro"
        : "Ativar modo escuro";
});


/* VALIDAÇÃO OBRIGATÓRIA — formulário com 15 campos/controles */
const formulario = document.getElementById("thais_formulario");

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();

    const idadeTexto = document.getElementById("idade").value.trim();
    const idade = Number(idadeTexto);

    const telefone = document.getElementById("telefone").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const cep = document.getElementById("cep").value.trim();

    const livroFavorito = document.getElementById("livro-favorito").value.trim();
    const autorFavorito = document.getElementById("autor-favorito").value.trim();

    const paginasTexto = document.getElementById("paginas").value.trim();
    const paginas = Number(paginasTexto);

    const notaTexto = document.getElementById("nota").value.trim();
    const nota = Number(notaTexto);

    const genero = document.getElementById("genero-favorito").value;
    const frequencia = document.getElementById("frequencia").value;

    const formato = document.querySelector('input[name="formato"]:checked');

    const recomendacao = document.getElementById("recomendacao").value.trim();
    const aceite = document.getElementById("aceite").checked;

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const telefoneNumeros = telefone.replace(/\D/g, "");

    const cepValido = /^\d{5}-?\d{3}$/.test(cep);

    if (
        !nome || !email || !telefone || !cidade || !cep ||
        !livroFavorito || !autorFavorito || !paginasTexto ||
        !notaTexto || !genero || !frequencia || !recomendacao
    ) {
        alert("Preencha todos os campos obrigatórios.");

    } else if (!emailValido) {
        alert("Informe um e-mail válido.");

    } else if (!Number.isInteger(idade) || idade < 10 || idade > 120) {
        alert("A idade deve ser um número inteiro entre 10 e 120.");

    } else if (
        telefoneNumeros.length < 10 ||
        telefoneNumeros.length > 11
    ) {
        alert("Informe um telefone com DDD e 10 ou 11 números.");

    } else if (!cepValido) {
        alert("Informe um CEP válido, no formato 00000-000.");

    } else if (
        !Number.isInteger(paginas) ||
        paginas < 0 ||
        paginas > 1000
    ) {
        alert("A quantidade de páginas deve ser um número inteiro entre 0 e 1000.");

    } else if (Number.isNaN(nota) || nota < 0 || nota > 10) {
        alert("A nota deve estar entre 0 e 10.");

    } else if (!formato) {
        alert("Selecione seu formato de leitura preferido.");

    } else if (recomendacao.length < 15) {
        alert("A recomendação precisa ter pelo menos 15 caracteres.");

    } else if (!aceite) {
        alert("É necessário confirmar as informações para continuar.");

    } else {
        alert("Cadastro validado com sucesso! Obrigada por participar do Entre Páginas.");

        formulario.reset();
    }
});


/* Arrow function usada para destacar links internos ao navegar */
document.querySelectorAll(".menu-principal a").forEach((link) => {
    link.addEventListener("click", () => {
        document.querySelectorAll(".menu-principal a").forEach((item) => {
            item.classList.remove("link-selecionado");
        });

        link.classList.add("link-selecionado");
    });
});
