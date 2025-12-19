import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { ManagerSystem } from '../../managers.js';

export const managerRemoveCommand: Command = {
    name: 'managerremove',
    description: 'Remove um manager do servidor.',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message, args: string[]) {
        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            await message.reply('❌ Você precisa mencionar um usuário para remover. Ex: `./managerremove @usuario`');
            return;
        }

        if (!message.guildId) return;

        if (ManagerSystem.removeManager(message.guildId, targetUser.id)) {
            await message.reply(`✅ ${targetUser.username} foi removido da lista de managers deste servidor.`);
        } else {
            await message.reply(`❌ ${targetUser.username} não consta na lista de managers deste servidor.`);
        }
    }
};
