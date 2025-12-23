# 🤖 Discord Bot AI - Guia do Usuário

Bem-vindo ao guia de utilização do **Discord Bot AI**! Este bot foi desenvolvido para ajudar na administração de servidores e proporcionar diversão aos usuários com comandos interativos.

O prefixo padrão para todos os comandos é: `./`

---

## 📖 Comandos de Ajuda

*   **`./ajuda`** ou **`./`**: Exibe a lista completa de comandos disponíveis para você, organizados por categorias.
*   **`./ajudaroot`**: Exibe comandos exclusivos do administrador principal (Root Manager).

---

## 🎲 Comandos Diversos (Diversão & Utilidade)

Esta categoria contém comandos para interagir com o bot e passar o tempo.

*   **`./dado (faces)`**: Rola um dado. Você pode especificar o número de faces (ex: `./dado 20`). O padrão é 6.
*   **`./8ball (pergunta)`**: Faça uma pergunta à Bola 8 Mágica e receba uma resposta (sarcástica) do além.
*   **`./moeda`**: Gira uma moeda e retorna "Cara" ou "Coroa".
*   **`./reverter (texto)`**: O bot repete o texto que você digitou, mas de trás para frente.
*   **`./escolha (opção1, opção2, ...)`**: Está indeciso? Separe suas opções por vírgula e o bot escolherá uma para você.
*   **`./ascii (texto)`**: Transforma seu texto em uma arte ASCII estilizada (máximo 20 caracteres).
*   **`./piada`**: Conta uma piada aleatória sobre programação e tecnologia.

---

## 🔍 Comandos de Consulta

Informações básicas e comandos utilitários para todos os usuários.

*   **`./ping`**: Verifica se o bot está online e qual a latência da conexão.
*   **`./github`**: Envia o link do repositório do bot no GitHub.
*   **`./managers`**: Lista todos os usuários que possuem permissão de Manager no servidor atual.
*   **`./managerroot`**: Identifica quem é o administrador principal do bot.
*   **`./emojirandom (quantidade)`**: Gera uma sequência aleatória de emojis.

---

## 🔊 Moderação de Voz (Managers)

Controle os canais de voz com comandos rápidos.

*   **`./voice-lock`**: Restringe o canal de voz em que você está para apenas 1 pessoa.
*   **`./voice-unlock`**: Remove o limite de pessoas do seu canal de voz atual.
*   **`./voice-kick @user`**: Desconecta o usuário mencionado de qualquer canal de voz. (Proteção: Root Managers não podem ser kickados).
*   **`./voice-move @user`**: Puxa o usuário mencionado para o mesmo canal de voz que você. (Proteção: Root Managers não podem ser movidos).

---

## 💬 Moderação de Chat (Managers)

Gerencie o fluxo de mensagens e limpe o histórico dos canais.

*   **`./chat-lock`**: Bloqueia o canal de texto atual, impedindo que membros enviem mensagens.
*   **`./chat-unlock`**: Desbloqueia o canal de texto, permitindo o envio de mensagens novamente.
*   **`./msg-delete (quantidade)`**: Remove rapidamente uma quantidade específica de mensagens recentes do canal atual.
*   **`./nuke`**: Recria o canal de texto atual com as mesmas permissões e posição, mas com o histórico totalmente limpo.

---

## ⚙️ Configurações (Managers)

Configure as mensagens automáticas do servidor.

*   **`./set-welcome-chat #canal`**: Define em qual canal o bot enviará as mensagens de boas-vindas.
*   **`./unset-welcome-chat`**: Remove a configuração do canal de mensagens de boas-vindas.
*   **`./set-exit-chat #canal`**: Define em qual canal o bot enviará as mensagens de adeus.
*   **`./unset-exit-chat`**: Remove a configuração do canal de mensagens de adeus.
*   **`./set-welcome-msg (msg)`**: Define a frase personalizada de boas-vindas.
*   **`./set-exit-msg (msg)`**: Define a frase personalizada de adeus.

---

## 👑 Comandos de Root Manager (Exclusivos)

Estes comandos só podem ser executados pelo proprietário do bot.

*   **`./off`**: Desliga o bot imediatamente.
*   **`./manageradd @usuario`**: Adiciona um usuário à lista de Managers do servidor.
*   **`./managerremove @usuario`**: Remove um usuário da lista de Managers.
*   **`./create-workspace`**: Cria automaticamente uma categoria e canais dedicados para o bot no servidor com base no `workspace.json`. O workspace inclui o canal `logs`, usado para registrar comandos executados no servidor.
*   **`./delete-workspace`**: Remove a categoria e os canais do workspace do bot. Canais adicionais não listados no `workspace.json` são movidos para a categoria `Outros`.
*   **`./status-type (tipo)`**: Altera o tipo de atividade do bot (jogando, assistindo, ouvindo ou competindo).
*   **`./status-text (texto)`**: Altera o texto personalizado da atividade do bot.
### Comandos Perigosos (Root Manager)

Estes comandos permitem ações mais sensíveis e devem ser usados com cautela.

*   **`./chat-pursuer @user`**: Ativa o modo de perseguição para um usuário. O bot reagirá a todas as mensagens dele e terá 20% de chance de deletá-las automaticamente.
*   **`./chat-pursuer-disable @user`**: Desativa o modo de perseguição para o usuário.

---

## ✨ Automações e Eventos

O bot possui sistemas automáticos que reagem a eventos no servidor:

*   **Boas-vindas Automáticas**: Quando um novo membro entra, o bot envia uma mensagem de boas-vindas em um embed estilizado, mostrando a foto de perfil e o nome do usuário.
*   **Avisos de Saída**: Quando um membro sai do servidor, o bot envia uma mensagem de despedida para manter o log de membros atualizado.
*   **Monitoramento de Comandos**: Todos os comandos administrativos executados são registrados no canal de `#logs` do workspace do bot para auditoria.

---

## 🚀 Como começar

Basta digitar `./ajuda` em qualquer canal que o bot tenha permissão de leitura para ver o que ele pode fazer por você!
