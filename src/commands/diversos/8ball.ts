import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Comando da Bola 8 Mágica.
 * O bot responde a uma pergunta com uma frase aleatória sarcástica.
 */
export const eightBallCommand: Command = {
    name: '8ball',
    description: 'Faça uma pergunta para a Bola 8 Mágica.',
    usage: '(pergunta)',
    category: 'diversos',
    async execute(message: Message, args: string[]) {
        if (args.length === 0) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Você precisa fazer uma pergunta!')]
            });
            return;
        }

        const dataPath = path.join(__dirname, '../../../data/8ball.json');
        const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
        const respostas = data.respostas;
        
        const respostaAleatoria = respostas[Math.floor(Math.random() * respostas.length)];
        
        const embed = Embeds.info(
            message.client,
            'Bola 8 Mágica 🎱',
            `**Pergunta:** ${args.join(' ')}\n**Resposta:** ${respostaAleatoria}`
        );

        await message.reply({ embeds: [embed] });
    }
};
