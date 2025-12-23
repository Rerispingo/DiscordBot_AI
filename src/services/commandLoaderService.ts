import { Collection } from 'discord.js';
import type { Command } from '../types/command.js';
import { Config } from '../config.js';
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { commandStore } from '../commands/commandStore.js';

/**
 * Serviço responsável pelo carregamento dinâmico de comandos e mapeamento de aliases.
 */
export class CommandLoaderService {
    /**
     * Carrega recursivamente os comandos do diretório configurado.
     * @param aliases Coleção onde os aliases serão registrados.
     */
    static async loadCommands(aliases: Collection<string, string>): Promise<void> {
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
                        commandStore.set(command.name.toLowerCase(), command);
                        
                        // Registra aliases
                        if (command.aliases && Array.isArray(command.aliases)) {
                            for (const alias of command.aliases) {
                                aliases.set(alias.toLowerCase(), command.name.toLowerCase());
                            }
                        }

                        console.log(`✅ Comando carregado: ${command.name} (${category})`);
                    }
                } catch (error) {
                    console.error(`❌ Erro ao carregar comando ${file}:`, error);
                }
            }
        }
    }
}
