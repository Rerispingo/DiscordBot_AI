import { Events } from 'discord.js';
import type { BotEvent } from '../types/event.js';
import type { BotContext } from '../container.js';

export const messageCreateEvent: BotEvent<BotContext> = {
    name: Events.MessageCreate,
    async execute(context, message) {
        await context.commandHandler.handle(message);
    },
};
