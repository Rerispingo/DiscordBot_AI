# Estrutura do Projeto - Discord Bot (TS)

## 🚀 Visão Geral do Bot

Este documento detalha a arquitetura e a estrutura do projeto de um bot para Discord, desenvolvido em TypeScript com `discord.js`. O objetivo é criar um bot robusto, escalável e de fácil manutenção, seguindo as melhores práticas de desenvolvimento.

### Filosofia de Design

-   **Modularidade**: O código é organizado em módulos independentes, facilitando o desenvolvimento, teste e manutenção de funcionalidades específicas.
-   **Escalabilidade**: Projetado para lidar com múltiplos servidores e um número crescente de usuários, com foco em performance e eficiência.
-   **Segurança**: Implementação de validações rigorosas e controle de permissões para proteger o bot e os usuários.
-   **Manutenibilidade**: Utilização de TypeScript para tipagem forte, padrões de design e documentação clara para garantir a longevidade do projeto.

### Tecnologias Chave

-   **TypeScript**: Linguagem de programação que adiciona tipagem estática ao JavaScript, melhorando a qualidade e a manutenibilidade do código.
-   **discord.js**: Biblioteca poderosa e flexível para interagir com a API do Discord.
-   **ES Modules (ESM)**: Padrão moderno para módulos JavaScript, proporcionando melhor organização e carregamento de código.
-   **Vitest**: Framework de testes moderno e rápido, compatível com TypeScript, utilizado para garantir a confiabilidade das funcionalidades.

## 📂 Hierarquia de Arquivos
- `.env`: Configurações de ambiente (Token, IDs).
- `.env.example`: Exemplo de configuração.
- `package.json`: Gerenciamento de dependências e scripts.
- `tsconfig.json`: Configurações do TypeScript.
- `src/`: Código fonte modularizado.
    -   `index.ts`: Ponto de entrada principal do bot. Inicializa o cliente Discord, carrega configurações, registra handlers de comandos e eventos, e realiza o login do bot na API do Discord. É o orquestrador central da aplicação.
    -   `managers.ts`: Gerencia a lógica de persistência e o cache em memória dos managers (usuários com permissões administrativas) por servidor. Inclui funções para adicionar, remover e verificar managers, garantindo que as permissões sejam carregadas e salvas de forma eficiente.
    -   `guildConfig.ts`: Responsável por gerenciar as configurações específicas de cada servidor (guild), como canais de boas-vindas e mensagens de saída. Ele lida com a persistência dessas configurações em um arquivo JSON e as disponibiliza para o bot.
    -   `pursuerSystem.ts`: Implementa o sistema de 'perseguição' a usuários, onde o bot reage a mensagens e pode deletá-las. Gerencia a lista de usuários perseguidos globalmente, persistindo os dados em um arquivo JSON.
    -   `types/`: Contém definições de interfaces e tipos TypeScript que garantem a tipagem forte e a consistência em todo o projeto.
    -   `command.ts`: Define a interface `Command` e `CommandArgument`, que padroniza a estrutura de todos os comandos do bot, incluindo nome, aliases, descrição, categoria, argumentos detalhados (com tipos e obrigatoriedade), e flags de permissão (ex: `onlyRoot`, `onlyManager`).
    -   `handlers/`: Contém a lógica central para o processamento de eventos e comandos.
    -   `commandHandler.ts`: Orquestra o ciclo de vida dos comandos, desde o registro até a execução. Delega responsabilidades de carregamento, validação e restrição para serviços especializados, focando no fluxo principal de processamento de mensagens.
    -   `events/`: Contém os listeners de eventos do Discord.
        -   `guildMemberAdd.ts`: Gerencia a entrada de novos membros (boas-vindas).
        -   `guildMemberRemove.ts`: Gerencia a saída de membros (adeus).
        -   `messageCreate.ts`: Processa novas mensagens e comandos.
        -   `messageUpdate.ts`: Monitora e registra edições de mensagens no `message-log`.
        -   `messageDelete.ts`: Monitora e registra exclusões de mensagens no `message-log`.
        -   `ready.ts`: Inicialização e log de login do bot.
    -   `services/`: Módulos que encapsulam lógicas de negócio específicas, com responsabilidade única.
    -   `commandLoaderService.ts`: Lida com o carregamento dinâmico e recursivo de comandos a partir do sistema de arquivos e mapeamento de aliases.
    -   `argumentValidatorService.ts`: Valida os argumentos passados pelo usuário (quantidade e tipos) com base na definição de cada comando.
    -   `channelRestrictionService.ts`: Gerencia restrições de uso de comandos em canais protegidos (como canais de logs).
    -   `customErrors.ts`: Define classes de erro personalizadas (`BotError`, `ValidationError`, `PermissionError`, etc.) para um tratamento de erros mais granular e informativo.
    -   `permissionService.ts`: Centraliza a lógica de validação de acesso e permissões.
    -   `loggerService.ts`: Responsável por gerenciar o registro de eventos e comandos em canais de log.
    -   `errorHandlerService.ts`: Serviço centralizado para captura, log e resposta de erros, integrando-se com o sistema de erros personalizados.
    -   `utils/`: Contém funções e classes utilitárias que são compartilhadas por diferentes partes do bot, promovendo a reutilização de código.
    -   `pagination.ts`: Implementa um sistema de paginação interativo para mensagens do Discord, permitindo que o bot exiba listas longas de informações de forma organizada através de botões de navegação.
    -   `embeds.ts`: Uma fábrica de `Embeds` do Discord, padronizando a criação de mensagens ricas e visualmente atraentes com cores, títulos e campos consistentes.
    -   `commands/`: Contém a implementação de todos os comandos do bot, organizados por categorias para facilitar a localização e manutenção.
    -   `commandStore.ts`: Atua como um registro centralizado para todos os comandos carregados, permitindo que o `commandHandler` os acesse e execute dinamicamente.
        -   `consulta/`: Comandos de consulta e utilitários básicos, acessíveis por qualquer usuário, como `./ajuda` e `./ping`.
        -   `admin/`: Comandos restritos a usuários com a permissão de Root Manager, como `./off` (desligar o bot) e `./manageradd` (gerenciar managers).
        -   `diversos/`: Comandos de utilidade e diversão, como `./dado`, `./8ball` e `./moeda`.
        -   `mod-voz/`: Comandos de moderação específicos para canais de voz, como `./voice-lock` e `./voice-kick`, acessíveis apenas por Managers.
        -   `mod-chat/`: Comandos de moderação para canais de texto, como `./chat-lock` e `./nuke`, também restritos a Managers.
        -   `configuracao/`: Comandos para configurar funcionalidades do bot por servidor, como mensagens de boas-vindas e saída, acessíveis por Managers.
        -   `perigoso/`: Comandos com funcionalidades sensíveis, restritos ao Root Manager, como o sistema de perseguição de usuários (`./chat-pursuer`).
