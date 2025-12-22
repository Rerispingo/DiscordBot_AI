import { Client, GatewayIntentBits } from 'discord.js';
import { Config, assertRuntimeConfig } from './config.js';
import { createContainer } from './container.js';
import { EventHandler } from './handlers/eventHandler.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
    ],
});

async function main() {
    const container = createContainer(client);
    container.errorHandler.registerProcessHandlers();
    container.errorHandler.registerClientHandlers(client);

    try {
        assertRuntimeConfig();
    } catch (error) {
        container.errorHandler.handleFatalError(error);
        process.exit(1);
    }

    const eventHandler = new EventHandler(client, container);
    await eventHandler.loadEvents();

    await client.login(Config.bot.token);
}

void main();
