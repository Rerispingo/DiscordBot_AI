import * as fs from 'fs';
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
    /**
     * Carrega os dados de managers do arquivo JSON.
     * @returns O objeto contendo os managers de todos os servidores.
     */
    private static load(): ManagersData {
        try {
            if (!fs.existsSync(Config.paths.managers)) {
                return {};
            }
            const content = fs.readFileSync(Config.paths.managers, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            console.error('Erro ao carregar managers:', error);
            return {};
        }
    }

    /**
     * Salva os dados de managers no arquivo JSON.
     * @param data O objeto de dados a ser persistido.
     */
    private static save(data: ManagersData): void {
        try {
            fs.writeFileSync(Config.paths.managers, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error('Erro ao salvar managers:', error);
        }
    }

    /**
     * Adiciona um usuário à lista de managers de um servidor.
     * @param guildId ID do servidor.
     * @param userId ID do usuário.
     * @returns True se adicionado, False se já era manager.
     */
    static addManager(guildId: string, userId: string): boolean {
        const data = this.load();
        if (!data[guildId]) {
            data[guildId] = [];
        }
        if (data[guildId].includes(userId)) {
            return false;
        }
        data[guildId].push(userId);
        this.save(data);
        return true;
    }

    /**
     * Remove um usuário da lista de managers de um servidor.
     * @param guildId ID do servidor.
     * @param userId ID do usuário.
     * @returns True se removido, False se não estava na lista.
     */
    static removeManager(guildId: string, userId: string): boolean {
        const data = this.load();
        if (!data[guildId] || !data[guildId].includes(userId)) {
            return false;
        }
        data[guildId] = data[guildId].filter(id => id !== userId);
        this.save(data);
        return true;
    }

    /**
     * Verifica se um usuário tem permissões de manager em um servidor.
     * @param guildId ID do servidor.
     * @param userId ID do usuário.
     * @returns True se for manager.
     */
    static isManager(guildId: string, userId: string): boolean {
        const data = this.load();
        return data[guildId]?.includes(userId) || false;
    }

    /**
     * Lista todos os IDs de usuários que são managers em um servidor.
     * @param guildId ID do servidor.
     * @returns Array de UserIDs.
     */
    static listManagers(guildId: string): string[] {
        const data = this.load();
        return data[guildId] || [];
    }
}
