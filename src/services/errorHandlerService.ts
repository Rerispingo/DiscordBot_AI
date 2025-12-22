import type { Client, Message } from 'discord.js';
import { Config } from '../config.js';

export class ErrorHandlerService {
    private registeredProcessHandlers = false;

    registerProcessHandlers(): void {
        if (this.registeredProcessHandlers) return;
        this.registeredProcessHandlers = true;

        process.on('unhandledRejection', (reason) => {
            console.error('[unhandledRejection]', this.formatError(reason));
        });

        process.on('uncaughtException', (error) => {
            console.error('[uncaughtException]', this.formatError(error));
        });
    }

    registerClientHandlers(client: Client): void {
        client.on('error', (error) => {
            console.error('[discord.js:error]', this.formatError(error));
        });

        client.on('shardError', (error) => {
            console.error('[discord.js:shardError]', this.formatError(error));
        });
    }

    async handleCommandError(message: Message, commandName: string, error: unknown): Promise<void> {
        console.error(`[command:${commandName}]`, this.formatError(error));

        try {
            if (message.channel && message.guild?.channels.cache.has(message.channelId)) {
                await message.reply(`${Config.emojis.error} Ocorreu um erro ao executar este comando.`);
            }
        } catch {
        }
    }

    handleEventError(eventName: string, error: unknown): void {
        console.error(`[event:${eventName}]`, this.formatError(error));
    }

    handleFatalError(error: unknown): void {
        console.error('[fatal]', this.formatError(error));
    }

    private formatError(error: unknown): string {
        if (error instanceof Error) {
            return error.stack || error.message;
        }

        try {
            return JSON.stringify(error);
        } catch {
            return String(error);
        }
    }
}
