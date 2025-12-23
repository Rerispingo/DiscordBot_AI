import { Events, Message, EmbedBuilder } from 'discord.js';
import type { BotEvent } from '../types/event.js';
import type { BotContext } from '../container.js';
import { findWorkspaceMessageLogChannel } from '../workspace.js';
import { Embeds } from '../utils/embeds.js';

/**
 * Evento disparado quando uma mensagem é editada.
 * Registra as alterações no canal de log de mensagens do workspace.
 */
export const messageUpdateEvent: BotEvent<BotContext> = {
    name: Events.MessageUpdate,
    async execute(context, oldMessage: Message, newMessage: Message) {
        if (newMessage.author?.bot || !newMessage.guild) return;

        // Se o conteúdo for o mesmo (ex: apenas embed adicionado ou mensagem fixada), ignora
        if (oldMessage.content === newMessage.content) return;

        const logChannel = await findWorkspaceMessageLogChannel(newMessage.guild);
        if (!logChannel) return;

        const embed = new EmbedBuilder()
            .setTitle('📝 Mensagem Editada')
            .setColor(0xF1C40F) // Amarelo/Gold
            .setTimestamp()
            .setAuthor({
                name: newMessage.author.tag,
                iconURL: newMessage.author.displayAvatarURL()
            })
            .addFields(
                { name: 'Canal', value: `<#${newMessage.channel.id}>`, inline: true },
                { name: 'Autor', value: `<@${newMessage.author.id}>`, inline: true },
                { name: 'Antes', value: oldMessage.content || '*Sem conteúdo*' },
                { name: 'Depois', value: newMessage.content || '*Sem conteúdo*' }
            )
            .setFooter({ text: `ID do Usuário: ${newMessage.author.id}` });

        await logChannel.send({ embeds: [embed] }).catch(() => {});
    },
};