-   `data/`: Contém arquivos JSON para persistência de dados, garantindo que as configurações e estados do bot sejam mantidos entre as reinicializações.
    -   `managers.json`: Armazena a lista de IDs de usuários que são managers em cada servidor, permitindo o controle de permissões administrativas.
    -   `guild_configs.json`: Guarda as configurações personalizadas de cada servidor, como o canal de boas-vindas, a mensagem de boas-vindas, o canal de saída e a mensagem de saída.
    -   `pursued_users.json`: Mantém um registro global dos IDs de usuários que estão sendo 'perseguidos' pelo bot, utilizado pelo `pursuerSystem`.
    -   `status.json`: Persiste o status de atividade atual do bot (tipo e texto), permitindo que o bot retome seu status anterior após uma reinicialização.
    -   `workspace.json`: Define a estrutura padrão de categoria e canais (ex: `moderation-log`, `message-log`, `debugs`) que o bot pode criar em um servidor, facilitando a configuração inicial do ambiente de trabalho do bot.
    -   `emojis.json`: Contém uma lista de emojis utilizados pelo comando `./emojirandom`.
    -   `8ball.json`: Armazena as possíveis respostas para o comando `./8ball`.
    -   `piadas.json`: Contém uma coleção de piadas para o comando `./piada`.
-   `dist/`: Diretório onde o código TypeScript compilado é armazenado em JavaScript, pronto para execução.
-   `tests/`: Contém a suíte de testes automatizados do projeto, utilizando o framework Vitest para garantir a qualidade e o comportamento esperado das funcionalidades.
    -   `managers.test.ts`: Testes unitários e de integração para o sistema de gerenciamento de managers.
    -   `embeds.test.ts`: Testes para os utilitários de criação de embeds, garantindo que as mensagens ricas sejam formatadas corretamente.
    -   `src/handlers/__tests__/commandHandler.test.ts`: Testes detalhados para o ciclo de vida dos comandos, validações e restrições.
    -   `src/services/__tests__/customErrors.test.ts`: Testes para a hierarquia de erros personalizados.
-   `structure.md`: Este documento, que descreve a arquitetura, a hierarquia de arquivos e as diretrizes de desenvolvimento do projeto.

## 🛠️ Diretrizes de Desenvolvimento

