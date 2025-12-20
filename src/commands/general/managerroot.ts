import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Config } from '../../config.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para identificar o Root Manager do bot.
 */
export const managerRootCommand: Command = {
    name: 'managerroot',
    description: 'Mostra quem é o Root Manager do bot.',
    category: 'geral',
    async execute(message: Message) {
        const client = message.client;
        const rootId = Config.bot.rootManagerId;

        if (!rootId) {
            await message.reply({ embeds: [Embeds.error(client, 'O Root Manager não está configurado nas variáveis de ambiente.')] });
            return;
        }

        const embed = Embeds.info(
            client,
            'Root Manager 👑',
            `O administrador principal (Root Manager) deste bot é: <@${rootId}>`
        );

        await message.reply({ embeds: [embed] });
    }
};
