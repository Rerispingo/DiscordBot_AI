import { Message, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/command.js';
import { ManagerSystem } from '../../managers.js';

export const managersCommand: Command = {
    name: 'managers',
    description: 'Lista todos os managers deste servidor.',
    category: 'geral',
    async execute(message: Message) {
        if (!message.guildId) return;

        const managerIds = ManagerSystem.listManagers(message.guildId);

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🛡️ Gerenciadores do Servidor')
            .setTimestamp();

        if (managerIds.length === 0) {
            embed.setDescription('Este servidor ainda não possui managers cadastrados.');
        } else {
            const managerList = managerIds.map(id => `<@${id}>`).join('\n');
            embed.setDescription(`Aqui estão os usuários com permissões de manager neste servidor:\n\n${managerList}`);
        }

        const avatarURL = message.client.user?.displayAvatarURL();
        if (avatarURL) {
            embed.setFooter({ text: 'Discord Bot TS', iconURL: avatarURL });
        }

        await message.reply({ embeds: [embed] });
    }
};
