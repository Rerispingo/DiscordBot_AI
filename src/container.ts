import type { Client } from 'discord.js';
import { CommandHandler } from './handlers/commandHandler.js';
import { PermissionService } from './services/permissionService.js';
import { LoggerService } from './services/loggerService.js';
import { ErrorHandlerService } from './services/errorHandlerService.js';

export interface BotContext {
    client: Client;
    commandHandler: CommandHandler;
    errorHandler: ErrorHandlerService;
}

export function createContainer(client: Client): BotContext {
    const errorHandler = new ErrorHandlerService();
    const commandHandler = new CommandHandler({
        checkPermissions: PermissionService.checkPermissions,
        logCommand: LoggerService.logCommand,
        handleCommandError: (message, commandName, error) => errorHandler.handleCommandError(message, commandName, error),
    });

    return {
        client,
        commandHandler,
        errorHandler,
    };
}
