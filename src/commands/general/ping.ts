import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';

export const pingCommand: Command = {
    name: 'ping',
    description: 'Verifica a latência do bot.',
    category: 'geral',
    async execute(message: Message) {
        await message.reply('Pong! 🏓');
    }
};
