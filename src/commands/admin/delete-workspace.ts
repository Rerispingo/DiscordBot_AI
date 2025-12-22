import { Message, ChannelType } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import { loadWorkspaceConfig } from '../../workspace.js';

export const deleteWorkspaceCommand: Command = {
    name: 'delete-workspace',
    description: 'Remove a área de trabalho do bot no servidor, movendo canais extras para a categoria Outros.',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message) {
        const client = message.client;
        if (!message.guild) {
            await message.reply({ embeds: [Embeds.error(client, 'Este comando só pode ser utilizado dentro de um servidor.')] });
            return;
        }

        const workspaceConfig = await loadWorkspaceConfig();
        const categoryName = workspaceConfig.categoryName;

        const workspaceCategory = message.guild.channels.cache.find(
            ch => ch.type === ChannelType.GuildCategory && ch.name === categoryName
        );

        if (!workspaceCategory) {
            await message.reply({ embeds: [Embeds.error(client, `A categoria **${categoryName}** não existe neste servidor.`)] });
            return;
        }

        const workspaceChannelNames = new Set(workspaceConfig.channels.map(ch => ch.name));
        const channelsInCategory = message.guild.channels.cache.filter(ch => ch.parentId === workspaceCategory.id);
        const channelsToMove = channelsInCategory.filter(ch => !workspaceChannelNames.has(ch.name));

        let otherCategory = null;
        if (channelsToMove.size > 0) {
            otherCategory = message.guild.channels.cache.find(
                ch => ch.type === ChannelType.GuildCategory && ch.name === 'Outros'
            );

            if (!otherCategory) {
                otherCategory = await message.guild.channels.create({
                    name: 'Outros',
                    type: ChannelType.GuildCategory,
                });
            }
        }

        let currentChannelDeleted = false;

        for (const channel of channelsInCategory.values()) {
            if (workspaceChannelNames.has(channel.name)) {
                if (channel.id === message.channel.id) {
                    currentChannelDeleted = true;
                    continue; // Deletar por último
                }
                await channel.delete();
            } else if (otherCategory && (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice)) {
                await message.guild.channels.edit(channel.id, { parent: otherCategory.id });
            }
        }

        if (currentChannelDeleted) {
            // Se o canal atual vai ser deletado, avisamos antes
            try {
                await message.reply({ embeds: [Embeds.success(client, `Área de trabalho **${categoryName}** removida. Este canal será deletado em instantes.`)] });
            } catch (e) {
                // Ignora se não conseguir responder
            }
            // Pequeno delay para o usuário ver a mensagem
            await new Promise(resolve => setTimeout(resolve, 2000));
            await message.channel.delete();
        }

        await workspaceCategory.delete();

        if (!currentChannelDeleted) {
            await message.reply({ embeds: [Embeds.success(client, `Área de trabalho **${categoryName}** removida com sucesso.`)] });
        }
    }
};
