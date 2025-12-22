import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Provedor central de configurações do Bot.
 * Este arquivo serve como o "Mapa da Verdade" para o desenvolvedor e para a IA.
 */
export const Config = {
    // Configurações de Conexão
    bot: {
        token: process.env.DISCORD_TOKEN || '',
        prefix: './',
        rootManagerId: process.env.ROOT_MANAGER_ID || '',
    },

    // Identidade Visual (Cores, Emojis, Estética)
    colors: {
        primary: 0x0099FF,    // Azul (Geral)
        admin: 0xFF0000,      // Vermelho (Root)
        success: 0x00FF00,    // Verde
        error: 0xFF4444,      // Vermelho claro
        warning: 0xFFAA00,    // Laranja
    },

    paths: {
        data: path.join(process.cwd(), 'data'),
        managers: path.join(process.cwd(), 'data', 'managers.json'),
        emojis: path.join(process.cwd(), 'data', 'emojis.json'),
        status: path.join(process.cwd(), 'data', 'status.json'),
        workspace: path.join(process.cwd(), 'data', 'workspace.json'),
        guildConfigs: path.join(process.cwd(), 'data', 'guild_configs.json'),
        commands: path.join(__dirname, 'commands'),
        events: path.join(__dirname, 'events'),
    },

    // Emojis de Status/UI
    emojis: {
        success: '✅',
        error: '❌',
        admin: '🔐',
        bot: '🤖',
        folder: '📂',
        tools: '🛠️',
        lock: '🔒',
        voice: '🔊',
    }
};

export function assertRuntimeConfig(): void {
    const errors: string[] = [];

    if (!Config.bot.token) {
        errors.push('DISCORD_TOKEN não encontrado no arquivo .env');
    }

    if (!Config.bot.prefix) {
        errors.push('Prefix do bot inválido');
    }

    if (Config.bot.rootManagerId && !/^\d+$/.test(Config.bot.rootManagerId)) {
        errors.push('ROOT_MANAGER_ID inválido (use apenas números)');
    }

    if (errors.length > 0) {
        throw new Error(errors.join('\n'));
    }
}
