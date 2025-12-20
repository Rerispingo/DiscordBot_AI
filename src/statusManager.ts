import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import { Config } from './config.js';
import { ActivityType } from 'discord.js';

/**
 * Interface que define a estrutura de dados do status do bot no disco.
 */
export interface StatusData {
    /** Tipo de atividade do bot (Playing, Watching, etc) */
    type: ActivityType;
    /** Texto da atividade do bot */
    text: string;
}

/**
 * Sistema de gerenciamento de Status do bot com persistência em disco.
 */
export class StatusManager {
    private static defaultStatus: StatusData = {
        type: ActivityType.Playing,
        text: 'DiscordBot_AI | ./ajuda'
    };

    /**
     * Carrega os dados de status do arquivo JSON.
     * @returns O objeto contendo o status do bot.
     */
    static async load(): Promise<StatusData> {
        try {
            if (!existsSync(Config.paths.status)) {
                return this.defaultStatus;
            }
            const content = await fs.readFile(Config.paths.status, 'utf-8');
            const data = JSON.parse(content);
            return {
                type: data.type ?? this.defaultStatus.type,
                text: data.text ?? this.defaultStatus.text
            };
        } catch (error) {
            console.error('Erro ao carregar status:', error);
            return this.defaultStatus;
        }
    }

    /**
     * Salva os dados de status no arquivo JSON.
     * @param data O objeto de dados a ser persistido.
     */
    static async save(data: StatusData): Promise<void> {
        try {
            await fs.writeFile(Config.paths.status, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error('Erro ao salvar status:', error);
        }
    }

    /**
     * Atualiza o tipo de status do bot.
     * @param type Novo tipo de atividade.
     */
    static async setType(type: ActivityType): Promise<void> {
        const data = await this.load();
        data.type = type;
        await this.save(data);
    }

    /**
     * Atualiza o texto do status do bot.
     * @param text Novo texto de atividade.
     */
    static async setText(text: string): Promise<void> {
        const data = await this.load();
        data.text = text;
        await this.save(data);
    }
}
