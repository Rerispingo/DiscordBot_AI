# Estrutura do Projeto - Discord Bot (TS)

## Descrição
Um sistema de bot para Discord desenvolvido em TypeScript utilizando a biblioteca `discord.js`. O projeto utiliza ES Modules (ESM) e possui uma arquitetura modular para fácil manutenção.

## Hierarquia de Arquivos
- `.env`: Configurações de ambiente (Token, IDs).
- `.env.example`: Exemplo de configuração.
- `package.json`: Gerenciamento de dependências e scripts.
- `tsconfig.json`: Configurações do TypeScript.
- `src/`: Código fonte modularizado.
    - `index.ts`: Ponto de entrada (Inicialização do cliente).
    - `managers.ts`: Lógica de persistência e gerenciamento de permissões.
    - `types/`: Definições de interfaces e tipos.
        - `command.ts`: Interface base para todos os comandos.
    - `handlers/`: Processadores de eventos e lógica central.
        - `commandHandler.ts`: Gerencia o registro e execução de comandos.
    - `commands/`: Pasta contendo a implementação de todos os comandos.
        - `general/`: Comandos públicos (ajuda, ping).
        - `admin/`: Comandos restritos (off, manageradd, managerremove).
        - `diversos/`: Comandos de utilidade e diversão (dado, 8ball, moeda, etc).
        - `mod-voz/`: Comandos de moderação de canais de voz (voice-lock, voice-kick, etc).
- `data/`: Armazenamento de dados persistentes.
    - `managers.json`: Lista de managers por servidor.
    - `emojis.json`: Lista de 200 emojis para o comando emojirandom.
    - `8ball.json`: Respostas para o comando de Bola 8.
    - `piadas.json`: Lista de piadas para o comando de piada.
- `dist/`: Código compilado (JavaScript).
- `tests/`: Suíte de testes automatizados (Jest).
    - `managers.test.ts`: Testes para o sistema de managers.
    - `embeds.test.ts`: Testes para os utilitários de embeds.
- `structure.md`: Documentação da estrutura lógica.
- `jest.config.js`: Configuração do framework de testes Jest.

## Comandos Disponíveis (Prefixo: `./`)
### 🏠 Gerais
- `./ajuda` ou `./`: Exibe a central de ajuda com comandos categorizados.
- `./ping`: Testa a conexão com o bot.
- `./managers`: Lista todos os managers cadastrados no servidor atual.
- `./managerroot`: Mostra quem é o Root Manager do bot.
- `./emojirandom (quantidade)`: Sorteia uma sequência de emojis aleatórios.

### 🎲 Diversos
- `./dado (faces)`: Rola um dado com o número de faces especificado (padrão 6).
- `./8ball (pergunta)`: Responde a uma pergunta com a sabedoria da Bola 8 Mágica.
- `./moeda`: Gira uma moeda virtual (Cara ou Coroa).
- `./reverter (texto)`: Inverte o texto fornecido pelo usuário.
- `./escolha (opção1, opção2, ...)`: Escolhe aleatoriamente entre as opções fornecidas.
- `./ascii (texto)`: Converte o texto em uma arte ASCII estilizada.
- `./piada`: Conta uma piada aleatória sobre o mundo da programação.

### 👑 Administrativos
- `./off`: Desliga o bot (Apenas Root Manager).
- `./manageradd @usuario`: Promove um usuário a manager (Apenas Root Manager).
- `./managerremove @usuario`: Remove um usuário da lista de managers (Apenas Root Manager).
- `./creation-workspace`: Cria uma área de trabalho exclusiva (categoria e canais) para o bot (Apenas Root Manager).
- `./ajudaroot`: Exibe os comandos exclusivos do Root Manager.

### 🛡️ Comandos de Moderacao Gerais
- `./msg-delete (quantidade)`: Deleta mensagens do chat (Managers e Root Manager).

### 🔊 Moderação de Voz
- `./voice-lock`: Tranca o canal de voz para apenas 1 pessoa (Managers).
- `./voice-unlock`: Libera o canal de voz para entrada ilimitada (Managers).
- `./voice-kick @user`: Remove um usuário da chamada de voz (Managers).
- `./voice-move @user`: Move um usuário para sua chamada de voz (Managers).

## Variáveis de Ambiente
- `DISCORD_TOKEN`: Token secreto do bot.
- `ROOT_MANAGER_ID`: ID do usuário com permissão total.
- `CLIENT_ID`: ID da aplicação Discord.
- `GUILD_ID`: ID do servidor principal (opcional).

## Scripts
- `npm run build`: Compila o projeto para a pasta `dist`.
- `npm run start`: Realiza o build e inicia o bot a partir do código compilado.
- `npm run dev`: Inicia o bot em modo de desenvolvimento com `nodemon`.
- `npm run test`: Executa a suíte de testes automatizados com Jest.
