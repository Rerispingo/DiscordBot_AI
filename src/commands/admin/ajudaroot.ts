import { Message, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/command.js';

export const ajudaRootCommand: Command = {
    name: 'ajudaroot',
    description: 'Exibe a lista de comandos exclusivos do Root Manager.',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message) {
        const helpEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('🔐 Central de Ajuda Root Manager')
            .setDescription('Comandos exclusivos para o administrador principal:')
            .addFields(
                { name: '📂 **Comandos Root**', value:
                    '**`./off`**\n└ Desliga o bot imediatamente.\n\n' +
                    '**`./manageradd @user`**\n└ Adiciona um novo manager ao servidor.\n\n' +
                    '**`./managerremove @user`**\n└ Remove um manager existente do servidor.\n\n' +
                    '**`./creation-workspace`**\n└ Cria uma área de trabalho exclusiva para o bot.\n\n' +
                    '**`./ajudaroot`**\n└ Exibe esta mensagem de ajuda administrativa.'
                }
            )
            .setTimestamp();

        const avatarURL = message.client.user?.displayAvatarURL();
        if (avatarURL) {
            helpEmbed.setFooter({ text: 'Acesso Restrito: Root Manager', iconURL: avatarURL });
        }

        await message.reply({ embeds: [helpEmbed] });
    }
};
