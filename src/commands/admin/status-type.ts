import { Message, ActivityType } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import { StatusManager } from '../../statusManager.js';

/**
 * Comando para alterar o tipo de atividade do bot.
 * Restrito ao Root Manager.
 */
export const statusTypeCommand: Command = {
    name: 'status-type',
    description: 'Altera o tipo de atividade do bot.',
    usage: '(tipo)',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message, args: string[]) {
        if (!args.length) {
            await message.reply({ 
                embeds: [Embeds.error(message.client, 'Você deve informar um tipo de status.\nTipos disponíveis: `playing`, `watching`, `listening`, `competing`')] 
            });
            return;
        }

        const typeInput = args[0].toLowerCase();
        let activityType: ActivityType;

        switch (typeInput) {
            case 'playing':
            case 'jogando':
                activityType = ActivityType.Playing;
                break;
            case 'watching':
            case 'assistindo':
                activityType = ActivityType.Watching;
                break;
            case 'listening':
            case 'ouvindo':
                activityType = ActivityType.Listening;
                break;
            case 'competing':
            case 'competindo':
                activityType = ActivityType.Competing;
                break;
            default:
                await message.reply({ 
                    embeds: [Embeds.error(message.client, 'Tipo inválido. Use: `playing`, `watching`, `listening` ou `competing`.')] 
                });
                return;
        }

        await StatusManager.setType(activityType);
        const status = await StatusManager.load();
        
        message.client.user?.setActivity(status.text, { type: activityType });

        await message.reply({ 
            embeds: [Embeds.success(message.client, `Tipo de status alterado para \`${typeInput}\`!`)] 
        });
    }
};
