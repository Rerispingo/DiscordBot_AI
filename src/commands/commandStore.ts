import { Collection } from 'discord.js';
import { Command } from '../types/command.js';

/**
 * Armazenamento global dos comandos carregados.
 */
export const commandStore = new Collection<string, Command>();
