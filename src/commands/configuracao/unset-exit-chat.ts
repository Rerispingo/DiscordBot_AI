import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import { GuildConfigSystem } from '../../guildConfig.js';

/**
 * Comando para remover o canal de saída (adeus).
 */
export const unsetExitChatCommand: Command = {
    name: 'unset-exit-chat',
    description: 'Remove a configuração do canal de mensagens de adeus.',
    category: 'configuracao',
    onlyManager: true,
    async execute(message: Message) {
        if (!message.guildId) return;

        await GuildConfigSystem.updateConfig(message.guildId, { exitChannelId: undefined });

        await message.reply({
            embeds: [Embeds.success(message.client, 'Configuração do canal de adeus removida com sucesso!')]
        });
    }
};
