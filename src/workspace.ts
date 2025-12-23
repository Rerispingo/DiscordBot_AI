import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { ChannelType, Guild, TextChannel } from 'discord.js';
import { Config } from './config.js';

export interface WorkspaceChannelConfig {
    name: string;
    type: 'text' | 'voice';
    /**
     * Descrição opcional do canal, usada como tópico em canais de texto.
     */
    description?: string;
}

export interface WorkspaceConfig {
    categoryName: string;
    channels: WorkspaceChannelConfig[];
}

let cachedConfig: WorkspaceConfig | null = null;

export async function loadWorkspaceConfig(): Promise<WorkspaceConfig> {
    if (cachedConfig) {
        return cachedConfig;
    }

    if (!existsSync(Config.paths.workspace)) {
        cachedConfig = {
            categoryName: 'Bot Workspace',
            channels: [
                { name: 'moderation-log', type: 'text', description: 'Canal de logs de moderação. Apenas o bot pode enviar mensagens aqui.' },
                { name: 'message-log', type: 'text', description: 'NAO MANDE MENSAGEM AQUI!' },
                { name: 'debugs', type: 'text' },
                { name: 'musica', type: 'text' },
                { name: 'comandos', type: 'text' },
                { name: 'voice-control', type: 'voice' }
            ]
        };
        return cachedConfig;
    }

    const content = await fs.readFile(Config.paths.workspace, 'utf-8');
    const json = JSON.parse(content) as { category: { name: string }; channels: WorkspaceChannelConfig[] };

    cachedConfig = {
        categoryName: json.category.name,
        channels: json.channels,
    };

    return cachedConfig;
}

/**
 * Busca o canal de log de moderação no workspace do servidor.
 * @param guild O servidor onde buscar o canal.
 * @returns O canal de texto ou null se não for encontrado.
 */
export async function findWorkspaceModerationLogChannel(guild: Guild): Promise<TextChannel | null> {
    return findWorkspaceChannelByName(guild, 'moderation-log');
}

/**
 * Busca o canal de log de mensagens no workspace do servidor.
 * @param guild O servidor onde buscar o canal.
 * @returns O canal de texto ou null se não for encontrado.
 */
export async function findWorkspaceMessageLogChannel(guild: Guild): Promise<TextChannel | null> {
    return findWorkspaceChannelByName(guild, 'message-log');
}

/**
 * Função genérica para buscar um canal de texto no workspace pelo nome.
 * @param guild O servidor onde buscar o canal.
 * @param channelName O nome do canal configurado no workspace.
 * @returns O canal de texto ou null se não for encontrado.
 */
async function findWorkspaceChannelByName(guild: Guild, channelName: string): Promise<TextChannel | null> {
    const config = await loadWorkspaceConfig();
    const channelConfig = config.channels.find(ch => ch.name === channelName && ch.type === 'text');

    if (!channelConfig) {
        return null;
    }

    const category = guild.channels.cache.find(
        ch => ch.type === ChannelType.GuildCategory && ch.name === config.categoryName
    );

    if (!category) {
        return null;
    }

    const channel = guild.channels.cache.find(
        ch =>
            ch.type === ChannelType.GuildText &&
            ch.name === channelConfig.name &&
            ch.parentId === category.id
    ) as TextChannel | undefined;

    return channel ?? null;
}

