import { Message, TextChannel, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para desbloquear o envio de mensagens no canal de texto atual.
 */
export const chatUnlockCommand: Command = {
    name: 'chat-unlock',
    description: 'Desbloqueia o canal de texto atual para membros.',
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
            // Libera o envio de mensagens para o cargo @everyone (null remove o overwrite específico)
            await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
                SendMessages: null
            });

            const embed = Embeds.info(
                message.client,
                'Chat Desbloqueado 🔓',
                `O canal **${channel.name}** foi liberado para envio de mensagens.`,
                '🔓'
            );
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao desbloquear chat:', error);
            await message.reply({
                embeds: [Embeds.error(message.client, 'Não foi possível desbloquear o canal. Verifique minhas permissões.')]
            });
        }
    }
};
