import { Message, VoiceChannel } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para restringir o canal de voz para apenas 1 pessoa.
 */
export const voiceLockCommand: Command = {
    name: 'voice-lock',
    description: 'Restringe o canal de voz atual para apenas 1 pessoa.',
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
            await channel.setUserLimit(1);
            const embed = Embeds.info(
                message.client,
                'Voz Bloqueada 🔒',
                `O canal **${channel.name}** foi restringido para apenas 1 pessoa.`
            );
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao trancar canal de voz:', error);
            await message.reply({
                embeds: [Embeds.error(message.client, 'Não foi possível alterar o limite do canal. Verifique minhas permissões.')]
            });
        }
    }
};
