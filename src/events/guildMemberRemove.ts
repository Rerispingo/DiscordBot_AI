import { Events, GuildMember, TextChannel, EmbedBuilder } from 'discord.js';
import type { BotEvent } from '../types/event.js';
import { GuildConfigSystem } from '../guildConfig.js';
import { Config } from '../config.js';

/**
 * Evento disparado quando um membro sai do servidor.
 * Envia uma mensagem de adeus customizada em um embed.
 */
export const guildMemberRemove: BotEvent<any> = {
    name: Events.GuildMemberRemove,
    async execute(context, member: GuildMember) {
        const config = await GuildConfigSystem.getConfig(member.guild.id);
        
        if (!config.exitChannelId) return;

        const channel = member.guild.channels.cache.get(config.exitChannelId) as TextChannel;
        if (!channel) return;

        const exitMsg = config.exitMessage || 'Saiu do servidor.';
        
        const embed = new EmbedBuilder()
            .setTitle('🚪 Adeus')
            .setDescription(`${member.user.username} ${exitMsg}`)
            .setColor(Config.colors.error)
            .setTimestamp()
            .setFooter({ 
                text: member.guild.name, 
                iconURL: member.guild.iconURL() || undefined 
            });

        await channel.send({ embeds: [embed] });
    }
};
