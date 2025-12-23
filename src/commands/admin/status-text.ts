import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import { StatusManager } from '../../statusManager.js';

/**
 * Comando para alterar o texto da atividade do bot.
 * Restrito ao Root Manager.
 */
export const statusTextCommand: Command = {
    name: 'status-text',
    description: 'Altera o texto da atividade do bot.',
    usage: '(texto)',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message, args: string[]) {
        if (!args.length) {
            await message.reply({ 
                embeds: [Embeds.error(message.client, 'Você deve informar o novo texto do status.')] 
            });
            return;
        }

        const newText = args.join(' ');
        
        await StatusManager.setText(newText);
        const status = await StatusManager.load();
        
        message.client.user?.setActivity(newText, { type: status.type });

        await message.reply({ 
            embeds: [Embeds.success(message.client, `Texto do status alterado para: \`${newText}\`!`)] 
        });
    }
};
