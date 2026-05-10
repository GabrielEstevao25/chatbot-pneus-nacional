const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API do Chatbot funcionando");
});

app.post("/chat", (req, res) => {

    const mensagem = req.body.mensagem;

    res.json({
        resposta: `Você digitou: ${mensagem}`
    });

});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});