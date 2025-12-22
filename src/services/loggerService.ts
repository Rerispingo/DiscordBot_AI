import { Message, TextChannel } from 'discord.js';
import { Config } from '../config.js';
import { Embeds } from '../utils/embeds.js';
import { findWorkspaceLogsChannel } from '../workspace.js';
import { Command } from '../types/command.js';

/**
 * Serviço responsável por registrar a execução de comandos no canal de logs.
 */
export class LoggerService {
    /**
     * Registra a execução de um comando, se aplicável.
     * @param message A mensagem original.
     * @param command O comando executado.
     * @param commandName O nome do comando.
     */
    static async logCommand(message: Message, command: Command, commandName: string): Promise<void> {
        if (!message.guild) return;

        // Filtro de logs: registrar apenas comandos de moderação e ignorar comandos exclusivos de root
        const moderationCategories = ['mod-chat', 'mod-voz'];
        const isModeration = moderationCategories.includes(command.category);
        const isRootOnly = command.onlyRoot === true;

        if (!isModeration || isRootOnly) {
            return;
        }

        const logsChannel = await findWorkspaceLogsChannel(message.guild);
        if (!logsChannel) return;

        const channelMention = message.channel?.type === 0 ? `<#${message.channel.id}>` : (message.channel ? `ID: ${message.channel.id}` : 'Canal Deletado/Desconhecido');
        
        const embed = Embeds.log(message.client, 'Execução de Comando', [
            { name: 'Comando', value: `\`${Config.bot.prefix}${commandName}\``, inline: true },
            { name: 'Executor', value: `<@${message.author.id}>`, inline: true },
            { name: 'Canal', value: channelMention, inline: true }
        ]);

        await logsChannel.send({ embeds: [embed] }).catch(() => {});
    }
}
