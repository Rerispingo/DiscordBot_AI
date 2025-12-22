import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import { PursuerSystem } from '../../pursuerSystem.js';

/**
 * Comando para começar a perseguir um usuário.
 * Restrito ao Root Manager.
 */
export const chatPursuerCommand: Command = {
    name: 'chat-pursuer',
    description: 'Começa a perseguir um usuário (reações e chance de apagar mensagens).',
    category: 'perigoso',
    onlyRoot: true,
    async execute(message: Message, args: string[]) {
        const targetUser = message.mentions.users.first() || (args[0] ? await message.client.users.fetch(args[0]).catch(() => null) : null);

        if (!targetUser) {
            await message.reply({ 
                embeds: [Embeds.error(message.client, 'Você deve mencionar um usuário ou fornecer o ID.')] 
            });
            return;
        }

        await PursuerSystem.add(targetUser.id);

        await message.reply({ 
            embeds: [Embeds.success(message.client, `O usuário **${targetUser.tag}** agora está sendo perseguido! 😈`)] 
        });
    }
};
