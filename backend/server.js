const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ── Dados ──────────────────────────────────────────────────────────────────────
const pneus = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data/pneus.json"), "utf-8")
);

const servicos = [
  "Alinhamento/Balanceamento",
  "Troca de óleo",
  "Correia dentada",
  "Manutenção preventiva/Revisão para viagem",
  "Freio",
  "Higienização ar-condicionado",
  "Injeção eletrônica",
  "Suspensão",
  "Montagem de pneus",
  "Conserto de pneus",
  "Embreagem",
  "Outros",
];

const lojas = [
  { nome: "LOJA BARRO PRETO",  endereco: "Rua Araguari, 235 – Barro Preto, BH",                        telefone: "(31) 3274-4155" },
  { nome: "LOJA FLORESTA",     endereco: "Avenida do Contorno, 1986 – Floresta, BH",                    telefone: "(31) 3273-5590" },
  { nome: "LOJA PAMPULHA",     endereco: "Avenida Portugal, 4170 – Belo Horizonte",                     telefone: "(31) 3492-3469" },
  { nome: "LOJA BARREIRO",     endereco: "Avenida Olinto Meireles, 658 – Belo Horizonte",               telefone: "(31) 3500-2767" },
  { nome: "LOJA SAVASSI",      endereco: "Avenida Nossa Senhora do Carmo, 87 – Belo Horizonte",         telefone: "(31) 3259-4140" },
  { nome: "LOJA BETIM",        endereco: "Avenida Edméia Mattos Lazzarotti, 3597 – Betim",              telefone: "(31) 3281-2029" },
];

// ── Normaliza medida (185/65r15 → 185/65R15) ──────────────────────────────────
function normalizarMedida(str) {
  return str.toUpperCase().replace(/\s/g, "");
}

// ── Valida formato de medida ───────────────────────────────────────────────────
function isMedidaValida(str) {
  return /^\d{3}\/\d{2}R\d{2}$/i.test(str.trim());
}

// ── Rota principal ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

