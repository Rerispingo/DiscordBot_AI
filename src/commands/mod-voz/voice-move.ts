import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para mover um usuário para a mesma chamada de voz do autor do comando.
 */
export const voiceMoveCommand: Command = {
    name: 'voice-move',
    description: 'Move um usuário mencionado para a sua chamada de voz.',
    category: 'mod-voz',
    onlyManager: true,
    async execute(message: Message, args: string[]) {
        const member = message.member;
        if (!member || !member.voice.channel) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Você precisa estar em um canal de voz para mover alguém.')]
            });
            return;
        }

        const target = message.mentions.members?.first();
        if (!target) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Você precisa mencionar um usuário para mover.')]
            });
            return;
        }

        if (!target.voice.channel) {
            await message.reply({
                embeds: [Embeds.error(message.client, `O usuário **${target.user.tag}** não está em um canal de voz.`)]
            });
            return;
        }

        if (target.voice.channel.id === member.voice.channel.id) {
            await message.reply({
                embeds: [Embeds.error(message.client, `O usuário **${target.user.tag}** já está no mesmo canal que você.`)]
            });
            return;
        }

        try {
            await target.voice.setChannel(member.voice.channel);
            
            const embed = Embeds.info(
                message.client,
                'Usuário Movido ✈️',
                `O usuário **${target.user.tag}** foi movido para o canal **${member.voice.channel.name}**.`
            );
            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao mover usuário da voz:', error);
            await message.reply({
                embeds: [Embeds.error(message.client, 'Não foi possível mover o usuário. Verifique se eu tenho permissão de "Mover Membros" e acesso aos canais.')]
            });
        }
    }
};
