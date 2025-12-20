import { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from 'discord.js';
import type { Command } from '../../types/command.js';
import { ManagerSystem } from '../../managers.js';
import { Config } from '../../config.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando de Ajuda com paginação.
 * Exibe os comandos do bot organizados por categorias em diferentes páginas.
 */
export const ajudaCommand: Command = {
    name: 'ajuda',
    description: 'Exibe a lista de comandos do bot organizados por páginas.',
    category: 'geral',
    async execute(message: Message) {
        const client = message.client;
        const isRoot = message.author.id === Config.bot.rootManagerId;
        const isManager = message.guildId && await ManagerSystem.isManager(message.guildId, message.author.id);
        const canSeeManagerCommands = isRoot || isManager;

        // Definição das páginas
        const pages = [
            {
                title: 'Comandos Gerais',
                emoji: '🏠',
                content: '**`./ajuda`** ou **`./`**\n└ Exibe esta mensagem de ajuda.\n\n' +
                         '**`./ping`**\n└ Verifica a latência do bot.\n\n' +
                         '**`./managers`**\n└ Lista os managers do servidor.\n\n' +
                         '**`./managerroot`**\n└ Mostra quem é o Root Manager.\n\n' +
                         '**`./emojirandom (quantidade)`**\n└ Sorteia emojis aleatórios.'
            },
            {
                title: 'Comandos Diversos',
                emoji: '🎲',
                content: '**`./dado (faces)`**\n└ Rola um dado de N faces.\n\n' +
                         '**`./8ball (pergunta)`**\n└ Faça uma pergunta à Bola 8.\n\n' +
                         '**`./moeda`**\n└ Gira uma moeda (Cara ou Coroa).\n\n' +
                         '**`./reverter (texto)`**\n└ Inverte o texto fornecido.\n\n' +
                         '**`./escolha (opções...)`**\n└ Escolhe entre opções separadas por vírgula.\n\n' +
                         '**`./ascii (texto)`**\n└ Transforma texto em arte ASCII.\n\n' +
                         '**`./piada`**\n└ Conta uma piada de programador.'
            }
        ];

        // Adicionar categorias de manager se permitido
        if (canSeeManagerCommands) {
            pages.push({
                title: 'Comandos de Moderacao Gerais',
                emoji: '🛡️',
                content: '**`./msg-delete (quantidade)`**\n└ Deleta mensagens do chat.'
            });
            pages.push({
                title: 'Moderação de Voz',
                emoji: '🔊',
                content: '**`./voice-lock`**\n└ Tranca o canal de voz para 1 pessoa.\n\n' +
                         '**`./voice-unlock`**\n└ Libera o canal de voz (ilimitado).\n\n' +
                         '**`./voice-kick @user`**\n└ Remove um usuário da chamada.\n\n' +
                         '**`./voice-move @user`**\n└ Move um usuário para sua chamada.'
            });
            pages.push({
                title: 'Moderação de Chat',
                emoji: '💬',
                content: '**`./chat-lock`**\n└ Bloqueia o envio de mensagens no canal.\n\n' +
                         '**`./chat-unlock`**\n└ Libera o envio de mensagens no canal.\n\n' +
                         '**`./nuke`**\n└ Limpa o histórico recriando o canal.'
            });
        }

        let currentPage = 0;

        const createEmbed = (pageIdx: number) => {
            const page = pages[pageIdx]!;
            const embed = Embeds.info(client, page.title, page.content, page.emoji);
            embed.setFooter({ text: `Página ${pageIdx + 1} de ${pages.length} | Use os botões abaixo para navegar` });
            return embed;
        };

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('Anterior')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Próxima')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(pages.length <= 1)
        );

        const response = await message.reply({
            embeds: [createEmbed(0)],
            components: [row]
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000 // 1 minuto
        });

        collector.on('collect', async (interaction) => {
            if (interaction.user.id !== message.author.id) {
                await interaction.reply({ content: 'Apenas quem usou o comando pode navegar nas páginas.', ephemeral: true });
                return;
            }

            if (interaction.customId === 'prev') {
                currentPage--;
            } else if (interaction.customId === 'next') {
                currentPage++;
            }

            row.components[0]!.setDisabled(currentPage === 0);
            row.components[1]!.setDisabled(currentPage === pages.length - 1);

            await interaction.update({
                embeds: [createEmbed(currentPage)],
                components: [row]
            });
        });

        collector.on('end', async () => {
            const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                row.components[0]!.setDisabled(true),
                row.components[1]!.setDisabled(true)
            );
            await response.edit({ components: [disabledRow] }).catch(() => {});
        });
    }
};
