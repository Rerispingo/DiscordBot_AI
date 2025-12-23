import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import { GuildConfigSystem } from '../../guildConfig.js';

/**
 * Comando para remover o canal de boas-vindas.
 */
export const unsetWelcomeChatCommand: Command = {
    name: 'unset-welcome-chat',
    description: 'Remove a configuração do canal de mensagens de boas-vindas.',
    category: 'configuracao',
    onlyManager: true,
    async execute(message: Message) {
        if (!message.guildId) return;

        await GuildConfigSystem.updateConfig(message.guildId, { welcomeChannelId: undefined });

        await message.reply({
            embeds: [Embeds.success(message.client, 'Configuração do canal de boas-vindas removida com sucesso!')]
        });
    }
};
