import { Client, GatewayIntentBits, Events } from 'discord.js';
import * as dotenv from 'dotenv';
import { CommandHandler } from './handlers/commandHandler.js';
import { StatusManager } from './statusManager.js';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const commandHandler = new CommandHandler();

client.once(Events.ClientReady, async (readyClient) => {
    console.log(`🚀 Bot online! Logado como ${readyClient.user.tag}`);
    
    // Inicializa o status do bot
    const status = await StatusManager.load();
    readyClient.user.setActivity(status.text, { type: status.type });
});

client.on(Events.MessageCreate, async (message) => {
    await commandHandler.handle(message);
});

const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error('ERRO: DISCORD_TOKEN não encontrado no arquivo .env');
    process.exit(1);
}

client.login(token);
