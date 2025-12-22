import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import { GuildConfigSystem } from '../../guildConfig.js';

/**
 * Comando para definir a mensagem de adeus.
 */
export const setExitMsgCommand: Command = {
    name: 'set-exit-msg',
    description: 'Define a mensagem personalizada de adeus.',
    category: 'admin',
    onlyManager: true,
    async execute(message: Message, args: string[]) {
        if (!args.length) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Você deve fornecer a mensagem de adeus.')]
            });
            return;
        }

        const exitMsg = args.join(' ');

        if (!message.guildId) return;

        await GuildConfigSystem.updateConfig(message.guildId, { exitMessage: exitMsg });

        await message.reply({
            embeds: [Embeds.success(message.client, `Mensagem de adeus definida para:\n\`${exitMsg}\``)]
        });
    }
};
