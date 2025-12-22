import { Events } from 'discord.js';
import type { BotEvent } from '../types/event.js';
import type { BotContext } from '../container.js';
import { StatusManager } from '../statusManager.js';

export const readyEvent: BotEvent<BotContext> = {
    name: Events.ClientReady,
    once: true,
    async execute(_context, readyClient) {
        console.log(`🚀 Bot online! Logado como ${readyClient.user.tag}`);

        const status = await StatusManager.load();
        readyClient.user.setActivity(status.text, { type: status.type });
    },
};
