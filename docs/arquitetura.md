# Arquitetura do Sistema

## 🎯 Visão Geral

O sistema consiste em um chatbot de atendimento para a Pneus Nacional, responsável por responder dúvidas frequentes de clientes de forma automatizada.

---

## 🧱 Modelo Arquitetural (C4)

### 🔹 Nível 1 — Contexto

O usuário interage com o sistema através de uma interface web.  
O sistema processa a mensagem e retorna uma resposta automática.

---

### 🔹 Nível 2 — Containers

O sistema é dividido em:

- **Frontend (Interface Web)**
  - Responsável pela interação com o usuário

- **Backend (API do Chatbot)**
  - Responsável pelo processamento das mensagens

---

### 🔹 Nível 3 — Componentes (Backend)

- **Controller de mensagens**
  - Recebe requisições do frontend

- **Processador de texto**
  - Identifica palavras-chave nas mensagens

- **Gerador de respostas**
  - Retorna respostas pré-definidas

---

## ⚙️ Tecnologias Escolhidas

- **Frontend:** HTML, CSS e JavaScript  
- **Backend:** Node.js com Express *(ou Python Flask)*  
- **Comunicação:** HTTP (API REST simples)  
- **Hospedagem:** plataformas gratuitas  

---

## 🧠 Justificativa da Arquitetura

A arquitetura foi projetada com separação entre frontend e backend, o que facilita a organização do sistema e permite evolução futura.

O modelo baseado em componentes reduz a complexidade e melhora a manutenção. Além disso, essa estrutura permite escalabilidade e futura adaptação para microserviços.

As tecnologias foram escolhidas por serem simples, gratuitas e amplamente utilizadas, facilitando o desenvolvimento e aprendizado.

---

## 🚀 Planejamento do TP3

Para o próximo sprint (TP3), estão previstas as seguintes atividades:

- Implementação do backend do chatbot
- Criação da interface web (frontend)
- Implementação da lógica de respostas baseada em palavras-chave
- Integração entre frontend e backend
- Testes iniciais do sistema

Essas atividades visam entregar uma primeira versão funcional do chatbot, conforme os requisitos definidos no TP1.