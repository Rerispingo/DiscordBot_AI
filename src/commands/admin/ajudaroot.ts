import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Config } from '../../config.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para exibir a ajuda exclusiva do Root Manager.
 * Lista todos os comandos administrativos restritos.
 */
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
            {
                name: `${Config.emojis.folder} **Comandos Root**`,
                value:
                    '**`./off`**\n└ Desliga o bot imediatamente.\n\n' +
                    '**`./manageradd @user`**\n└ Adiciona um novo manager ao servidor.\n\n' +
                    '**`./managerremove @user`**\n└ Remove um manager existente do servidor.\n\n' +
                    '**`./create-workspace`**\n└ Cria uma área de trabalho exclusiva para o bot com base no workspace.json.\n\n' +
                    '**`./delete-workspace`**\n└ Remove a área de trabalho do bot movendo canais extras para a categoria Outros.\n\n' +
                    '**`./status-type (tipo)`**\n└ Altera o tipo de atividade (playing, watching, listening, competing).\n\n' +
                    '**`./status-text (texto)`**\n└ Altera o texto da atividade do bot.\n\n' +
                    '**`./ajudaroot`**\n└ Exibe esta mensagem de ajuda administrativa.'
            },
            {
                name: `☣️ **Comandos Perigosos (Root Only)**`,
                value:
                    '**`./chat-pursuer @user`**\n└ Ativa a perseguição ao usuário (reações e chance de apagar mensagens).\n\n' +
                    '**`./chat-pursuer-disable @user`**\n└ Desativa a perseguição ao usuário.'
            }
        );

        await message.reply({ embeds: [helpEmbed] });
    }
};
