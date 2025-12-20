import { Message, TextChannel } from 'discord.js';
import type { Command } from '../../types/command.js';
import { Embeds } from '../../utils/embeds.js';

/**
 * Comando para deletar uma quantidade específica de mensagens do chat.
 * Restrito a Managers e Root.
 */
export const msgDeleteCommand: Command = {
    name: 'msg-delete',
    description: 'Deleta uma quantidade específica de mensagens do chat.',
    category: 'admin',
    onlyManager: true,
    async execute(message: Message, args: string[]) {
        const client = message.client;

        if (!args[0]) {
            await message.reply({ embeds: [Embeds.error(client, 'Por favor, informe uma quantidade de mensagens para deletar.')] });
            return;
        }

        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            await message.reply({ embeds: [Embeds.error(client, 'Por favor, informe uma quantidade válida de mensagens para deletar (Número positivo).')] });
            return;
        }

        if (amount > 100) {
            await message.reply({ embeds: [Embeds.error(client, 'Você só pode deletar até 100 mensagens por vez.')] });
            return;
        }

        const channel = message.channel as TextChannel;

        if (!channel.bulkDelete) {
            await message.reply({ embeds: [Embeds.error(client, 'Este comando só pode ser usado em canais de texto que permitem a exclusão em massa.')] });
            return;
        }

        try {
            // Deletar a mensagem do comando primeiro
            await message.delete().catch(() => {});

            // Bulk delete
            const deleted = await channel.bulkDelete(amount, true);
            
            const reply = await channel.send({ embeds: [Embeds.success(client, `Foram deletadas **${deleted.size}** mensagens.`)] });
            
            // Apagar a mensagem de confirmação após 3 segundos
            setTimeout(async () => {
                try {
                    await reply.delete().catch(() => {});
                } catch (err) {
                    console.error('Erro ao deletar mensagem de confirmação:', err);
                }
            }, 3000);

        } catch (error) {
            console.error('Erro ao executar msg-delete:', error);
            await channel.send({ embeds: [Embeds.error(client, 'Ocorreu um erro ao tentar deletar as mensagens. Certifique-se de que as mensagens não têm mais de 14 dias e que eu tenha permissão de "Gerenciar Mensagens".')] });
        }
    },
};
