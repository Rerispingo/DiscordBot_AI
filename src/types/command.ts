import { Message } from 'discord.js';

export interface Command {
    name: string;
    description: string;
    category: 'geral' | 'admin' | 'diversos' | 'mod-voz' | 'mod-chat' | 'configuracao';
    onlyRoot?: boolean;
    onlyManager?: boolean;
    execute(message: Message, args: string[]): Promise<void>;
}
