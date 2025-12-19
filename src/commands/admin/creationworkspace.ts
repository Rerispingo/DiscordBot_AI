import { Message, ChannelType, PermissionFlagsBits } from 'discord.js';
import type { Command } from '../../types/command.js';

export const creationWorkspaceCommand: Command = {
    name: 'creation-workspace',
    description: 'Cria uma área de trabalho exclusiva para o bot no servidor.',
    category: 'admin',
    onlyRoot: true,
    async execute(message: Message) {
        if (!message.guild) return;

        const botName = message.client.user?.username || 'Bot';
        const categoryName = `${botName} Area`;

        // 1. Verificar se a categoria já existe
        const existingCategory = message.guild.channels.cache.find(
            (ch) => ch.name === categoryName && ch.type === ChannelType.GuildCategory
        );

        if (existingCategory) {
            await message.reply(`❌ A categoria **${categoryName}** já existe neste servidor.`);
            return;
        }

        try {
            // 2. Criar a categoria privada
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
                        id: message.client.user!.id, // O próprio bot
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageChannels, PermissionFlagsBits.SendMessages],
                    }
                ],
            });

            // 3. Criar o canal de texto "debugs"
            await message.guild.channels.create({
                name: 'debugs',
                type: ChannelType.GuildText,
                parent: category.id,
            });

            // 4. Criar o canal de voz "Voice"
            await message.guild.channels.create({
                name: 'Voice',
                type: ChannelType.GuildVoice,
                parent: category.id,
            });

            await message.reply(`✅ Workspace **${categoryName}** criado com sucesso com os canais #debugs e 🔊 Voice.`);

        } catch (error) {
            console.error('Erro ao criar workspace:', error);
            await message.reply('❌ Ocorreu um erro ao tentar criar o workspace. Verifique se o bot tem permissão de "Gerenciar Canais".');
        }
    },
};
