import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { ManagerSystem } from '../../managers.js';

export const managerAddCommand: Command = {
    name: 'manageradd',
    description: 'Adiciona um manager ao servidor.',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message, args: string[]) {
        const targetUser = message.mentions.users.first();
        if (!targetUser) {
            await message.reply('❌ Você precisa mencionar um usuário para adicionar como manager. Ex: `./manageradd @usuario`');
            return;
        }

        if (!message.guildId) return;

        if (ManagerSystem.addManager(message.guildId, targetUser.id)) {
            await message.reply(`✅ ${targetUser.username} foi adicionado à lista de managers deste servidor.`);
        } else {
            await message.reply(`ℹ️ ${targetUser.username} já é um manager neste servidor.`);
        }
    }
};
