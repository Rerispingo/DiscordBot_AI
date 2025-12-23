import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import figlet from 'figlet';

/**
 * Comando para transformar texto em arte ASCII.
 */
export const asciiCommand: Command = {
    name: 'ascii',
    description: 'Transforma um texto curto em arte ASCII.',
    usage: '<texto>',
    category: 'diversos',
    minArgs: 1,
    args: [
        {
            name: 'texto',
            description: 'O texto que você deseja transformar em ASCII (máx 20 caracteres)',
            required: true,
            type: 'string'
        }
    ],
    examples: ['Vibe', 'Hello'],
    async execute(message: Message, args: string[]) {
        const texto = args.join(' ');

        if (texto.length > 20) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'O texto é muito longo! Use no máximo 20 caracteres.')]
            });
            return;
        }

        figlet(texto, (err, data) => {
            if (err) {
                return message.reply({
                    embeds: [Embeds.error(message.client, 'Ocorreu um erro ao gerar a arte ASCII.')]
                });
            }

            const embed = Embeds.info(
                message.client,
                'Arte ASCII 🎨',
                '```\n' + data + '\n```'
            );
            message.reply({ embeds: [embed] });
        });
    }
};
