import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import { PursuerSystem } from '../../pursuerSystem.js';

/**
 * Comando para parar de perseguir um usuário.
 * Restrito ao Root Manager.
 */
export const chatPursuerDisableCommand: Command = {
    name: 'chat-pursuer-disable',
    description: 'Para de perseguir um usuário.',
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

        await PursuerSystem.remove(targetUser.id);

        await message.reply({ 
            embeds: [Embeds.success(message.client, `A perseguição ao usuário **${targetUser.tag}** foi desativada.`)] 
        });
    }
};
