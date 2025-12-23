import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para desligar o bot.
 * Restrito ao Root Manager.
 */
export const offCommand: Command = {
    name: 'off',
    aliases: ['shutdown', 'exit', 'kill'],
    description: 'Desliga o bot imediatamente.',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message) {
        await message.reply({ embeds: [Embeds.info(message.client, 'Desligando', 'O bot está sendo encerrado... 👋')] });
        console.log(`Bot desligado por ${message.author.tag}`);
        
        // Pequeno delay para garantir que a mensagem seja enviada
        setTimeout(() => {
            message.client.destroy();
            process.exit(0);
        }, 1000);
    }
};