Para garantir a qualidade, manutenibilidade e escalabilidade do projeto, as seguintes diretrizes de desenvolvimento devem ser seguidas:

-   **TypeScript e Tipagem Forte**: Utilize TypeScript para todas as novas funcionalidades e refatorações. Garanta que as interfaces e tipos sejam definidos de forma clara e precisa para aproveitar ao máximo os benefícios da tipagem forte.
-   **Modularidade**: Mantenha os módulos com responsabilidades únicas e bem definidas. Evite acoplamento excessivo entre os componentes.
-   **Tratamento de Erros**: Implemente um tratamento de erros robusto em todo o código, utilizando `try-catch` e validações adequadas para garantir a resiliência do bot.
-   **Testes Automatizados**: Escreva testes unitários e de integração para as funcionalidades críticas, utilizando Vitest. Isso garante que as alterações não introduzam regressões e que o comportamento do bot seja previsível.
-   **Documentação Interna (JSDoc)**: Documente todas as funções, classes e exportações públicas utilizando JSDoc. Isso facilita a compreensão do código, a colaboração entre desenvolvedores e a manutenção futura. Para funções e exportações públicas, a documentação deve ser enxuta e rápida, focando no propósito e nos parâmetros.
-   **Clean Code e SOLID**: Siga os princípios de Clean Code e SOLID para escrever um código legível, flexível e fácil de estender.
-   **Variáveis de Ambiente**: Utilize variáveis de ambiente para configurações sensíveis (tokens, IDs) e para diferenciar ambientes de desenvolvimento e produção.

## Comandos Disponíveis (Prefixo: `./`)
### 🔍 Consultas
- `./ajuda` ou `./`: Exibe a central de ajuda com comandos categorizados.
- `./ping`: Testa a conexão com o bot.
- `./github`: Envia o link do repositório do bot no GitHub.
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

### 👑 Administração Root (Root Only)
*Localizados em `src/commands/admin/` e `src/commands/perigoso/`*
- `./off`: Desliga o bot.
- `./manageradd @user`: Adiciona manager ao servidor.
- `./managerremove @user`: Remove manager do servidor.
- `./create-workspace`: Configura canais e categoria do bot.
- `./delete-workspace`: Remove o workspace do bot.
- `./status-type (tipo)`: Altera tipo de atividade.
- `./status-text (texto)`: Altera texto da atividade.

#### ☣️ Comandos Perigosos
- `./chat-pursuer @user`: Ativa perseguição ao usuário (global).
- `./chat-pursuer-disable @user`: Desativa perseguição ao usuário (global).

### 🔊 Moderação de Voz (Managers)
- `./voice-lock`: Tranca o canal de voz para apenas 1 pessoa (Managers).
- `./voice-unlock`: Libera o canal de voz para entrada ilimitada (Managers).
- `./voice-kick @user`: Remove um usuário da chamada de voz (Managers).
- `./voice-move @user`: Move um usuário para sua chamada de voz (Managers).

### 💬 Moderação de Chat (Managers)
- `./chat-lock`: Bloqueia o canal de texto atual para envio de mensagens (Managers).
- `./chat-unlock`: Desbloqueia o canal de texto atual para envio de mensagens (Managers).
- `./msg-delete (quantidade)`: Deleta mensagens do chat (Managers e Root Manager). Mapeado internamente como Moderação de Chat.
- `./nuke`: Recria o canal de texto atual, apagando todo o histórico (Managers).

### ⚙️ Configurações (Managers)
*Localizados em `src/commands/configuracao/`*
- `./set-welcome-chat #canal`: Define o canal para mensagens de boas-vindas.
- `./unset-welcome-chat`: Remove a configuração do canal de boas-vindas.
- `./set-exit-chat #canal`: Define o canal para mensagens de adeus.
- `./unset-exit-chat`: Remove a configuração do canal de adeus.
- `./set-welcome-msg (msg)`: Define a mensagem personalizada de boas-vindas.
- `./set-exit-msg (msg)`: Define a mensagem personalizada de adeus.

## Variáveis de Ambiente
- `DISCORD_TOKEN`: Token secreto do bot.
- `ROOT_MANAGER_ID`: ID do usuário com permissão total.
- `CLIENT_ID`: ID da aplicação Discord.
- `GUILD_ID`: ID do servidor principal (opcional).

## Scripts
- `npm run build`: Compila o projeto para a pasta `dist`.
- `npm run start`: Realiza o build e inicia o bot a partir do código compilado.
- `npm run dev`: Inicia o bot em modo de desenvolvimento com `nodemon`.
-   `npm run test`: Executa a suíte de testes automatizados com Vitest.
