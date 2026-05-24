# Plano de Testes – Chatbot Pneus Nacional

## 1. Introdução

Este documento descreve os casos de teste elaborados para o sprint TP4, cobrindo os três casos de uso definidos no diagrama UC do projeto. Os testes foram implementados com **Jest** e **Supertest** e podem ser executados automaticamente.

---

## 2. Ambiente de Testes

| Item | Descrição |
|------|-----------|
| Framework de testes | Jest 29 + Supertest 6 |
| Linguagem | JavaScript (Node.js 18+) |
| Comando | `npm test` (dentro de `/backend`) |
| Arquivo | `backend/server.test.js` |

---

## 3. Casos de Uso Cobertos

| Caso de Uso | Descrição |
|---|---|
| UC01 | Enviar mensagem |
| UC02 | Receber resposta do chatbot |
| UC03 | Solicitar atendimento humano |

---

## 4. Casos de Teste

### UC01 – Enviar Mensagem

| ID | Descrição | Pré-condição | Entrada | Resultado Esperado | Status |
|----|-----------|--------------|---------|-------------------|--------|
| TC01.1 | Mensagem válida retorna 200 e campo `resposta` | Servidor online | `{ mensagem: "oi" }` | HTTP 200, `resposta` presente e não vazia | ✅ Passou |
| TC01.2 | Mensagem vazia retorna erro 400 | Servidor online | `{ mensagem: "" }` | HTTP 400, campo `erro` na resposta | ✅ Passou |
| TC01.3 | Body sem campo `mensagem` retorna 400 | Servidor online | `{}` | HTTP 400, campo `erro` na resposta | ✅ Passou |
| TC01.4 | Mensagem só com espaços retorna 400 | Servidor online | `{ mensagem: "   " }` | HTTP 400 | ✅ Passou |

---

### UC02 – Receber Resposta do Chatbot

| ID | Descrição | Pré-condição | Entrada | Resultado Esperado | Status |
|----|-----------|--------------|---------|-------------------|--------|
| TC02.1 | Pergunta sobre preço retorna categoria `preco` | Servidor online | `"qual o preço do pneu aro 15?"` | `categoria: "preco"`, resposta contém `R$` | ✅ Passou |
| TC02.2 | Pergunta sobre horário retorna categoria `horario` | Servidor online | `"qual o horário de funcionamento?"` | `categoria: "horario"`, resposta contém `"Segunda"` | ✅ Passou |
| TC02.3 | Pergunta sobre localização retorna categoria `localizacao` | Servidor online | `"onde vocês ficam?"` | `categoria: "localizacao"`, resposta contém endereço | ✅ Passou |
| TC02.4 | Pergunta sobre serviços retorna lista de serviços | Servidor online | `"quais serviços vocês oferecem?"` | `categoria: "servicos"`, resposta contém `"alinhamento"` | ✅ Passou |
| TC02.5 | Mensagem em maiúsculas é reconhecida (case-insensitive) | Servidor online | `"QUAL O PREÇO?"` | `categoria: "preco"` | ✅ Passou |
| TC02.6 | Mensagem não reconhecida retorna `desconhecido` (RF04) | Servidor online | `"xyzabc123"` | `categoria: "desconhecido"`, sugere opções | ✅ Passou |
| TC02.7 | Resposta em menos de 2 segundos (RNF01) | Servidor online | `"preço"` | Duração < 2000 ms | ✅ Passou |

---

### UC03 – Solicitar Atendimento Humano

| ID | Descrição | Pré-condição | Entrada | Resultado Esperado | Status |
|----|-----------|--------------|---------|-------------------|--------|
| TC03.1 | Palavra "humano" retorna `transferencia: true` | Servidor online | `"quero falar com um humano"` | `transferencia: true`, `categoria: "humano"` | ✅ Passou |
| TC03.2 | Resposta de transferência contém informações de contato | Servidor online | `"atendente"` | `transferencia: true`, resposta com telefone | ✅ Passou |
| TC03.3 | Mensagem comum não aciona transferência | Servidor online | `"qual o preço?"` | `transferencia: false` | ✅ Passou |

---

## 5. Testes Unitários – `processarMensagem()`

| ID | Descrição | Entrada | Resultado Esperado | Status |
|----|-----------|---------|-------------------|--------|
| TU01 | Reconhece saudação `"oi"` | `"oi"` | `categoria: "saudacao"` | ✅ Passou |
| TU02 | Reconhece marca Michelin | `"vocês têm pneus michelin?"` | `categoria: "marcas"` | ✅ Passou |
| TU03 | Texto aleatório retorna desconhecido | `"qwerty12345"` | `categoria: "desconhecido"` | ✅ Passou |

---

## 6. Rastreabilidade – Requisitos × Casos de Teste

| Requisito | Descrição | Casos de Teste |
|-----------|-----------|----------------|
| RF01 | Usuário envia mensagens | TC01.1 – TC01.4 |
| RF02 | Responder sobre preço, serviço, horário, localização | TC02.1 – TC02.4 |
| RF03 | Identificar palavras-chave | TC02.5, TU01 – TU02 |
| RF04 | Informar quando não sabe responder | TC02.6 |
| RF05 | Encaminhar para atendimento humano | TC03.1 – TC03.3 |
| RNF01 | Resposta em até 2 segundos | TC02.7 |

---

## 7. Como Executar os Testes

```bash
cd backend
npm install
npm test
```

Os resultados são exibidos no terminal com status de cada caso de teste.

---

*Documento criado no sprint TP4 – Atualização com resultados prevista no TP5.*

---

## 8. Resultado da Execução (Sprint TP4)

```
PASS ./server.test.js
  UC01 – Enviar mensagem
    ✓ TC01.1 – Mensagem válida retorna status 200 e campo 'resposta' (40 ms)
    ✓ TC01.2 – Mensagem vazia retorna status 400 com erro descritivo (5 ms)
    ✓ TC01.3 – Body sem campo 'mensagem' retorna status 400 (4 ms)
    ✓ TC01.4 – Mensagem com apenas espaços retorna status 400 (3 ms)
  UC02 – Receber resposta do chatbot
    ✓ TC02.1 – Pergunta sobre preço retorna categoria 'preco' (4 ms)
    ✓ TC02.2 – Pergunta sobre horário retorna categoria 'horario' (3 ms)
    ✓ TC02.3 – Pergunta sobre localização retorna categoria 'localizacao' (3 ms)
    ✓ TC02.4 – Pergunta sobre serviços retorna categoria 'servicos' (3 ms)
    ✓ TC02.5 – Mensagem com maiúsculas é reconhecida (case-insensitive) (5 ms)
    ✓ TC02.6 – Mensagem não reconhecida retorna categoria 'desconhecido' (RF04) (3 ms)
    ✓ TC02.7 – Resposta retorna em menos de 2000ms (RNF01) (2 ms)
  UC03 – Solicitar atendimento humano
    ✓ TC03.1 – Mensagem 'humano' retorna transferencia=true (3 ms)
    ✓ TC03.2 – Resposta de transferência contém informações de contato (4 ms)
    ✓ TC03.3 – Mensagem comum não aciona transferência (transferencia=false) (10 ms)
  Unidade – processarMensagem()
    ✓ TU01 – Reconhece saudação 'oi'
    ✓ TU02 – Reconhece marca Michelin
    ✓ TU03 – Retorna desconhecido para texto aleatório

Tests: 17 passed, 17 total — Time: 0.746s
```

**Todos os 17 testes passaram com sucesso.**