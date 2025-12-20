import { Message, TextChannel, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para bloquear o envio de mensagens no canal de texto atual.
 */
export const chatLockCommand: Command = {
    name: 'chat-lock',
    description: 'Bloqueia o canal de texto atual para membros.',
    category: 'mod-chat',
    onlyManager: true,
    async execute(message: Message) {
        const channel = message.channel;

        if (!(channel instanceof TextChannel)) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Este comando só funciona em canais de texto convencionais.')]
            });
            return;
        }

        try {
            // Bloqueia o envio de mensagens para o cargo @everyone
            await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
                SendMessages: false
            });

            const embed = Embeds.info(
                message.client,
                'Chat Bloqueado 🔒',
                `O canal **${channel.name}** foi bloqueado para envio de mensagens.`,
                '🔒'
            );
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao bloquear chat:', error);
            await message.reply({
                embeds: [Embeds.error(message.client, 'Não foi possível bloquear o canal. Verifique minhas permissões.')]
            });
        }
    }
};
