import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para rolar um dado.
 * O bot gera um número aleatório entre 1 e o número de faces escolhido (padrão 6).
 */
export const dadoCommand: Command = {
    name: 'dado',
    description: 'Rola um dado de N faces (padrão 6).',
    category: 'diversos',
    async execute(message: Message, args: string[]) {
        const faces = args[0] ? parseInt(args[0]) : 6;

        if (isNaN(faces) || faces <= 1) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Por favor, insira um número de faces válido (maior que 1).')]
            });
            return;
        }

        const resultado = Math.floor(Math.random() * faces) + 1;
        
        const embed = Embeds.info(
            message.client, 
            'Rolar Dado', 
            `🎲 Você rolou um dado de **${faces}** faces e tirou: **${resultado}**!`
        );

        await message.reply({ embeds: [embed] });
    }
};
