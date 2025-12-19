import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';

export const offCommand: Command = {
    name: 'off',
    description: 'Desliga o bot.',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message) {
        await message.reply('Desligando... 👋');
        console.log(`Bot desligado por ${message.author.tag}`);
        message.client.destroy();
        process.exit(0);
    }
};
