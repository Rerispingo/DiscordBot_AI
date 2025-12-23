import { Message, ChannelType, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';
import { loadWorkspaceConfig } from '../../workspace.js';

/**
 * Comando para criar uma área de trabalho exclusiva para o bot no servidor.
 * Restrito ao Root Manager.
 */
export const createWorkspaceCommand: Command = {
    name: 'create-workspace',
    description: 'Cria uma área de trabalho exclusiva para o bot no servidor com base no workspace.json.',
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

        // 1. Verificar se a categoria já existe
        const existingCategory = message.guild.channels.cache.find(
            (ch) => ch.name === categoryName && ch.type === ChannelType.GuildCategory
        );

        if (existingCategory) {
            await message.reply({ embeds: [Embeds.error(client, `A categoria **${categoryName}** já existe neste servidor.`)] });
            return;
        }

        try {
            const category = await message.guild.channels.create({
                name: categoryName,
                type: ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: message.guild.id, // @everyone
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: message.author.id, // Root Manager
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect, PermissionFlagsBits.Speak],
                    },
                    {
                        id: client.user!.id, // O próprio bot
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.SendMessages],
                    }
                ],
            });

            for (const channelConfig of workspaceConfig.channels) {
                if (channelConfig.type === 'text') {
                    const permissionOverwrites = [
                        {
                            id: message.guild.id, // @everyone
                            deny: [PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: message.author.id, // Root Manager
                            deny: [PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: client.user!.id, // O próprio bot
                            allow: [PermissionFlagsBits.SendMessages],
                        }
                    ];

                    await message.guild.channels.create({
                        name: channelConfig.name,
                        type: ChannelType.GuildText,
                        parent: category.id,
                        topic: channelConfig.description || undefined,
                        permissionOverwrites: channelConfig.name === 'moderation-log' ? permissionOverwrites : [],
                    });
                } else if (channelConfig.type === 'voice') {
                    await message.guild.channels.create({
                        name: channelConfig.name,
                        type: ChannelType.GuildVoice,
                        parent: category.id,
                    });
                }
            }

            await message.reply({ embeds: [Embeds.success(client, `Área de trabalho **${categoryName}** criada com sucesso!`)] });

        } catch (error) {
            console.error('Erro ao criar workspace:', error);
            await message.reply({ embeds: [Embeds.error(client, 'Ocorreu um erro ao tentar criar a área de trabalho. Verifique se eu tenho permissão de "Gerenciar Canais".')] });
        }
    }
};
