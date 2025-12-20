import { Message, Collection } from 'discord.js';
import type { Command } from '../types/command.js';
import { ManagerSystem } from '../managers.js';
import { Config } from '../config.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Embeds } from '../utils/embeds.js';
import { findWorkspaceLogsChannel } from '../workspace.js';
import { PermissionService } from '../services/permissionService.js';
import { LoggerService } from '../services/loggerService.js';
import { commandStore } from '../commands/commandStore.js';

/**
 * Gerenciador central de comandos.
 * Responsável pelo carregamento dinâmico e pela execução com validação de permissões.
 */
export class CommandHandler {
    private prefix: string = Config.bot.prefix;

    constructor() {
        this.loadCommands();
    }

    /**
     * Retorna a lista de comandos carregados.
     */
    public getCommands(): Collection<string, Command> {
        return commandStore;
    }

    /**
     * Varre recursivamente o diretório de comandos e os carrega na memória.
     */
    private async loadCommands() {
        const commandsPath = Config.paths.commands;
        if (!fs.existsSync(commandsPath)) return;

        const categories = fs.readdirSync(commandsPath);

        for (const category of categories) {
            const categoryPath = path.join(commandsPath, category);
            if (!fs.lstatSync(categoryPath).isDirectory()) continue;

            const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

            for (const file of commandFiles) {
                try {
                    const filePath = path.join(categoryPath, file);
                    const fileUrl = pathToFileURL(filePath).href;
                    const commandModule = await import(fileUrl);
                    
                    const commandKey = Object.keys(commandModule).find(key => {
                        const cmd = commandModule[key];
                        return cmd && typeof cmd === 'object' && 'name' in cmd && 'execute' in cmd;
                    });

                    if (commandKey) {
                        const command: Command = commandModule[commandKey];
                        commandStore.set(command.name, command);
                        console.log(`✅ Comando carregado: ${command.name} (${category})`);
                    }
                } catch (error) {
                    console.error(`❌ Erro ao carregar comando ${file}:`, error);
                }
            }
        }
    }

    /**
     * Verifica se o canal é restrito (canal de logs) e lida com a restrição.
     * @returns True se o comando deve ser interrompido.
     */
    private async handleLogChannelRestriction(message: Message): Promise<boolean> {
        if (!message.guild) return false;

        const logsChannel = await findWorkspaceLogsChannel(message.guild);
        if (logsChannel && message.channel.id === logsChannel.id) {
            // Apaga a mensagem do usuário imediatamente
            if (message.deletable) {
                await message.delete().catch(() => {});
            }

            const warning = await logsChannel.send({
                content: `⚠️ <@${message.author.id}>, não é permitido o uso de comandos neste canal de logs.`
            });
            
            // Remove o aviso do bot após 2 segundos
            setTimeout(async () => {
                try {
                    await warning.delete();
                } catch (e) {
                    // Ignora se a mensagem já tiver sido deletada
                }
            }, 2000);
            return true;
        }
        return false;
    }

    /**
     * Processa uma mensagem recebida para identificar e executar um comando.
     * @param message A mensagem recebida do Discord.
     */
    async handle(message: Message) {
        if (message.author.bot || !message.content.startsWith(this.prefix)) return;

        // Restrição para o canal de logs
        if (await this.handleLogChannelRestriction(message)) return;

        const args = message.content.slice(this.prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) {
            const ajudaCmd = commandStore.get('ajuda');
            if (ajudaCmd) {
                await ajudaCmd.execute(message, []);
            }
            return;
        }

        const command = commandStore.get(commandName);
        if (!command) return;

        // Validação de Permissões via PermissionService
        const permissionResult = await PermissionService.checkPermissions(message, command);
        if (!permissionResult.allowed) {
            await message.reply({
                embeds: [Embeds.error(message.client, permissionResult.error || 'Acesso negado.')]
            });
            return;
        }

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(`Erro ao executar comando ${commandName}:`, error);
            try {
                // Tenta responder apenas se o canal ainda estiver acessível
                if (message.channel && message.guild?.channels.cache.has(message.channelId)) {
                    await message.reply(`${Config.emojis.error} Ocorreu um erro ao executar este comando.`);
                }
            } catch (replyError) {
                // Silenciosamente falha se o canal foi deletado durante a execução
            }
            return;
        }

        // Registro de Log via LoggerService
        await LoggerService.logCommand(message, command, commandName);
    }
}
