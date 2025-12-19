import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Config } from '../../config.js';
import { Embeds } from '../../utils/embeds.js';

export const ajudaRootCommand: Command = {
    name: 'ajudaroot',
    description: 'Exibe a lista de comandos exclusivos do Root Manager.',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message) {
        const helpEmbed = Embeds.admin(
            message.client,
            'Central de Ajuda Root Manager',
            'Comandos exclusivos para o administrador principal:'
        );

        helpEmbed.addFields(
            { name: `${Config.emojis.folder} **Comandos Root**`, value:
                '**`./off`**\n└ Desliga o bot imediatamente.\n\n' +
                '**`./manageradd @user`**\n└ Adiciona um novo manager ao servidor.\n\n' +
                '**`./managerremove @user`**\n└ Remove um manager existente do servidor.\n\n' +
                '**`./creation-workspace`**\n└ Cria uma área de trabalho exclusiva para o bot.\n\n' +
                '**`./ajudaroot`**\n└ Exibe esta mensagem de ajuda administrativa.'
            }
        );

        await message.reply({ embeds: [helpEmbed] });
    }
};
