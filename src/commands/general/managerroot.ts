import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';

export const managerRootCommand: Command = {
    name: 'managerroot',
    description: 'Mostra quem é o Root Manager do bot.',
    category: 'geral',
    async execute(message: Message) {
        const rootId = process.env.ROOT_MANAGER_ID;
        if (!rootId) {
            await message.reply('❌ O Root Manager não está configurado.');
            return;
        }
        await message.reply(`👑 O Root Manager deste bot é: <@${rootId}>`);
    }
};
