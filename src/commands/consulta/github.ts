import { Message } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Config } from '../../config.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para exibir o link do repositório no GitHub.
 */
export const githubCommand: Command = {
    name: 'github',
    description: 'Envia o link do repositório do bot no GitHub.',
    category: 'consulta',
    async execute(message: Message) {
        const client = message.client;
        const githubLink = Config.bot.github;

        if (!githubLink) {
            await message.reply({ 
                embeds: [Embeds.error(client, 'O link do GitHub não está configurado.')] 
            });
            return;
        }

        const embed = Embeds.info(
            client,
            'GitHub do Projeto',
            `Você pode encontrar o código-fonte deste bot em:\n${githubLink}`,
            '🔗'
        );

        await message.reply({ embeds: [embed] });
    }
};
