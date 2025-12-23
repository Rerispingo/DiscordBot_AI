import { Message, Collection } from 'discord.js';
import type { Command } from '../types/command.js';
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
import { ValidationError, PermissionError, ChannelRestrictionError } from '../services/customErrors.js';

type CheckPermissionsFn = (message: Message, command: Command) => Promise<{ allowed: boolean; error?: string }>;
type LogCommandFn = (message: Message, command: Command, commandName: string) => Promise<void>;
type HandleCommandErrorFn = (message: Message, commandName: string, error: unknown) => Promise<void>;

/**
 * Dependências injetáveis para o CommandHandler.
 */
export interface CommandHandlerDependencies {
    checkPermissions?: CheckPermissionsFn;
    logCommand?: LogCommandFn;
    handleCommandError?: HandleCommandErrorFn;
    findWorkspaceLogsChannel?: typeof findWorkspaceLogsChannel;
}

/**
 * Gerenciador central de comandos.
 * Responsável pelo carregamento dinâmico, suporte a aliases, validação de argumentos e execução segura.
 */
export class CommandHandler {
    private prefix: string = Config.bot.prefix;
    private checkPermissions: CheckPermissionsFn;
    private logCommand: LogCommandFn;
    private handleCommandError: HandleCommandErrorFn;
    private findWorkspaceLogsChannel: typeof findWorkspaceLogsChannel;
    private aliases: Collection<string, string> = new Collection();

    constructor(deps: CommandHandlerDependencies = {}) {
        this.checkPermissions = deps.checkPermissions ?? PermissionService.checkPermissions;
        this.logCommand = deps.logCommand ?? LoggerService.logCommand;
        this.findWorkspaceLogsChannel = deps.findWorkspaceLogsChannel ?? findWorkspaceLogsChannel;
        this.handleCommandError = deps.handleCommandError ?? (async (message, commandName, error) => {
            // Fallback se não houver um serviço de erro injetado
            console.error(`[command:${commandName}]`, error);
        });

        this.loadCommands();
    }

    /**
     * Retorna a lista de comandos carregados.
     */
    public getCommands(): Collection<string, Command> {
        return commandStore;
    }

    /**
     * Varre recursivamente o diretório de comandos e os carrega na memória, mapeando aliases.
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
                        commandStore.set(command.name.toLowerCase(), command);
                        
                        // Registra aliases
                        if (command.aliases && Array.isArray(command.aliases)) {
                            for (const alias of command.aliases) {
                                this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
                            }
                        }

                        console.log(`✅ Comando carregado: ${command.name} (${category})`);
                    }
                } catch (error) {
                    console.error(`❌ Erro ao carregar comando ${file}:`, error);
                }
            }
        }
    }

    /**
     * Valida os argumentos de um comando com base em sua definição.
     */
    private validateArguments(command: Command, args: string[]): void {
        // Validação por contagem simples (min/max)
        if (command.minArgs !== undefined && args.length < command.minArgs) {
            throw new ValidationError(`Este comando requer pelo menos ${command.minArgs} argumento(s).`);
        }

        if (command.maxArgs !== undefined && args.length > command.maxArgs) {
            throw new ValidationError(`Este comando aceita no máximo ${command.maxArgs} argumento(s).`);
        }

        // Validação por definição de argumentos (CommandArgument)
        if (command.args) {
            for (let i = 0; i < command.args.length; i++) {
                const argDef = command.args[i];
                const argVal = args[i];

                if (argDef.required && !argVal) {
                    throw new ValidationError(`O argumento \`${argDef.name}\` é obrigatório.`);
                }

                if (argVal) {
                    this.validateArgumentType(argDef, argVal);
                }
            }
        }
    }

    /**
     * Valida o tipo de um argumento específico.
     */
    private validateArgumentType(argDef: any, value: string): void {
        switch (argDef.type) {
            case 'number':
                if (isNaN(Number(value))) {
                    throw new ValidationError(`O argumento \`${argDef.name}\` deve ser um número.`);
                }
                break;
            case 'user':
                if (!value.match(/^<@!?(\d+)>$/) && !value.match(/^\d+$/)) {
                    throw new ValidationError(`O argumento \`${argDef.name}\` deve ser uma menção de usuário ou ID.`);
                }
                break;
            case 'channel':
                if (!value.match(/^<#(\d+)>$/) && !value.match(/^\d+$/)) {
                    throw new ValidationError(`O argumento \`${argDef.name}\` deve ser uma menção de canal ou ID.`);
                }
                break;
        }
    }

    /**
     * Verifica se o canal é restrito (canal de logs) e lida com a restrição.
     */
    private async handleLogChannelRestriction(message: Message): Promise<boolean> {
        if (!message.guild) return false;

        const logsChannel = await this.findWorkspaceLogsChannel(message.guild);
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

    /**
     * Processa uma mensagem recebida para identificar e executar um comando.
     */
    async handle(message: Message) {
        if (message.author.bot || !message.content.startsWith(this.prefix)) return;

        if (await this.handleLogChannelRestriction(message)) {
            // Poderíamos lançar um ChannelRestrictionError aqui, mas o comportamento atual de deletar é mantido
            return;
        }

        const args = message.content.slice(this.prefix.length).trim().split(/ +/);
        const inputName = args.shift()?.toLowerCase();

        if (!inputName) {
            const ajudaCmd = commandStore.get('ajuda');
            if (ajudaCmd) {
                await ajudaCmd.execute(message, []);
            }
            return;
        }

        // Busca por nome ou alias
        const commandName = this.aliases.get(inputName) || inputName;
        const command = commandStore.get(commandName);
        
        if (!command) return;

        try {
            // Validação de Permissões
            const permissionResult = await this.checkPermissions(message, command);
            if (!permissionResult.allowed) {
                throw new PermissionError(permissionResult.error || 'Você não tem permissão para usar este comando.');
            }

            // Validação de Argumentos
            this.validateArguments(command, args);

            // Execução
            await command.execute(message, args);
            
            // Log de sucesso
            await this.logCommand(message, command, commandName).catch(() => {});

        } catch (error) {
            await this.handleCommandError(message, commandName, error);
        }
    }
}
