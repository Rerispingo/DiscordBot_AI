import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { ManagerSystem } from '../../managers.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para listar todos os managers do servidor atual.
 */
export const managersCommand: Command = {
    name: 'managers',
    description: 'Lista todos os managers deste servidor.',
    category: 'geral',
    async execute(message: Message) {
        const client = message.client;
        if (!message.guildId) {
            await message.reply({ embeds: [Embeds.error(client, 'Este comando só pode ser utilizado dentro de um servidor.')] });
            return;
        }

        const managerIds = ManagerSystem.listManagers(message.guildId);

        let description = '';
        if (managerIds.length === 0) {
            description = 'Este servidor ainda não possui managers cadastrados.';
        } else {
            const managerList = managerIds.map(id => `<@${id}>`).join('\n');
            description = `Aqui estão os usuários com permissões de manager neste servidor:\n\n${managerList}`;
        }

        const embed = Embeds.info(client, 'Gerenciadores do Servidor 🛡️', description);
        await message.reply({ embeds: [embed] });
    }
};
