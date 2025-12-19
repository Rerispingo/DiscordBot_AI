import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import * as fs from 'fs';
import * as path from 'path';

export const emojiRandomCommand: Command = {
    name: 'emojirandom',
    description: 'Sorteia uma sequência de emojis aleatórios.',
    category: 'geral',
    async execute(message: Message, args: string[]) {
        let emojis: string[] = [];
        try {
            const filePath = path.join(process.cwd(), 'data', 'emojis.json');
            const content = fs.readFileSync(filePath, 'utf-8');
            emojis = JSON.parse(content);
        } catch (error) {
            console.error('Erro ao carregar emojis:', error);
            emojis = ['😀', '🔥', '✨']; // Fallback
        }

        let count = parseInt(args[0] || '5');

        if (isNaN(count) || count <= 0) {
            await message.reply('❌ Por favor, informe uma quantidade válida (número maior que 0).');
            return;
        }

        if (count > 50) {
            count = 50; // Limite para evitar spam gigante
        }

        let result = '';
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * emojis.length);
            result += emojis[randomIndex];
        }

        await message.reply(`🎲 Aqui estão seus ${count} emojis:\n${result}`);
    }
};
