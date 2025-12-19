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
- `data/`: Armazenamento de dados persistentes.
    - `managers.json`: Lista de managers por servidor.
    - `emojis.json`: Lista de 200 emojis para o comando emojirandom.
- `dist/`: Código compilado (JavaScript).
- `structure.md`: Documentação da estrutura lógica.

## Comandos Disponíveis (Prefixo: `./`)
### Gerais
- `./ajuda` ou `./`: Exibe a central de ajuda com comandos categorizados.
- `./ping`: Testa a conexão com o bot.
- `./managers`: Lista todos os managers cadastrados no servidor atual.
- `./managerroot`: Mostra quem é o Root Manager do bot.
- `./emojirandom (quantidade)`: Sorteia uma sequência de emojis aleatórios.

### Administrativos
- `./off`: Desliga o bot (Apenas Root Manager).
- `./manageradd @usuario`: Promove um usuário a manager (Apenas Root Manager).
- `./managerremove @usuario`: Remove um usuário da lista de managers (Apenas Root Manager).
- `./creation-workspace`: Cria uma área de trabalho exclusiva (categoria e canais) para o bot (Apenas Root Manager).
- `./msg-delete (quantidade)`: Deleta mensagens do chat (Managers e Root Manager).
- `./ajudaroot`: Exibe os comandos exclusivos do Root Manager.

## Variáveis de Ambiente
- `DISCORD_TOKEN`: Token secreto do bot.
- `ROOT_MANAGER_ID`: ID do usuário com permissão total.
- `CLIENT_ID`: ID da aplicação Discord.
- `GUILD_ID`: ID do servidor principal (opcional).

## Scripts
- `npm run build`: Compila o projeto para a pasta `dist`.
- `npm run start`: Inicia o bot a partir do código compilado.
- `npm run dev`: Inicia o bot em modo de desenvolvimento com `nodemon`.
