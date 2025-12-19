import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { ManagerSystem } from '../../managers.js';
import { Config } from '../../config.js';
import { Embeds } from '../../utils/embeds.js';

export const ajudaCommand: Command = {
    name: 'ajuda',
    description: 'Exibe a lista de comandos do bot.',
    category: 'geral',
    async execute(message: Message) {
        const isRoot = message.author.id === Config.bot.rootManagerId;
        const isManager = message.guildId && ManagerSystem.isManager(message.guildId, message.author.id);
        const canSeeManagerCommands = isRoot || isManager;

        const helpEmbed = Embeds.info(
            message.client, 
            'Central de Ajuda do Bot', 
            'Aqui estão os comandos disponíveis:'
        );

        helpEmbed.addFields(
            { name: `${Config.emojis.folder} **Comandos Gerais**`, value: 
                '**`./ajuda`** ou **`./`**\n└ Exibe esta mensagem de ajuda.\n\n' +
                '**`./ping`**\n└ Verifica a latência do bot.\n\n' +
                '**`./managers`**\n└ Lista os managers do servidor.\n\n' +
                '**`./managerroot`**\n└ Mostra quem é o Root Manager.\n\n' +
                '**`./emojirandom (quantidade)`**\n└ Sorteia emojis aleatórios.'
            },
            { name: `🎭 **Comandos Diversos**`, value:
                '**`./dado (faces)`**\n└ Rola um dado de N faces.\n\n' +
                '**`./8ball (pergunta)`**\n└ Faça uma pergunta à Bola 8.\n\n' +
                '**`./moeda`**\n└ Gira uma moeda (Cara ou Coroa).\n\n' +
                '**`./reverter (texto)`**\n└ Inverte o texto fornecido.\n\n' +
                '**`./escolha (opções...)`**\n└ Escolhe entre opções separadas por vírgula.\n\n' +
                '**`./ascii (texto)`**\n└ Transforma texto em arte ASCII.\n\n' +
                '**`./piada`**\n└ Conta uma piada de programador.'
            }
        );

        if (canSeeManagerCommands) {
            helpEmbed.addFields(
                { name: `${Config.emojis.tools} **Comandos de Manager**`, value:
                    '**`./msg-delete (quantidade)`**\n└ Deleta mensagens do chat.'
                }
            );
        }

        await message.reply({ embeds: [helpEmbed] });
    }
};
