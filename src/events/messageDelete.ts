import { Events, Message, EmbedBuilder } from 'discord.js';
import type { BotEvent } from '../types/event.js';
import type { BotContext } from '../container.js';
import { findWorkspaceMessageLogChannel } from '../workspace.js';

/**
 * Evento disparado quando uma mensagem é deletada.
 * Registra a mensagem excluída no canal de log de mensagens do workspace.
 */
export const messageDeleteEvent: BotEvent<BotContext> = {
    name: Events.MessageDelete,
    async execute(context, message: Message) {
        if (message.author?.bot || !message.guild) return;

        const logChannel = await findWorkspaceMessageLogChannel(message.guild);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('🗑️ Mensagem Excluída')
            .setColor(0xE74C3C) // Vermelho
            .setTimestamp()
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL()
            })
            .addFields(
                { name: 'Canal', value: `<#${message.channel.id}>`, inline: true },
                { name: 'Autor', value: `<@${message.author.id}>`, inline: true },
                { name: 'Conteúdo', value: message.content || '*Sem conteúdo ou anexo apenas*' }
            )
            .setFooter({ text: `ID do Usuário: ${message.author.id}` });

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    },
};
