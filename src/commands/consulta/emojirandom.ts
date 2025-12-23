import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Comando para sortear emojis aleatórios de uma lista predefinida.
 */
export const emojiRandomCommand: Command = {
    name: 'emojirandom',
    description: 'Sorteia uma sequência de emojis aleatórios.',
    usage: '(quantidade)',
    category: 'consulta',
    async execute(message: Message, args: string[]) {
        const client = message.client;
        let emojis: string[] = [];
        
        try {
            const filePath = path.join(process.cwd(), 'data', 'emojis.json');
            const content = await fs.readFile(filePath, 'utf-8');
            emojis = JSON.parse(content);
        } catch (error) {
            console.error('Erro ao carregar emojis:', error);
            emojis = ['😀', '🔥', '✨', '🍀', '🤖']; // Fallback básico
        }

        let count = parseInt(args[0] || '5');

        if (isNaN(count) || count <= 0) {
            await message.reply({ embeds: [Embeds.error(client, 'Por favor, informe uma quantidade válida (número inteiro maior que 0).')] });
            return;
        }

        if (count > 50) {
            count = 50; // Limite de segurança
        }

        let result = '';
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * emojis.length);
            result += emojis[randomIndex];
        }

        const embed = Embeds.info(
            client,
            'Sorteio de Emojis 🎲',
            `Aqui estão seus **${count}** emojis sorteados:\n\n${result}`
        );

        await message.reply({ embeds: [embed] });
    }
};
