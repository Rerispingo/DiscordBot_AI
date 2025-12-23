import { Message } from 'discord.js';

export interface Command {
    name: string;
    description: string;
    usage?: string;
    category: 'consulta' | 'admin' | 'diversos' | 'mod-voz' | 'mod-chat' | 'configuracao' | 'perigoso';
    onlyRoot?: boolean;
    onlyManager?: boolean;
    execute(message: Message, args: string[]): Promise<void>;
}
