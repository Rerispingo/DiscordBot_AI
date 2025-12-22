import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { Config } from './config.js';

/**
 * Estrutura de configuração por servidor.
 */
export interface GuildConfig {
    welcomeChannelId?: string;
    exitChannelId?: string;
    welcomeMessage?: string;
    exitMessage?: string;
}

/**
 * Mapeia GuildID para sua configuração.
 */
interface GuildConfigsData {
    [guildId: string]: GuildConfig;
}

/**
 * Sistema de gerenciamento de configurações de servidores com persistência em disco.
 * Gerencia preferências de boas-vindas e saída.
 */
export class GuildConfigSystem {
    private static cache: GuildConfigsData | null = null;

    /**
     * Carrega as configurações do arquivo JSON com cache em memória.
     */
    private static async load(): Promise<GuildConfigsData> {
        if (this.cache) {
            return this.cache;
        }

        try {
            if (!existsSync(Config.paths.guildConfigs)) {
                this.cache = {};
                return this.cache;
            }
            const content = await fs.readFile(Config.paths.guildConfigs, 'utf-8');
            this.cache = JSON.parse(content);
            return this.cache || {};
        } catch (error) {
            console.error('Erro ao carregar configurações dos servidores:', error);
            this.cache = {};
            return this.cache;
        }
    }

    /**
     * Salva as configurações no arquivo JSON e atualiza o cache.
     */
    private static async save(data: GuildConfigsData): Promise<void> {
        try {
            this.cache = data;
            await fs.writeFile(Config.paths.guildConfigs, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error('Erro ao salvar configurações dos servidores:', error);
        }
    }

    /**
     * Obtém a configuração de um servidor específico.
     */
    static async getConfig(guildId: string): Promise<GuildConfig> {
        const data = await this.load();
        return data[guildId] || {};
    }

    /**
     * Atualiza a configuração de um servidor.
     */
    static async updateConfig(guildId: string, updates: Partial<GuildConfig>): Promise<void> {
        const data = await this.load();
        data[guildId] = {
            ...(data[guildId] || {}),
            ...updates
        };
        await this.save(data);
    }
}
