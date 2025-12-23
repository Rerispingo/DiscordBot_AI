import { Message } from 'discord.js';

/**
 * Define a estrutura de um argumento de comando.
 */
export interface CommandArgument {
    name: string;
    description: string;
    required: boolean;
    type: 'string' | 'number' | 'user' | 'channel' | 'role';
}

/**
 * Interface principal para todos os comandos do bot.
 */
export interface Command {
    name: string;
    description: string;
    aliases?: string[];
    usage?: string;
    examples?: string[];
    category: 'consulta' | 'admin' | 'diversos' | 'mod-voz' | 'mod-chat' | 'configuracao' | 'perigoso';
    args?: CommandArgument[];
    minArgs?: number;
    maxArgs?: number;
    onlyRoot?: boolean;
    onlyManager?: boolean;
    execute(message: Message, args: string[]): Promise<void>;
}
