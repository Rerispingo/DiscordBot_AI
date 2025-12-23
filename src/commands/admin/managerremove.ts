import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { ManagerSystem } from '../../managers.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para remover um usuário da lista de Managers.
 * Restrito ao Root Manager.
 */
export const managerRemoveCommand: Command = {
    name: 'managerremove',
    description: 'Remove um manager do servidor.',
    usage: '@user',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message, args: string[]) {
        const client = message.client;
        const targetUser = message.mentions.users.first();

        if (!targetUser) {
            await message.reply({ embeds: [Embeds.error(client, 'Você precisa mencionar um usuário para remover. Ex: `./managerremove @usuario`')] });
            return;
        }

        if (!message.guildId) {
            await message.reply({ embeds: [Embeds.error(client, 'Este comando só pode ser utilizado dentro de um servidor.')] });
            return;
        }

        if (await ManagerSystem.removeManager(message.guildId, targetUser.id)) {
            await message.reply({ embeds: [Embeds.success(client, `O usuário **${targetUser.username}** foi removido da lista de managers deste servidor.`)] });
        } else {
            await message.reply({ embeds: [Embeds.error(client, `O usuário **${targetUser.username}** não consta na lista de managers deste servidor.`)] });
        }
    }
};
