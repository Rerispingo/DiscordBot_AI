import { Message, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/command.js';
import { ManagerSystem } from '../../managers.js';

export const ajudaCommand: Command = {
    name: 'ajuda',
    description: 'Exibe a lista de comandos do bot.',
    category: 'geral',
    async execute(message: Message) {
        const isRoot = message.author.id === process.env.ROOT_MANAGER_ID;
        const isManager = message.guildId && ManagerSystem.isManager(message.guildId, message.author.id);
        const canSeeManagerCommands = isRoot || isManager;

        const helpEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('🤖 Central de Ajuda do Bot')
            .setDescription('Aqui estão os comandos disponíveis:')
            .addFields(
                { name: '📂 **Comandos Gerais**', value: 
                    '**`./ajuda`** ou **`./`**\n└ Exibe esta mensagem de ajuda.\n\n' +
                    '**`./ping`**\n└ Verifica a latência do bot.\n\n' +
                    '**`./managers`**\n└ Lista os managers do servidor.\n\n' +
                    '**`./managerroot`**\n└ Mostra quem é o Root Manager.\n\n' +
                    '**`./emojirandom (quantidade)`**\n└ Sorteia emojis aleatórios.'
                }
            );

        if (canSeeManagerCommands) {
            helpEmbed.addFields(
                { name: '🛠️ **Comandos de Manager**', value:
                    '**`./msg-delete (quantidade)`**\n└ Deleta mensagens do chat.'
                }
            );
        }

        helpEmbed.setTimestamp();
        
        const avatarURL = message.client.user?.displayAvatarURL();
        if (avatarURL) {
            helpEmbed.setFooter({ text: 'Discord Bot TS', iconURL: avatarURL });
        }

        await message.reply({ embeds: [helpEmbed] });
    }
};
