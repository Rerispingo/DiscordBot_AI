import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { Config } from './config.js';

/**
 * Interface que define a estrutura de dados dos managers no disco.
 */
interface ManagersData {
    /** Mapeia GuildID para uma lista de UserIDs que são managers */
    [guildId: string]: string[];
}

/**
 * Sistema de gerenciamento de Managers com persistência em disco.
 * Fornece métodos estáticos para adicionar, remover e verificar permissões.
 */
export class ManagerSystem {
    private static cache: ManagersData | null = null;

    /**
     * Carrega os dados de managers do arquivo JSON com cache em memória.
     * @returns O objeto contendo os managers de todos os servidores.
     */
    private static async load(): Promise<ManagersData> {
        if (this.cache) {
            return this.cache;
        }

        try {
            if (!existsSync(Config.paths.managers)) {
                this.cache = {};
                return this.cache;
            }
            const content = await fs.readFile(Config.paths.managers, 'utf-8');
            this.cache = JSON.parse(content);
            return this.cache || {};
        } catch (error) {
            console.error('Erro ao carregar managers:', error);
            this.cache = {};
            return this.cache;
        }
    }

    /**
     * Salva os dados de managers no arquivo JSON e atualiza o cache.
     * @param data O objeto de dados a ser persistido.
     */
    private static async save(data: ManagersData): Promise<void> {
        try {
            this.cache = data;
            await fs.writeFile(Config.paths.managers, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error('Erro ao salvar managers:', error);
        }
    }

    /**
     * Limpa o cache em memória (útil para testes).
     */
    static clearCache(): void {
        this.cache = null;
    }

    /**
     * Adiciona um usuário à lista de managers de um servidor.
     * @param guildId ID do servidor.
     * @param userId ID do usuário.
     * @returns True se adicionado, False se já era manager.
     */
    static async addManager(guildId: string, userId: string): Promise<boolean> {
        const data = await this.load();
        if (!data[guildId]) {
            data[guildId] = [];
        }
        if (data[guildId].includes(userId)) {
            return false;
        }
        data[guildId].push(userId);
        await this.save(data);
        return true;
    }

    /**
     * Remove um usuário da lista de managers de um servidor.
     * @param guildId ID do servidor.
     * @param userId ID do usuário.
     * @returns True se removido, False se não estava na lista.
     */
    static async removeManager(guildId: string, userId: string): Promise<boolean> {
        const data = await this.load();
        if (!data[guildId] || !data[guildId].includes(userId)) {
            return false;
        }
        data[guildId] = data[guildId].filter(id => id !== userId);
        await this.save(data);
        return true;
    }

    /**
     * Verifica se um usuário tem permissões de manager em um servidor.
     * @param guildId ID do servidor.
     * @param userId ID do usuário.
     * @returns True se for manager.
     */
    static async isManager(guildId: string, userId: string): Promise<boolean> {
        const data = await this.load();
        return data[guildId]?.includes(userId) || false;
    }

    /**
     * Lista todos os IDs de usuários que são managers em um servidor.
     * @param guildId ID do servidor.
     * @returns Array de UserIDs.
     */
    static async listManagers(guildId: string): Promise<string[]> {
        const data = await this.load();
        return data[guildId] || [];
    }
}
