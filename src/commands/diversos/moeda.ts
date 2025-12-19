import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando de Cara ou Coroa.
 * Retorna aleatoriamente "Cara" ou "Coroa".
 */
export const moedaCommand: Command = {
    name: 'moeda',
    description: 'Gira uma moeda (Cara ou Coroa).',
    category: 'diversos',
    async execute(message: Message, args: string[]) {
        const resultado = Math.random() < 0.5 ? 'Cara' : 'Coroa';
        const emoji = resultado === 'Cara' ? '👤' : '👑';

        const embed = Embeds.info(
            message.client,
            'Cara ou Coroa',
            `🪙 A moeda girou e caiu em: **${resultado}** ${emoji}!`
        );

        await message.reply({ embeds: [embed] });
    }
};
