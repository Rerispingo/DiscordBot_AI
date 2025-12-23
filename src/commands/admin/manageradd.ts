import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { ManagerSystem } from '../../managers.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para promover um usuário a Manager.
 * Restrito ao Root Manager.
 */
export const managerAddCommand: Command = {
    name: 'manageradd',
    aliases: ['addmanager', 'madd'],
    description: 'Adiciona um manager ao servidor.',
    usage: '<@user>',
    category: 'admin',
    onlyRoot: true,
    args: [
        {
            name: 'usuário',
            description: 'Menção do usuário a ser adicionado como manager',
            required: true,
            type: 'user'
        }
    ],
    async execute(message: Message) {
        const client = message.client;
        const targetUser = message.mentions.users.first();

        if (!targetUser) {
            // Este erro agora é tecnicamente tratado pelo CommandHandler se usarmos args corretamente,
            // mas mantemos uma verificação extra por segurança ou se o ID for passado diretamente.
            await message.reply({ embeds: [Embeds.error(client, 'Você precisa mencionar um usuário para adicionar como manager.')] });
            return;
        }

        if (!message.guildId) {
            await message.reply({ embeds: [Embeds.error(client, 'Este comando só pode ser utilizado dentro de um servidor.')] });
            return;
        }

        if (await ManagerSystem.addManager(message.guildId, targetUser.id)) {
            await message.reply({ embeds: [Embeds.success(client, `O usuário **${targetUser.username}** foi adicionado à lista de managers deste servidor.`)] });
        } else {
            await message.reply({ embeds: [Embeds.info(client, 'Informação', `O usuário **${targetUser.username}** já é um manager neste servidor.`)] });
        }
    }
};
