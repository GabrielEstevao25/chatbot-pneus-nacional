# Chatbot Pneus Nacional

Chatbot de atendimento para a borracharia **Pneus Nacional**, desenvolvido como projeto acadêmico utilizando o processo **Scrum** com sprints quinzenais.

## 🎯 Objetivo

Resolver o problema de atendimento fora do horário comercial de pequenas borracharias, oferecendo um chatbot capaz de responder perguntas frequentes sobre preços, serviços, localização e horários — 24 horas por dia.

## 📁 Estrutura do Repositório

```
chatbot-pneus-nacional/
├── backend/
│   ├── server.js          # API Express com lógica do chatbot
│   ├── server.test.js     # Testes automatizados (Jest + Supertest)
│   └── package.json
├── frontend/
│   ├── index.html         # Interface do chatbot
│   ├── script.js          # Lógica de comunicação com a API
│   └── style.css          # Estilos
├── docs/
│   ├── requisitos.md      # Requisitos funcionais e não funcionais
│   ├── caso-de-uso.md     # Diagrama de casos de uso
│   ├── arquitetura.md     # Arquitetura C4
│   └── plano-de-testes.md # Plano e resultados dos testes (TP4)
├── Videos/
│   └── demo.mp4
└── README.md
```

## 🚀 Como Executar

### Backend
```bash
cd backend
npm install
npm start
# Servidor em http://localhost:3000
```

### Frontend
Abra o arquivo `frontend/index.html` no navegador.

### Testes
```bash
cd backend
npm test
```

## ✅ Sprints

| Sprint | Status | Entregável |
|--------|--------|-----------|
| TP1 | ✅ Concluído | Definição de requisitos e casos de uso |
| TP2 | ✅ Concluído | Arquitetura C4 e planejamento técnico |
| TP3 | ✅ Concluído | Primeiro entregável funcional |
| TP4 | ✅ Concluído | Chatbot com lógica real + plano de testes |
| TP5 | 🔲 Planejado | Evolução + execução dos testes |
| TP6 | 🔲 Planejado | Entrega final |

## 🛠 Tecnologias

- **Backend:** Node.js + Express
- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Testes:** Jest + Supertest
- **Versionamento:** Git + GitHub
- **Gestão:** GitHub Projects (Scrum)