import { Client, GatewayIntentBits, Events } from 'discord.js';
import * as dotenv from 'dotenv';
import { CommandHandler } from './handlers/commandHandler.js';

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const commandHandler = new CommandHandler();

client.once(Events.ClientReady, (readyClient) => {
    console.log(`🚀 Bot online! Logado como ${readyClient.user.tag}`);
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
