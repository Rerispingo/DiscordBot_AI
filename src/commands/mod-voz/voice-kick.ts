import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para kickar um usuário de uma chamada de voz.
 */
export const voiceKickCommand: Command = {
    name: 'voice-kick',
    description: 'Remove um usuário mencionado da chamada de voz.',
    category: 'mod-voz',
    onlyManager: true,
    async execute(message: Message, args: string[]) {
        const target = message.mentions.members?.first();

        if (!target) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Você precisa mencionar um usuário para kickar da chamada.')]
            });
            return;
        }

        if (!target.voice.channel) {
            await message.reply({
                embeds: [Embeds.error(message.client, `O usuário **${target.user.tag}** não está em um canal de voz.`)]
            });
            return;
        }

        try {
            const channelName = target.voice.channel.name;
            await target.voice.disconnect('Kickado via comando de moderação de voz.');
            
            const embed = Embeds.info(
                message.client,
                'Usuário Kickado 👢',
                `O usuário **${target.user.tag}** foi removido do canal **${channelName}**.`
            );
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao kickar usuário da voz:', error);
            await message.reply({
                embeds: [Embeds.error(message.client, 'Não foi possível desconectar o usuário. Verifique minhas permissões.')]
            });
        }
    }
};
