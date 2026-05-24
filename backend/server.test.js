const request = require("supertest");
const { app, processarMensagem } = require("./server");

// ═══════════════════════════════════════════════════════════════════════════════
// UC01 – Enviar mensagem
// ═══════════════════════════════════════════════════════════════════════════════
describe("UC01 – Enviar mensagem", () => {
  // TC01.1 – Mensagem válida retorna 200 e resposta
  test("TC01.1 – Mensagem válida retorna status 200 e campo 'resposta'", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "oi" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("resposta");
    expect(typeof res.body.resposta).toBe("string");
    expect(res.body.resposta.length).toBeGreaterThan(0);
  });

  // TC01.2 – Mensagem vazia retorna erro 400
  test("TC01.2 – Mensagem vazia retorna status 400 com erro descritivo", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "" });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("erro");
  });

  // TC01.3 – Corpo sem campo mensagem retorna erro 400
  test("TC01.3 – Body sem campo 'mensagem' retorna status 400", async () => {
    const res = await request(app)
      .post("/chat")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("erro");
  });

  // TC01.4 – Mensagem apenas com espaços retorna erro 400
  test("TC01.4 – Mensagem com apenas espaços retorna status 400", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "   " });

    expect(res.status).toBe(400);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// UC02 – Receber resposta do chatbot (RF02 + RF03 + RF04)
// ═══════════════════════════════════════════════════════════════════════════════
describe("UC02 – Receber resposta do chatbot", () => {
  // TC02.1 – Pergunta sobre preço retorna informações de preço
  test("TC02.1 – Pergunta sobre preço retorna categoria 'preco'", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "qual o preço do pneu aro 15?" });

    expect(res.status).toBe(200);
    expect(res.body.categoria).toBe("preco");
    expect(res.body.resposta).toContain("R$");
  });

  // TC02.2 – Pergunta sobre horário retorna horário de funcionamento
  test("TC02.2 – Pergunta sobre horário retorna categoria 'horario'", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "qual o horário de funcionamento?" });

    expect(res.status).toBe(200);
    expect(res.body.categoria).toBe("horario");
    expect(res.body.resposta).toContain("Segunda");
  });

  // TC02.3 – Pergunta sobre localização retorna endereço
  test("TC02.3 – Pergunta sobre localização retorna categoria 'localizacao'", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "onde vocês ficam?" });

    expect(res.status).toBe(200);
    expect(res.body.categoria).toBe("localizacao");
    expect(res.body.resposta.toLowerCase()).toMatch(/rua|bairro|belo horizonte/);
  });

  // TC02.4 – Pergunta sobre serviços retorna lista de serviços
  test("TC02.4 – Pergunta sobre serviços retorna categoria 'servicos'", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "quais serviços vocês oferecem?" });

    expect(res.status).toBe(200);
    expect(res.body.categoria).toBe("servicos");
    expect(res.body.resposta.toLowerCase()).toContain("alinhamento");
  });

  // TC02.5 – Mensagem com maiúsculas é processada corretamente (case-insensitive)
  test("TC02.5 – Mensagem com maiúsculas é reconhecida (case-insensitive)", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "QUAL O PREÇO?" });

    expect(res.status).toBe(200);
    expect(res.body.categoria).toBe("preco");
  });

  // TC02.6 – Mensagem não reconhecida retorna categoria 'desconhecido' (RF04)
  test("TC02.6 – Mensagem não reconhecida retorna categoria 'desconhecido' (RF04)", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "xyzabc123qwerty" });

    expect(res.status).toBe(200);
    expect(res.body.categoria).toBe("desconhecido");
    expect(res.body.resposta).toContain("não entendi");
  });

  // TC02.7 – Resposta retorna em menos de 2 segundos (RNF01)
  test("TC02.7 – Resposta retorna em menos de 2000ms (RNF01)", async () => {
    const inicio = Date.now();

    await request(app)
      .post("/chat")
      .send({ mensagem: "preço" });

    const duracao = Date.now() - inicio;
    expect(duracao).toBeLessThan(2000);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// UC03 – Solicitar atendimento humano (RF05)
// ═══════════════════════════════════════════════════════════════════════════════
describe("UC03 – Solicitar atendimento humano", () => {
  // TC03.1 – Digitar "humano" aciona transferência
  test("TC03.1 – Mensagem 'humano' retorna transferencia=true", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "quero falar com um humano" });

    expect(res.status).toBe(200);
    expect(res.body.transferencia).toBe(true);
    expect(res.body.categoria).toBe("humano");
  });

  // TC03.2 – Resposta de transferência contém informações de contato
  test("TC03.2 – Resposta de transferência contém informações de contato", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "atendente" });

    expect(res.status).toBe(200);
    expect(res.body.transferencia).toBe(true);
    expect(res.body.resposta).toMatch(/\(\d{2}\)/); // contém telefone no formato (XX)
  });

  // TC03.3 – Respostas normais não acionam transferência
  test("TC03.3 – Mensagem comum não aciona transferência (transferencia=false)", async () => {
    const res = await request(app)
      .post("/chat")
      .send({ mensagem: "qual o preço?" });

    expect(res.status).toBe(200);
    expect(res.body.transferencia).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// Testes unitários de processarMensagem
// ═══════════════════════════════════════════════════════════════════════════════
describe("Unidade – processarMensagem()", () => {
  test("Reconhece saudação 'oi'", () => {
    const r = processarMensagem("oi");
    expect(r.categoria).toBe("saudacao");
  });

  test("Reconhece marca Michelin", () => {
    const r = processarMensagem("vocês têm pneus michelin?");
    expect(r.categoria).toBe("marcas");
  });

  test("Retorna desconhecido para texto aleatório", () => {
    const r = processarMensagem("qwerty12345");
    expect(r.categoria).toBe("desconhecido");
  });
});