import { Message, TextChannel } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para recriar o canal de texto atual, limpando todo o histórico.
 */
export const nukeCommand: Command = {
    name: 'nuke',
    description: 'Recria o canal de texto atual, apagando todo o histórico.',
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
            const position = channel.position;
            const parent = channel.parent;
            const name = channel.name;
            const topic = channel.topic;
            const nsfw = channel.nsfw;
            const rateLimitPerUser = channel.rateLimitPerUser;
            const permissionOverwrites = channel.permissionOverwrites.cache;

            // Clona o canal
            const newChannel = await channel.clone({
                name,
                parent,
                position,
                topic: topic || undefined,
                nsfw,
                rateLimitPerUser,
                reason: `Nuke solicitado por ${message.author.tag}`
            });

            // Aplica as permissões manualmente se necessário (o clone já deve levar a maioria)
            // Mas garantimos a posição correta
            await newChannel.setPosition(position);

            // Deleta o canal antigo
            await channel.delete(`Nuke solicitado por ${message.author.tag}`);

            // Envia a mensagem de sucesso no novo canal
            const embed = Embeds.info(
                message.client,
                'Canal Nukado! 💥',
                'Novos ares, novas historias.',
                '💥'
            );
            await newChannel.send({ embeds: [embed] });

        } catch (error) {
            console.error('Erro ao executar nuke:', error);
            await message.reply({
                embeds: [Embeds.error(message.client, 'Não foi possível executar o nuke no canal. Verifique minhas permissões.')]
            });
        }
    }
};