// ── POST /chat ─────────────────────────────────────────────────────────────────
app.post("/chat", (req, res) => {
  const { mensagem, estado } = req.body;

  if (!mensagem || typeof mensagem !== "string" || mensagem.trim() === "") {
    return res.status(400).json({ erro: "Mensagem inválida ou vazia." });
  }

  const texto = mensagem.trim();
  const est = estado || { etapa: "menu" };

  // ── MENU PRINCIPAL ───────────────────────────────────────────────────────────
  if (est.etapa === "menu") {
    if (texto === "encontrar_pneus") {
      return res.json({
        resposta: "Por favor, escreva as medidas nesta ordem: largura, perfil e aro.\n\nExemplo: 185/65R15\n\n⚠️ Se não souber, escreva: Não sei",
        estado: { etapa: "aguarda_medida" },
        transferencia: false,
      });
    }

    if (texto === "servicos") {
      const lista = servicos
        .map((s, i) => `${i + 1}. ${s}`)
        .join("\n");
      return res.json({
        resposta: `Trouxe uma lista de serviços para você:\n\n💡 Selecione o serviço desejado e fale com nosso atendente.\n\n${lista}`,
        estado: { etapa: "aguarda_servico" },
        transferencia: false,
      });
    }

    if (texto === "enderecos") {
      const lista = lojas
        .map((l) => `🚘 ${l.nome}\n${l.endereco}\n☎️ ${l.telefone}`)
        .join("\n\n");
      return res.json({
        resposta: lista,
        estado: { etapa: "menu" },
        transferencia: true,
      });
    }
  }

  // ── AGUARDA MEDIDA ───────────────────────────────────────────────────────────
  if (est.etapa === "aguarda_medida") {
    if (texto.toLowerCase() === "não sei" || texto.toLowerCase() === "nao sei") {
      return res.json({
        resposta: "Sem problemas! Clique abaixo para falar com um de nossos atendentes. 😊",
        estado: { etapa: "menu" },
        transferencia: true,
      });
    }

    if (!isMedidaValida(texto)) {
      return res.json({
        resposta: "⚠️ Não reconheci esse formato.\n\nPor favor, escreva no formato: 185/65R15\n\nOu escreva Não sei para falar com um atendente.",
        estado: { etapa: "aguarda_medida" },
        transferencia: false,
      });
    }

    const medida = normalizarMedida(texto);
    const resultado = pneus.filter((p) => normalizarMedida(p.medida) === medida);

    if (resultado.length === 0) {
      return res.json({
        resposta: `⚠️ Não encontramos pneus para a medida ${medida} no momento.\n\nDeseja falar com um atendente para verificar disponibilidade?`,
        estado: { etapa: "menu" },
        transferencia: true,
      });
    }

    const lista = resultado
      .map((p, i) => `${i + 1}. ${p.medida} ${p.marca} ${p.modelo}\nR$ ${p.preco_pix.toFixed(2).replace(".", ",")} via Pix\nR$ ${p.preco_parcelado.toFixed(2).replace(".", ",")} em ${p.parcelas}x sem juros`)
      .join("\n\n");

    return res.json({
      resposta: `💡 Lembre-se: com pneus Goodyear você tem Durabilidade, Segurança e Garantia\n\n${lista}\n\n⚠️ A montagem é gratuita.`,
      estado: { etapa: "aguarda_escolha_pneu", pneus: resultado },
      transferencia: false,
    });
  }

  // ── AGUARDA ESCOLHA DO PNEU ──────────────────────────────────────────────────
  if (est.etapa === "aguarda_escolha_pneu") {
    const opcao = parseInt(texto);
    const listaPneus = est.pneus || [];

    if (!isNaN(opcao) && opcao >= 1 && opcao <= listaPneus.length) {
      const pneuEscolhido = listaPneus[opcao - 1];
      return res.json({
        resposta: `Ótima escolha! ✅\n\nVocê selecionou:\n${pneuEscolhido.medida} ${pneuEscolhido.marca} ${pneuEscolhido.modelo}\n\nQuantos pneus você precisa?\n\n💡 Por favor, digite um número.`,
        estado: { etapa: "aguarda_quantidade", pneu: pneuEscolhido },
        transferencia: false,
      });
    }

    if (texto === "menu" || texto === "5") {
      return res.json({
        resposta: "Voltando ao menu principal! 😊",
        estado: { etapa: "menu" },
        transferencia: false,
        voltarMenu: true,
      });
    }

    return res.json({
      resposta: "⚠️ Opção inválida. Por favor, digite o número do pneu desejado.",
      estado: est,
      transferencia: false,
    });
  }

  // ── AGUARDA QUANTIDADE ───────────────────────────────────────────────────────
  if (est.etapa === "aguarda_quantidade") {
    const qtd = parseInt(texto);

    if (isNaN(qtd) || qtd <= 0) {
      return res.json({
        resposta: "⚠️ Por favor, digite um número válido.",
        estado: est,
        transferencia: false,
      });
    }

    const p = est.pneu;
    const totalPix = (p.preco_pix * qtd).toFixed(2).replace(".", ",");
    const totalParc = (p.preco_parcelado * qtd).toFixed(2).replace(".", ",");

    return res.json({
      resposta: `Você escolheu:\n${p.medida} ${p.marca} ${p.modelo}\n\nQuantidade: ${qtd}\n\nR$ ${totalPix} via Pix\nR$ ${totalParc} em ${p.parcelas}x sem juros\n\n⚠️ A montagem é gratuita.\n\nClique abaixo para finalizar com nosso atendente! 👇`,
      estado: { etapa: "menu" },
      transferencia: true,
    });
  }

  // ── AGUARDA ESCOLHA DE SERVIÇO ───────────────────────────────────────────────
  if (est.etapa === "aguarda_servico") {
    const opcao = parseInt(texto);

    if (!isNaN(opcao) && opcao >= 1 && opcao <= servicos.length) {
      const servico = servicos[opcao - 1];
      return res.json({
        resposta: `Você escolheu: ${servico}\n\nClique abaixo para falar com nosso atendente e agendar! 👇`,
        estado: { etapa: "menu" },
        transferencia: true,
      });
    }

    return res.json({
      resposta: "⚠️ Opção inválida. Por favor, digite o número do serviço desejado.",
      estado: est,
      transferencia: false,
    });
  }

  // Fallback
  return res.json({
    resposta: "Não entendi. Por favor, use o menu abaixo. 😊",
    estado: { etapa: "menu" },
    transferencia: false,
    voltarMenu: true,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

module.exports = { app };