import { Message } from 'discord.js';
import { findWorkspaceModerationLogChannel } from '../workspace.js';

/**
 * Serviço responsável por lidar com restrições de uso de comandos em canais específicos.
 */
export class ChannelRestrictionService {
    /**
     * Verifica se o canal é restrito (ex: canal de logs) e lida com a restrição deletando a mensagem e avisando o usuário.
     * @param message A mensagem recebida.
     * @param findLogsChannel Função para localizar o canal de logs de moderação do workspace.
     * @returns True se o canal for restrito e a ação foi tomada, False caso contrário.
     */
    static async handleLogChannelRestriction(
        message: Message, 
        findLogsChannel: typeof findWorkspaceModerationLogChannel
    ): Promise<boolean> {
        if (!message.guild) return false;

        const logsChannel = await findLogsChannel(message.guild);
        if (logsChannel && message.channel.id === logsChannel.id) {
            if (message.deletable) {
                await message.delete().catch(() => {});
            }

            const warning = await logsChannel.send({
                content: `⚠️ <@${message.author.id}>, não é permitido o uso de comandos neste canal de logs.`
            });
            
            setTimeout(async () => {
                try {
                    await warning.delete();
                } catch (e) {}
            }, 2000);
            return true;
        }
        return false;
    }
}
