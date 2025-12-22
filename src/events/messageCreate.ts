import { Events, Message } from 'discord.js';
import type { BotEvent } from '../types/event.js';
import type { BotContext } from '../container.js';
import { PursuerSystem } from '../pursuerSystem.js';
import * as fs from 'fs';
import * as path from 'path';

// Carrega emojis para reações aleatórias
const emojisPath = path.join(process.cwd(), 'data', 'emojis.json');
const emojis: string[] = fs.existsSync(emojisPath) 
    ? JSON.parse(fs.readFileSync(emojisPath, 'utf-8')) 
    : ['😈', '👻', '👾', '🤖'];

/**
 * Evento disparado quando uma nova mensagem é enviada.
 * Gerencia a execução de comandos e a lógica de perseguição (pursuer).
 */
export const messageCreateEvent: BotEvent<BotContext> = {
    name: Events.MessageCreate,
    async execute(context, message: Message) {
        // Lógica de Perseguição (Pursuer)
        if (!message.author.bot) {
            const isPursued = await PursuerSystem.isPursued(message.author.id);
            if (isPursued) {
                // Adiciona uma reação aleatória
                const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                await message.react(randomEmoji).catch(() => {});

                // Chance de 20% de apagar a mensagem
                if (Math.random() < 0.20) {
                    await message.delete().catch(() => {});
                    return; // Interrompe se a mensagem foi deletada
                }
            }
        }

        await context.commandHandler.handle(message);
    },
};
