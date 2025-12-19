import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando de escolha aleatória.
 * O usuário passa várias opções separadas por vírgula e o bot escolhe uma.
 */
export const escolhaCommand: Command = {
    name: 'escolha',
    description: 'Escolhe aleatoriamente entre as opções fornecidas (separe por vírgula).',
    category: 'diversos',
    async execute(message: Message, args: string[]) {
        if (args.length === 0) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Você precisa fornecer opções separadas por vírgula!')]
            });
            return;
        }

        const opcoes = args.join(' ').split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);

        if (opcoes.length < 2) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Por favor, forneça pelo menos duas opções separadas por vírgula.')]
            });
            return;
        }

        const escolhida = opcoes[Math.floor(Math.random() * opcoes.length)];

        const embed = Embeds.info(
            message.client,
            'Decisão Difícil',
            `🤔 Entre as opções: *${opcoes.join(', ')}*\n\nEu escolho: **${escolhida}**!`
        );

        await message.reply({ embeds: [embed] });
    }
};
