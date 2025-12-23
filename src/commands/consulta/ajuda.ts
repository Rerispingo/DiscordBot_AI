import { Message, EmbedBuilder } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Config } from '../../config.js';
import { Embeds } from '../../utils/embeds.js';
import { commandStore } from '../commandStore.js';
import { Pagination, PaginationPage } from '../../utils/pagination.js';
import { PermissionService } from '../../services/permissionService.js';

/**
 * Comando de Ajuda com paginação dinâmica.
 * Exibe os comandos do bot organizados por categorias ou detalhes de um comando específico.
 */
export const ajudaCommand: Command = {
    name: 'ajuda',
    aliases: ['h', 'commands'],
    description: 'Exibe a lista de comandos do bot organizados por categorias ou detalhes de um comando.',
    usage: '[comando|página]',
    category: 'consulta',
    async execute(message: Message, args: string[]) {
        const client = message.client;
        const prefix = Config.bot.prefix;

        // Se o usuário passou o nome de um comando específico
        if (args.length > 0 && isNaN(Number(args[0]))) {
            const commandName = args[0].toLowerCase();
            const command = commandStore.get(commandName) || 
                          Array.from(commandStore.values()).find(cmd => cmd.aliases?.includes(commandName));

            if (command) {
                // Verificar permissão antes de mostrar detalhes
                const perm = await PermissionService.checkPermissions(message, command);
                if (perm.allowed) {
                    const embed = Embeds.info(client, `Comando: ${prefix}${command.name}`, command.description, 'ℹ️');
                    
                    if (command.aliases && command.aliases.length > 0) {
                        embed.addFields({ name: 'Aliases', value: command.aliases.map(a => `\`${a}\``).join(', '), inline: true });
                    }
                    
                    const usage = command.usage ? ` ${command.usage}` : '';
                    embed.addFields({ name: 'Uso', value: `\`${prefix}${command.name}${usage}\``, inline: true });
                    
                    if (command.category) {
                        embed.addFields({ name: 'Categoria', value: command.category, inline: true });
                    }

                    if (command.args && command.args.length > 0) {
                        const argsInfo = command.args.map(a => `**${a.name}** (${a.type}${a.required ? '*' : ''}): ${a.description}`).join('\n');
                        embed.addFields({ name: 'Argumentos', value: argsInfo });
                    }

                    if (command.examples && command.examples.length > 0) {
                        embed.addFields({ name: 'Exemplos', value: command.examples.map(e => `\`${prefix}${command.name} ${e}\``).join('\n') });
                    }

                    await message.reply({ embeds: [embed] });
                    return;
                }
            }
        }
        
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
            'consulta': { title: 'Consultas', emoji: '🔍' },
            'diversos': { title: 'Comandos Diversos', emoji: '🎲' },
            'mod-chat': { title: 'Moderação de Chat', emoji: '🛡️' },
            'mod-voz': { title: 'Moderação de Voz', emoji: '🔊' },
            'configuracao': { title: 'Configurações', emoji: '⚙️' },
            'admin': { title: 'Administração', emoji: '👑' }
        };

        // Ordem das categorias para exibição (seguindo o README.md)
        const categoryOrder = ['diversos', 'consulta', 'mod-chat', 'mod-voz', 'configuracao', 'admin'];

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
                    .map(cmd => {
                        const usage = cmd.usage ? ` ${cmd.usage}` : '';
                        return `**\`${prefix}${cmd.name}${usage}\`**\n└ ${cmd.description}`;
                    })
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
        const pageNumber = args.length > 0 && !isNaN(Number(args[0])) ? Math.max(0, Number(args[0]) - 1) : 0;

        await Pagination.create(
            message, 
            pages, 
            (page, idx, total) => {
                const embed = Embeds.info(client, page.title, page.content, page.emoji);
                embed.setFooter({ text: `Página ${idx + 1} de ${total} | Use ${prefix}ajuda [comando] para mais detalhes` });
                return embed;
            },
            pageNumber
        );
    }
};
