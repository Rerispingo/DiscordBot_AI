import { 
    Message, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ComponentType, 
    EmbedBuilder, 
    InteractionResponse,
    Interaction
} from 'discord.js';

export interface PaginationPage {
    title: string;
    emoji?: string;
    content: string;
}

/**
 * Utilitário para criar mensagens com paginação via botões.
 */
export class Pagination {
    /**
     * Cria e gerencia uma mensagem paginada.
     * @param message A mensagem original do usuário.
     * @param pages Lista de páginas (título, emoji, conteúdo).
     * @param embedFactory Função que cria o embed para cada página.
     * @param timeout Tempo limite do coletor (padrão 1 minuto).
     */
    static async create(
        message: Message, 
        pages: PaginationPage[], 
        embedFactory: (page: PaginationPage, idx: number, total: number) => EmbedBuilder,
        initialPage: number = 0,
        timeout: number = 60000
    ): Promise<void> {
        if (pages.length === 0) return;

        let currentPage = initialPage;

        const getRow = (idx: number) => {
            return new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('Anterior')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(idx === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Próxima')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(idx === pages.length - 1 || pages.length <= 1)
            );
        };

        const response = await message.reply({
            embeds: [embedFactory(pages[currentPage]!, currentPage, pages.length)],
            components: [getRow(currentPage)]
        });

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: timeout
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

            await interaction.update({
                embeds: [embedFactory(pages[currentPage]!, currentPage, pages.length)],
                components: [getRow(currentPage)]
            });
        });

        collector.on('end', async () => {
            const disabledRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder().setCustomId('prev_dis').setLabel('Anterior').setStyle(ButtonStyle.Primary).setDisabled(true),
                new ButtonBuilder().setCustomId('next_dis').setLabel('Próxima').setStyle(ButtonStyle.Primary).setDisabled(true)
            );
            await response.edit({ components: [disabledRow] }).catch(() => {});
        });
    }
}
