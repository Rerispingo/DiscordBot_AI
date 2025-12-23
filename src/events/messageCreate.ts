import { Events, Message, TextChannel } from 'discord.js';
import type { BotEvent } from '../types/event.js';
import type { BotContext } from '../container.js';
import { PursuerSystem } from '../pursuerSystem.js';
import * as fs from 'fs';
import * as path from 'path';
import { findWorkspaceMessageLogChannel } from '../workspace.js';

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
        // Ignora mensagens de bots para evitar loops
        if (message.author.bot) return;

        // Lógica para o canal message-log
        if (message.guild) {
            const messageLogChannel = await findWorkspaceMessageLogChannel(message.guild);
            if (messageLogChannel && message.channel.id === messageLogChannel.id) {
                await message.delete().catch(() => {});
                if (message.channel instanceof TextChannel) {
                    const replyMessage = await message.channel.send(`Olá ${message.author}, por favor, não envie mensagens neste canal!`);
                    setTimeout(() => replyMessage.delete().catch(() => {}), 2000);
                }
                return;
            }
        }

        // Lógica de Perseguição (Pursuer)
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

        await context.commandHandler.handle(message);
    },
};
