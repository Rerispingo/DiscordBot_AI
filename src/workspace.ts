import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { ChannelType, Guild, TextChannel } from 'discord.js';
import { Config } from './config.js';

export interface WorkspaceChannelConfig {
    name: string;
    type: 'text' | 'voice';
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
                { name: 'logs', type: 'text' },
                { name: 'debugs', type: 'text' },
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

export async function findWorkspaceLogsChannel(guild: Guild): Promise<TextChannel | null> {
    const config = await loadWorkspaceConfig();
    const logsConfig = config.channels.find(ch => ch.name === 'logs' && ch.type === 'text');

    if (!logsConfig) {
        return null;
    }

    const category = guild.channels.cache.find(
        ch => ch.type === ChannelType.GuildCategory && ch.name === config.categoryName
    );

    if (!category) {
        return null;
    }

    const logsChannel = guild.channels.cache.find(
        ch =>
            ch.type === ChannelType.GuildText &&
            ch.name === logsConfig.name &&
            ch.parentId === category.id
    ) as TextChannel | undefined;

    return logsChannel ?? null;
}

