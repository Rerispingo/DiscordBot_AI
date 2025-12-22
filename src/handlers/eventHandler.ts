import type { Client } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { Config } from '../config.js';
import type { BotEvent } from '../types/event.js';

function isBotEvent<Context>(value: unknown): value is BotEvent<Context> {
    if (!value || typeof value !== 'object') return false;
    const event = value as Record<string, unknown>;
    return typeof event.name === 'string' && typeof event.execute === 'function';
}

export class EventHandler<Context extends { errorHandler?: { handleEventError: (eventName: string, error: unknown) => void } }> {
    constructor(
        private readonly client: Client,
        private readonly context: Context
    ) {}

    async loadEvents(): Promise<void> {
        const eventsPath = Config.paths.events;
        if (!fs.existsSync(eventsPath)) return;

        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

        for (const file of eventFiles) {
            try {
                const filePath = path.join(eventsPath, file);
                const fileUrl = pathToFileURL(filePath).href;
                const eventModule = await import(fileUrl);
                const events = Object.values(eventModule).filter(isBotEvent<Context>);

                for (const event of events) {
                    this.register(event);
                }
            } catch (error) {
                this.context.errorHandler?.handleEventError('loadEvents', error);
            }
        }
    }

    private register(event: BotEvent<Context>): void {
        const runner = (...args: any[]) => {
            Promise.resolve(event.execute(this.context, ...args)).catch((error) => {
                this.context.errorHandler?.handleEventError(event.name, error);
            });
        };

        if (event.once) {
            this.client.once(event.name, runner);
            return;
        }

        this.client.on(event.name, runner);
    }
}
