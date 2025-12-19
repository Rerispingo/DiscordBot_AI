import { Message, TextChannel } from 'discord.js';
import type { Command } from '../../types/command.js';

export const msgDeleteCommand: Command = {
    name: 'msg-delete',
    description: 'Deleta uma quantidade específica de mensagens do chat.',
    category: 'admin',
    onlyManager: true,
    async execute(message: Message, args: string[]) {
        if (!args[0]) {
            await message.reply('❌ Por favor, informe uma quantidade de mensagens para deletar.');
            return;
        }

        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            await message.reply('❌ Por favor, informe uma quantidade válida de mensagens para deletar.');
            return;
        }

        if (amount > 100) {
            await message.reply('❌ Você só pode deletar até 100 mensagens por vez.');
            return;
        }

        const channel = message.channel as TextChannel;

        if (!channel.bulkDelete) {
            await message.reply('❌ Este comando só pode ser usado em canais que permitem a exclusão em massa.');
            return;
        }

        try {
            // Deletar a mensagem do comando primeiro
            await message.delete();

            // Bulk delete
            const deleted = await channel.bulkDelete(amount, true);
            
            const reply = await channel.send(`✅ Foram deletadas **${deleted.size}** mensagens.`);
            
            // Apagar a mensagem de confirmação após 2 segundos
            setTimeout(async () => {
                try {
                    await reply.delete();
                } catch (err) {
                    console.error('Erro ao deletar mensagem de confirmação:', err);
                }
            }, 2000);

        } catch (error) {
            console.error('Erro ao executar msg-delete:', error);
            try {
                await channel.send('❌ Ocorreu um erro ao tentar deletar as mensagens. Certifique-se de que as mensagens não têm mais de 14 dias.');
            } catch (sendErr) {
                console.error('Erro ao enviar mensagem de erro:', sendErr);
            }
        }
    },
};
