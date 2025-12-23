import type { Client, Message } from 'discord.js';
import { Config } from '../config.js';
import { BotError } from './customErrors.js';

/**
 * Serviço centralizado para tratamento e log de erros.
 */
export class ErrorHandlerService {
    private registeredProcessHandlers = false;

    /**
     * Registra handlers para erros globais do processo (rejeições não tratadas e exceções).
     */
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

    /**
     * Registra handlers para erros específicos do cliente Discord.js.
     */
    registerClientHandlers(client: Client): void {
        client.on('error', (error) => {
            console.error('[discord.js:error]', this.formatError(error));
        });

        client.on('shardError', (error) => {
            console.error('[discord.js:shardError]', this.formatError(error));
        });
    }

    /**
     * Trata erros ocorridos durante a execução de comandos.
     */
    async handleCommandError(message: Message, commandName: string, error: unknown): Promise<void> {
        // Loga o erro internamente
        if (!(error instanceof BotError) || !error.isPublic) {
            console.error(`[command:${commandName}]`, this.formatError(error));
        }

        try {
            if (message.channel && message.guild?.channels.cache.has(message.channelId)) {
                let responseMessage = `${Config.emojis.error} Ocorreu um erro ao executar este comando.`;

                if (error instanceof BotError && error.isPublic) {
                    responseMessage = `${Config.emojis.error} ${error.message}`;
                }

                await message.reply(responseMessage);
            }
        } catch {
            // Silenciosamente ignora se não conseguir responder no Discord
        }
    }

    /**
     * Trata erros ocorridos em eventos.
     */
    handleEventError(eventName: string, error: unknown): void {
        console.error(`[event:${eventName}]`, this.formatError(error));
    }

    /**
     * Trata erros fatais que podem exigir o encerramento do bot.
     */
    handleFatalError(error: unknown): void {
        console.error('[fatal]', this.formatError(error));
    }

    /**
     * Formata um erro para string de log.
     */
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
