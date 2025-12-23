import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Config } from '../../config.js';
import { Embeds } from '../../utils/embeds.js';
import { commandStore } from '../commandStore.js';

/**
 * Ajuda exclusiva Root.
 * Lista comandos administrativos restritos.
 */
export const ajudaRootCommand: Command = {
    name: 'ajudaroot',
    aliases: ['hroot', 'roothelp'],
    description: 'Exibe a lista de comandos exclusivos do Root Manager.',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message) {
        const prefix = Config.bot.prefix;
        const helpEmbed = Embeds.admin(
            message.client,
            'Central de Ajuda Root Manager',
            'Comandos exclusivos para o administrador principal:'
        );

        // Agrupar comandos root por categoria
        const rootCommands = Array.from(commandStore.values()).filter(cmd => cmd.onlyRoot);
        
        const categoriesMap = new Map<string, Command[]>();
        for (const cmd of rootCommands) {
            const cat = cmd.category || 'perigoso';
            if (!categoriesMap.has(cat)) categoriesMap.set(cat, []);
            categoriesMap.get(cat)!.push(cmd);
        }

        const categoryMeta: Record<string, { title: string; emoji: string }> = {
            'admin': { title: 'Comandos Root', emoji: Config.emojis.folder },
            'perigoso': { title: 'Comandos Perigosos', emoji: '☣️' }
        };

        for (const [category, commands] of categoriesMap.entries()) {
            const meta = categoryMeta[category] || { title: `Categoria: ${category}`, emoji: '📂' };
            const content = commands
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(cmd => {
                    const usage = cmd.usage ? ` ${cmd.usage}` : '';
                    return `**\`${prefix}${cmd.name}${usage}\`**\n└ ${cmd.description}`;
                })
                .join('\n\n');

            helpEmbed.addFields({ name: `${meta.emoji} **${meta.title}**`, value: content });
        }

        helpEmbed.setFooter({ text: `Use ${prefix}ajuda [comando] para ver detalhes de um comando específico.` });

        await message.reply({ embeds: [helpEmbed] });
    }
};
