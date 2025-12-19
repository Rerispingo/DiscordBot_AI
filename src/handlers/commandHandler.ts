import { Message, Collection } from 'discord.js';
import type { Command } from '../types/command.js';
import { ManagerSystem } from '../managers.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CommandHandler {
    private commands: Collection<string, Command> = new Collection();
    private prefix: string = './';

    constructor() {
        this.loadCommands();
    }

    private async loadCommands() {
        const commandsPath = path.join(__dirname, '..', 'commands');
        const categories = fs.readdirSync(commandsPath);

        for (const category of categories) {
            const categoryPath = path.join(commandsPath, category);
            if (!fs.lstatSync(categoryPath).isDirectory()) continue;

            const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

            for (const file of commandFiles) {
                try {
                    const filePath = path.join(categoryPath, file);
                    // No Windows, precisamos usar pathToFileURL para imports dinâmicos de arquivos locais
                    const fileUrl = pathToFileURL(filePath).href;
                    const commandModule = await import(fileUrl);
                    
                    // Procuramos por qualquer export que tenha a estrutura de um Command
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

    async handle(message: Message) {
        if (message.author.bot || !message.content.startsWith(this.prefix)) return;

        const args = message.content.slice(this.prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) {
            // Se o comando for apenas o prefixo "./"
            const ajudaCmd = this.commands.get('ajuda');
            if (ajudaCmd) {
                await ajudaCmd.execute(message, []);
            }
            return;
        }

        const command = this.commands.get(commandName);
        if (!command) return;

        // Verificação de permissões Root
        if (command.onlyRoot && message.author.id !== process.env.ROOT_MANAGER_ID) {
            await message.reply('❌ Este comando é restrito ao Root Manager.');
            return;
        }

        // Verificação de permissões Manager
        if (command.onlyManager) {
            const isRoot = message.author.id === process.env.ROOT_MANAGER_ID;
            const isManager = message.guildId && ManagerSystem.isManager(message.guildId, message.author.id);

            if (!isRoot && !isManager) {
                await message.reply('❌ Este comando é restrito aos Managers ou ao Root Manager.');
                return;
            }
        }

        try {
            await command.execute(message, args);
        } catch (error) {
            console.error(`Erro ao executar comando ${commandName}:`, error);
            await message.reply('❌ Ocorreu um erro ao executar este comando.');
        }
    }
}
