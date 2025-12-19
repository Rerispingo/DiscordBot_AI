import * as fs from 'fs';
import * as path from 'path';

const DATA_PATH = path.join(process.cwd(), 'data', 'managers.json');

interface ManagersData {
    [guildId: string]: string[];
}

export class ManagerSystem {
    private static load(): ManagersData {
        try {
            if (!fs.existsSync(DATA_PATH)) {
                return {};
            }
            const content = fs.readFileSync(DATA_PATH, 'utf-8');
            return JSON.parse(content);
        } catch (error) {
            console.error('Erro ao carregar managers:', error);
            return {};
        }
    }

    private static save(data: ManagersData): void {
        try {
            fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            console.error('Erro ao salvar managers:', error);
        }
    }

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

    static removeManager(guildId: string, userId: string): boolean {
        const data = this.load();
        if (!data[guildId] || !data[guildId].includes(userId)) {
            return false;
        }
        data[guildId] = data[guildId].filter(id => id !== userId);
        this.save(data);
        return true;
    }

    static isManager(guildId: string, userId: string): boolean {
        const data = this.load();
        return data[guildId]?.includes(userId) || false;
    }

    static listManagers(guildId: string): string[] {
        const data = this.load();
        return data[guildId] || [];
    }
}
