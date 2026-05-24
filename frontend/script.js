const API_URL = "http://localhost:3000/chat";
let estadoAtual = { etapa: "menu" };

function adicionarMensagem(texto, tipo) {
    const chat = document.getElementById("chat");
    const div = document.createElement("div");
    div.className = `message ${tipo}`;
    div.innerHTML = `<div class="bubble">${texto.replace(/\n/g, "<br>")}</div>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function mostrarBotaoAtendente() {
    const chat = document.getElementById("chat");
    const div = document.createElement("div");
    div.className = "message bot";
    div.innerHTML = `<button class="btn-atendente" onclick="abrirAtendente()">👤 Falar com atendente</button>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function mostrarBotaoMenu() {
    const chat = document.getElementById("chat");
    const div = document.createElement("div");
    div.className = "message bot";
    div.innerHTML = `<button class="btn-menu" onclick="voltarMenu()">🏠 Menu Principal</button>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}

function abrirAtendente() {
    window.open("https://wa.me/5531999998888?text=Olá,%20gostaria%20de%20atendimento!", "_blank");
}

function voltarMenu() {
    estadoAtual = { etapa: "menu" };
    document.getElementById("menu-rapido").style.display = "flex";
    adicionarMensagem("Voltando ao menu principal! 😊", "bot");
}

async function enviar(texto, exibirComoUsuario) {
    if (exibirComoUsuario) adicionarMensagem(exibirComoUsuario, "user");

    const btnEnviar = document.getElementById("btnEnviar");
    btnEnviar.disabled = true;

    // indicador digitando
    const chat = document.getElementById("chat");
    const typing = document.createElement("div");
    typing.className = "message bot typing";
    typing.innerHTML = `<div class="bubble">⏳ digitando...</div>`;
    chat.appendChild(typing);
    chat.scrollTop = chat.scrollHeight;

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mensagem: texto, estado: estadoAtual }),
        });

        const dados = await res.json();
        typing.remove();

        if (!res.ok) {
            adicionarMensagem("⚠️ " + (dados.erro || "Erro ao processar."), "bot");
        } else {
            estadoAtual = dados.estado || { etapa: "menu" };
            adicionarMensagem(dados.resposta, "bot");

            if (dados.transferencia) {
                mostrarBotaoAtendente();
                mostrarBotaoMenu();
                document.getElementById("menu-rapido").style.display = "none";
            } else if (dados.voltarMenu) {
                document.getElementById("menu-rapido").style.display = "flex";
            } else if (estadoAtual.etapa !== "menu") {
                document.getElementById("menu-rapido").style.display = "none";
            } else {
                document.getElementById("menu-rapido").style.display = "flex";
            }
        }
    } catch (err) {
        typing.remove();
        adicionarMensagem("❌ Não foi possível conectar ao servidor.", "bot");
    }

    btnEnviar.disabled = false;
    document.getElementById("mensagem").focus();
}

function enviarMensagem() {
    const input = document.getElementById("mensagem");
    const texto = input.value.trim();
    if (!texto) return;
    input.value = "";
    enviar(texto, texto);
}

function enviarOpcao(valor, label) {
    document.getElementById("menu-rapido").style.display = "none";
    enviar(valor, label);
}

// Mensagem de boas-vindas
window.onload = () => {
    adicionarMensagem("👋 Olá! Bem-vindo à <strong>Pneus Nacional</strong>!<br><br>Como posso te ajudar hoje?", "bot");
};