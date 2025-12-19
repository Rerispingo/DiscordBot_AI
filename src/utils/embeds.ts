import { EmbedBuilder, Client } from 'discord.js';
import { Config } from '../config.js';

/**
 * Fábrica de Embeds padronizados para o bot.
 * Centraliza a identidade visual e simplifica a criação de mensagens para a IA.
 */
export class Embeds {
    /**
     * Cria um embed básico com rodapé padrão.
     */
    private static createBase(client: Client, title: string, description: string, color: number) {
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setTimestamp();

        const avatarURL = client.user?.displayAvatarURL();
        if (avatarURL) {
            embed.setFooter({ 
                text: client.user?.username || 'Bot', 
                iconURL: avatarURL 
            });
        }

        return embed;
    }

    /**
     * Embed para comandos gerais e informações públicas.
     */
    static info(client: Client, title: string, description: string) {
        return this.createBase(client, `${Config.emojis.bot} ${title}`, description, Config.colors.primary);
    }

    /**
     * Embed para comandos administrativos (Managers/Root).
     */
    static admin(client: Client, title: string, description: string) {
        return this.createBase(client, `${Config.emojis.admin} ${title}`, description, Config.colors.admin);
    }

    /**
     * Embed de sucesso para operações concluídas.
     */
    static success(client: Client, description: string) {
        return this.createBase(client, `${Config.emojis.success} Sucesso`, description, Config.colors.success);
    }

    /**
     * Embed de erro para falhas ou permissões negadas.
     */
    static error(client: Client, description: string) {
        return this.createBase(client, `${Config.emojis.error} Erro`, description, Config.colors.error);
    }
}
