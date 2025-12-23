import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para reverter um texto.
 * O bot escreve a frase do usuário de trás para frente.
 */
export const reverterCommand: Command = {
    name: 'reverter',
    description: 'Inverte o texto fornecido.',
    usage: '(texto)',
    category: 'diversos',
    async execute(message: Message, args: string[]) {
        if (args.length === 0) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Você precisa fornecer um texto para inverter!')]
            });
            return;
        }

        const textoOriginal = args.join(' ');
        const textoInvertido = textoOriginal.split('').reverse().join('');

        const embed = Embeds.info(
            message.client,
            'Texto Revertido',
            `**Original:** ${textoOriginal}\n**Invertido:** ${textoInvertido}`
        );

        await message.reply({ embeds: [embed] });
    }
};
