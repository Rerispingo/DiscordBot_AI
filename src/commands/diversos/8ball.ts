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
    aliases: ['bola8', 'pergunta'],
    description: 'Faça uma pergunta para a Bola 8 Mágica e receba uma resposta sarcástica.',
    usage: '<pergunta>',
    category: 'diversos',
    minArgs: 1,
    args: [
        {
            name: 'pergunta',
            description: 'A pergunta que você deseja fazer à Bola 8',
            required: true,
            type: 'string'
        }
    ],
    examples: ['O bot é inteligente?', 'Vou ganhar na loteria?'],
    async execute(message: Message, args: string[]) {
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
