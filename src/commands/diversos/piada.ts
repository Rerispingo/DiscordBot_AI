import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Comando de piadas aleatórias.
 */
export const piadaCommand: Command = {
    name: 'piada',
    description: 'Conta uma piada aleatória sobre programação.',
    category: 'diversos',
    async execute(message: Message, args: string[]) {
        const dataPath = path.join(__dirname, '../../../data/piadas.json');
        
        try {
            const content = await fs.readFile(dataPath, 'utf-8');
            const data = JSON.parse(content);
            const piadas = data.piadas;
            
            const piadaAleatoria = piadas[Math.floor(Math.random() * piadas.length)];
            
            const embed = Embeds.info(
                message.client,
                'Piada do Dia 🤡',
                piadaAleatoria
            );

            await message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao ler arquivo de piadas:', error);
            await message.reply({ embeds: [Embeds.error(message.client, 'Não foi possível contar uma piada agora. Tente novamente mais tarde.')] });
        }
    }
};
