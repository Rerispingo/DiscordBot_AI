import { Message, VoiceChannel } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para liberar o canal de voz para infinitas pessoas.
 */
export const voiceUnlockCommand: Command = {
    name: 'voice-unlock',
    description: 'Libera o canal de voz atual para entrada ilimitada.',
    category: 'mod-voz',
    onlyManager: true,
    async execute(message: Message) {
        const member = message.member;
        if (!member || !member.voice.channel) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Você precisa estar em um canal de voz para usar este comando.')]
            });
            return;
        }

        const channel = member.voice.channel;

        if (!(channel instanceof VoiceChannel)) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Este comando só funciona em canais de voz convencionais.')]
            });
            return;
        }

        try {
            await channel.setUserLimit(0);
            const embed = Embeds.info(
                message.client,
                'Voz Liberada 🔓',
                `O canal **${channel.name}** agora está aberto para todos (limite removido).`
            );
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao destravar canal de voz:', error);
            await message.reply({
                embeds: [Embeds.error(message.client, 'Não foi possível alterar o limite do canal. Verifique minhas permissões.')]
            });
        }
    }
};
