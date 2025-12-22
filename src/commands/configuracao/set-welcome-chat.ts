import { Message, ChannelType } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import { GuildConfigSystem } from '../../guildConfig.js';

/**
 * Comando para definir o canal de boas-vindas.
 */
export const setWelcomeChatCommand: Command = {
    name: 'set-welcome-chat',
    description: 'Define o canal para mensagens de boas-vindas.',
    category: 'configuracao',
    onlyManager: true,
    async execute(message: Message, args: string[]) {
        const channel = message.mentions.channels.first() || message.guild?.channels.cache.get(args[0]);

        if (!channel || channel.type !== ChannelType.GuildText) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Você deve mencionar um canal de texto válido ou fornecer o ID.')]
            });
            return;
        }

        if (!message.guildId) return;

        await GuildConfigSystem.updateConfig(message.guildId, { welcomeChannelId: channel.id });

        await message.reply({
            embeds: [Embeds.success(message.client, `Canal de boas-vindas definido para: ${channel}!`)]
        });
    }
};
