import { Message, Collection } from 'discord.js';
import type { Command } from '../types/command.js';
import { ManagerSystem } from '../managers.js';
import { Config } from '../config.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { Embeds } from '../utils/embeds.js';

/**
 * Gerenciador central de comandos.
 * Responsável pelo carregamento dinâmico e pela execução com validação de permissões.
 */
export class CommandHandler {
    private commands: Collection<string, Command> = new Collection();
    private prefix: string = Config.bot.prefix;

    constructor() {
        this.loadCommands();
    }

    /**
     * Varre recursivamente o diretório de comandos e os carrega na memória.
     */
    private async loadCommands() {
        const commandsPath = Config.paths.commands;
        if (!fs.existsSync(commandsPath)) return;

        const categories = fs.readdirSync(commandsPath);

        for (const category of categories) {
            const categoryPath = path.join(commandsPath, category);
            if (!fs.lstatSync(categoryPath).isDirectory()) continue;

            const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

            for (const file of commandFiles) {
                try {
                    const filePath = path.join(categoryPath, file);
                    const fileUrl = pathToFileURL(filePath).href;
                    const commandModule = await import(fileUrl);
                    
                    const commandKey = Object.keys(commandModule).find(key => {
                        const cmd = commandModule[key];
                        return cmd && typeof cmd === 'object' && 'name' in cmd && 'execute' in cmd;
                    });

                    if (commandKey) {
                        const command: Command = commandModule[commandKey];
                        this.commands.set(command.name, command);
                        console.log(`✅ Comando carregado: ${command.name} (${category})`);
                    }
                } catch (error) {
                    console.error(`❌ Erro ao carregar comando ${file}:`, error);
                }
            }
        }
    }

    /**
     * Processa uma mensagem recebida para identificar e executar um comando.
     * @param message A mensagem recebida do Discord.
     */
    async handle(message: Message) {
        if (message.author.bot || !message.content.startsWith(this.prefix)) return;

        const args = message.content.slice(this.prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) {
            const ajudaCmd = this.commands.get('ajuda');
            if (ajudaCmd) {
                await ajudaCmd.execute(message, []);
            }
            return;
        }

        const command = this.commands.get(commandName);
        if (!command) return;

        // Verificação de permissões Root
        if (command.onlyRoot && message.author.id !== Config.bot.rootManagerId) {
            await message.reply({
                embeds: [Embeds.error(message.client, 'Este comando é restrito ao Root Manager.')]
            });
            return;
        }

        // Verificação de permissões Manager
        if (command.onlyManager) {
            const isRoot = message.author.id === Config.bot.rootManagerId;
            const isManager = message.guildId && await ManagerSystem.isManager(message.guildId, message.author.id);

            if (!isRoot && !isManager) {
                await message.reply({
                    embeds: [Embeds.error(message.client, 'Este comando é restrito aos Managers ou ao Root Manager.')]
                });
                return;
            }
        }

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(`Erro ao executar comando ${commandName}:`, error);
            await message.reply(`${Config.emojis.error} Ocorreu um erro ao executar este comando.`);
        }
    }
}
