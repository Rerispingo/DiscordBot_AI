import { Message } from 'discord.js';
import { Config } from '../config.js';
import { ManagerSystem } from '../managers.js';
import { Command } from '../types/command.js';

/**
 * Serviço responsável por validar permissões de acesso aos comandos.
 */
export class PermissionService {
    /**
     * Verifica se o usuário tem permissão para executar o comando.
     * @param message A mensagem recebida.
     * @param command O comando a ser executado.
     * @returns Um objeto contendo se tem permissão e a mensagem de erro se não tiver.
     */
    static async checkPermissions(message: Message, command: Command): Promise<{ allowed: boolean; error?: string }> {
        const isRoot = message.author.id === Config.bot.rootManagerId;

        // Validação Root
        if (command.onlyRoot && !isRoot) {
            return { allowed: false, error: 'Este comando é restrito ao Root Manager.' };
        }

        // Validação Manager
        if (command.onlyManager) {
            const isManager = message.guildId && await ManagerSystem.isManager(message.guildId, message.author.id);
            if (!isRoot && !isManager) {
                return { allowed: false, error: 'Este comando é restrito aos Managers ou ao Root Manager.' };
            }
        }

        return { allowed: true };
    }

    /**
     * Verifica se o usuário é o Root Manager.
     */
    static isRoot(userId: string): boolean {
        return userId === Config.bot.rootManagerId;
    }

    /**
     * Verifica se o usuário é um Manager no servidor.
     */
    static async isManager(guildId: string, userId: string): Promise<boolean> {
        return await ManagerSystem.isManager(guildId, userId);
    }
}
