import { Message, Collection } from 'discord.js';
import type { Command } from '../types/command.js';
import { Config } from '../config.js';

import { findWorkspaceModerationLogChannel } from '../workspace.js';
import { PermissionService } from '../services/permissionService.js';
import { LoggerService } from '../services/loggerService.js';
import { commandStore } from '../commands/commandStore.js';
import { PermissionError } from '../services/customErrors.js';
import { CommandLoaderService } from '../services/commandLoaderService.js';
import { ArgumentValidatorService } from '../services/argumentValidatorService.js';
import { ChannelRestrictionService } from '../services/channelRestrictionService.js';

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
    findWorkspaceModerationLogChannel?: typeof findWorkspaceModerationLogChannel;
}

/**
 * Gerenciador central de comandos.
 * Responsável pelo fluxo de execução, suporte a aliases e orquestração de serviços.
 */
export class CommandHandler {
    private prefix: string = Config.bot.prefix;
    private checkPermissions: CheckPermissionsFn;
    private logCommand: LogCommandFn;
    private handleCommandError: HandleCommandErrorFn;
    private findWorkspaceModerationLogChannel: typeof findWorkspaceModerationLogChannel;
    private aliases: Collection<string, string> = new Collection();

    constructor(deps: CommandHandlerDependencies = {}) {
        this.checkPermissions = deps.checkPermissions ?? PermissionService.checkPermissions;
        this.logCommand = deps.logCommand ?? LoggerService.logCommand;
        this.findWorkspaceModerationLogChannel = deps.findWorkspaceModerationLogChannel ?? findWorkspaceModerationLogChannel;
        this.handleCommandError = deps.handleCommandError ?? (async (message, commandName, error) => {
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
     * Delega o carregamento de comandos para o CommandLoaderService.
     */
    private async loadCommands() {
        await CommandLoaderService.loadCommands(this.aliases);
    }

    /**
     * Processa uma mensagem recebida para identificar e executar um comando.
     * @param message A mensagem recebida do Discord.
     */
    async handle(message: Message) {
        if (message.author.bot || !message.content.startsWith(this.prefix)) return;

        // Verifica restrição de canal de logs
        if (await ChannelRestrictionService.handleLogChannelRestriction(message, this.findWorkspaceModerationLogChannel)) {
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

            // Validação de Argumentos (Delegado ao ArgumentValidatorService)
            ArgumentValidatorService.validate(command, args);

            // Execução
            await command.execute(message, args);
            
            // Log de sucesso
            await this.logCommand(message, command, commandName).catch(() => {});

        } catch (error) {
            await this.handleCommandError(message, commandName, error);
        }
    }
}

