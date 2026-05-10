async function enviarMensagem() {

    const input = document.getElementById("mensagem");
    const chat = document.getElementById("chat");

    const mensagem = input.value;

    chat.innerHTML += `<p><strong>Você:</strong> ${mensagem}</p>`;

    const resposta = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ mensagem })
    });

    const dados = await resposta.json();

    chat.innerHTML += `<p><strong>Bot:</strong> ${dados.resposta}</p>`;

    input.value = "";
}