import * as fs from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'pursued_users.json');

/**
 * Sistema para gerenciar usuários que estão sendo "perseguidos" pelo bot.
 */
export class PursuerSystem {
    private static cache: Set<string> | null = null;

    /**
     * Carrega a lista de IDs de usuários perseguidos.
     */
    private static async load(): Promise<Set<string>> {
        if (this.cache) return this.cache;

        try {
            if (!existsSync(DATA_PATH)) {
                this.cache = new Set();
                return this.cache;
            }
            const content = await fs.readFile(DATA_PATH, 'utf-8');
            const data = JSON.parse(content) as string[];
            this.cache = new Set(data);
            return this.cache;
        } catch (error) {
            console.error('Erro ao carregar usuários perseguidos:', error);
            this.cache = new Set();
            return this.cache;
        }
    }

    /**
     * Salva a lista de IDs de usuários perseguidos.
     */
    private static async save(): Promise<void> {
        if (!this.cache) return;
        try {
            await fs.writeFile(DATA_PATH, JSON.stringify(Array.from(this.cache), null, 2), 'utf-8');
        } catch (error) {
            console.error('Erro ao salvar usuários perseguidos:', error);
        }
    }

    /**
     * Ativa a perseguição para um usuário.
     */
    static async add(userId: string): Promise<void> {
        const pursued = await this.load();
        pursued.add(userId);
        await this.save();
    }

    /**
     * Desativa a perseguição para um usuário.
     */
    static async remove(userId: string): Promise<void> {
        const pursued = await this.load();
        pursued.delete(userId);
        await this.save();
    }

    /**
     * Verifica se um usuário está sendo perseguido.
     */
    static async isPursued(userId: string): Promise<boolean> {
        const pursued = await this.load();
        return pursued.has(userId);
    }
}
