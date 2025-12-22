import { Message, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Config } from '../../config.js';
import { Embeds } from '../../utils/embeds.js';
import { commandStore } from '../commandStore.js';
import { Pagination, PaginationPage } from '../../utils/pagination.js';
import { PermissionService } from '../../services/permissionService.js';

/**
 * Comando de Ajuda com paginação dinâmica.
 * Exibe os comandos do bot organizados por categorias detectadas automaticamente.
 */
export const ajudaCommand: Command = {
    name: 'ajuda',
    description: 'Exibe a lista de comandos do bot organizados por categorias.',
    category: 'geral',
    async execute(message: Message) {
        const client = message.client;
        
        // Agrupar comandos por categoria
        const categoriesMap = new Map<string, Command[]>();
        
        for (const command of commandStore.values()) {
            // Ignorar comandos que são exclusivos do Root Manager (estes aparecem apenas no ./ajudaroot)
            if (command.onlyRoot) continue;

            // Verificar se o usuário tem permissão para ver o comando
            const perm = await PermissionService.checkPermissions(message, command);
            if (!perm.allowed) continue;

            const category = command.category || 'Outros';
            if (!categoriesMap.has(category)) {
                categoriesMap.set(category, []);
            }
            categoriesMap.get(category)!.push(command);
        }

        // Mapeamento de nomes amigáveis e emojis para categorias
        const categoryMeta: Record<string, { title: string; emoji: string }> = {
            'geral': { title: 'Comandos Gerais', emoji: '🏠' },
            'diversos': { title: 'Comandos Diversos', emoji: '🎲' },
            'mod-chat': { title: 'Moderação de Chat', emoji: '🛡️' },
            'mod-voz': { title: 'Moderação de Voz', emoji: '🔊' },
            'configuracao': { title: 'Configurações', emoji: '⚙️' },
            'admin': { title: 'Administração', emoji: '👑' }
        };

        // Ordem das categorias para exibição (seguindo o README.md)
        const categoryOrder = ['geral', 'diversos', 'mod-chat', 'mod-voz', 'configuracao', 'admin'];

        // Criar páginas baseadas nas categorias encontradas
        const pages: PaginationPage[] = Array.from(categoriesMap.entries())
            .sort(([catA], [catB]) => {
                const indexA = categoryOrder.indexOf(catA);
                const indexB = categoryOrder.indexOf(catB);
                
                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                return catA.localeCompare(catB);
            })
            .map(([category, commands]) => {
                const meta = categoryMeta[category] || { title: `Categoria: ${category}`, emoji: '📂' };
                const content = commands
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map(cmd => `**\`${Config.bot.prefix}${cmd.name}\`**\n└ ${cmd.description}`)
                    .join('\n\n');

                return {
                    title: meta.title,
                    emoji: meta.emoji,
                    content
                };
            });

        if (pages.length === 0) {
            await message.reply('Nenhum comando disponível para você no momento.');
            return;
        }

        // Utilizar o utilitário de paginação
        await Pagination.create(
            message, 
            pages, 
            (page, idx, total) => {
                const embed = Embeds.info(client, page.title, page.content, page.emoji);
                embed.setFooter({ text: `Página ${idx + 1} de ${total} | Use os botões abaixo para navegar` });
                return embed;
            }
        );
    }
};
