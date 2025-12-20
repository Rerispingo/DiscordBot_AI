import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para verificar a latência do bot.
 */
export const pingCommand: Command = {
    name: 'ping',
    description: 'Verifica a latência do bot.',
    category: 'geral',
    async execute(message: Message) {
        const client = message.client;
        const ping = client.ws.ping;
        
        const embed = Embeds.info(
            client,
            'Pong! 🏓',
            `A latência atual do bot é de **${ping}ms**.`
        );

        await message.reply({ embeds: [embed] });
    }
};
