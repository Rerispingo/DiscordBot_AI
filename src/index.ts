import { Client, GatewayIntentBits } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.once('ready', () => {
  console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith('./')) return;

  const args = message.content.slice(2).trim().split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (command === 'off') {
    await message.reply('Desligando...');
    client.destroy();
  } else if (command === 'delete') {
    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0 || amount > 99) {
      return message.reply('Você precisa informar um número entre 1 e 99.');
    }
    try {
      await message.channel.bulkDelete(amount + 1);
      message.channel.send(`\`\`\`${amount} mensagens deletadas.\`\`\``).then(msg => {
        setTimeout(() => msg.delete(), 5000)
      });
    } catch (error) {
      console.error(error);
      message.reply('Ocorreu um erro ao tentar deletar as mensagens.');
    }
  } else if (command === 'join') {
    const member = message.member;
    if (member && member.voice.channel) {
      try {
        joinVoiceChannel({
          channelId: member.voice.channel.id,
          guildId: member.guild.id,
          adapterCreator: member.guild.voiceAdapterCreator,
        });
        message.reply('Entrou no canal de voz!');
      } catch (error) {
        console.error(error);
        message.reply('Ocorreu um erro ao tentar entrar no canal de voz.');
      }
    } else {
      message.reply('Você precisa estar em um canal de voz para usar este comando.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
