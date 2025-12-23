import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import { GuildConfigSystem } from '../../guildConfig.js';

/**
 * Comando para definir a mensagem de boas-vindas.
 */
export const setWelcomeMsgCommand: Command = {
    name: 'set-welcome-msg',
    description: 'Define a mensagem personalizada de boas-vindas.',
    usage: '(mensagem)',
    category: 'configuracao',
    onlyManager: true,
    async execute(message: Message, args: string[]) {
        if (!args.length) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Você deve fornecer a mensagem de boas-vindas.')]
            });
            return;
        }

        const welcomeMsg = args.join(' ');

        if (!message.guildId) return;

        await GuildConfigSystem.updateConfig(message.guildId, { welcomeMessage: welcomeMsg });

        await message.reply({
            embeds: [Embeds.success(message.client, `Mensagem de boas-vindas definida para:\n\`${welcomeMsg}\``)]
        });
    }
};
