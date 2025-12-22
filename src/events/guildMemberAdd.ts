import { Events, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import type { BotEvent } from '../types/event.js';
import { GuildConfigSystem } from '../guildConfig.js';
import { Config } from '../config.js';

/**
 * Evento disparado quando um novo membro entra no servidor.
 * Envia uma mensagem de boas-vindas customizada em um embed.
 */
export const guildMemberAdd: BotEvent<any> = {
    name: Events.GuildMemberAdd,
    async execute(context, member: GuildMember) {
        const config = await GuildConfigSystem.getConfig(member.guild.id);
        
        if (!config.welcomeChannelId) return;

        const channel = member.guild.channels.cache.get(config.welcomeChannelId) as TextChannel;
        if (!channel) return;

        const welcomeMsg = config.welcomeMessage || 'Seja bem-vindo(a) ao servidor!';
        
        const embed = new EmbedBuilder()
            .setTitle('👋 Boas-vindas!')
            .setDescription(`${welcomeMsg}\n\n**Usuário:** ${member.user.tag}\n**ID:** ${member.id}`)
            .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
            .setColor(Config.colors.success)
            .setTimestamp()
            .setFooter({ 
                text: member.guild.name, 
                iconURL: member.guild.iconURL() || undefined 
            });

        await channel.send({ content: `${member}`, embeds: [embed] });
    }
};
