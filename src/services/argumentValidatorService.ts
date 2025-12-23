import type { Command } from '../types/command.js';
import { ValidationError } from './customErrors.js';

/**
 * Serviço responsável por validar os argumentos passados para os comandos.
 */
export class ArgumentValidatorService {
    /**
     * Valida os argumentos de um comando com base em sua definição (minArgs, maxArgs, args).
     * @param command O comando a ser validado.
     * @param args Os argumentos passados pelo usuário.
     * @throws {ValidationError} Se os argumentos forem inválidos.
     */
    static validate(command: Command, args: string[]): void {
        // Validação por contagem simples (min/max)
        if (command.minArgs !== undefined && args.length < command.minArgs) {
            throw new ValidationError(`Este comando requer pelo menos ${command.minArgs} argumento(s).`);
        }

        if (command.maxArgs !== undefined && args.length > command.maxArgs) {
            throw new ValidationError(`Este comando aceita no máximo ${command.maxArgs} argumento(s).`);
        }

        // Validação por definição de argumentos (CommandArgument)
        if (command.args) {
            for (let i = 0; i < command.args.length; i++) {
                const argDef = command.args[i];
                const argVal = args[i];

                if (argDef.required && !argVal) {
                    throw new ValidationError(`O argumento \`${argDef.name}\` é obrigatório.`);
                }

                if (argVal) {
                    this.validateArgumentType(argDef, argVal);
                }
            }
        }
    }

    /**
     * Valida o tipo de um argumento específico.
     * @param argDef Definição do argumento.
     * @param value Valor do argumento.
     * @throws {ValidationError} Se o tipo for inválido.
     */
    private static validateArgumentType(argDef: any, value: string): void {
        switch (argDef.type) {
            case 'number':
                if (isNaN(Number(value))) {
                    throw new ValidationError(`O argumento \`${argDef.name}\` deve ser um número.`);
                }
                break;
            case 'user':
                if (!value.match(/^<@!?(\d+)>$/) && !value.match(/^\d+$/)) {
                    throw new ValidationError(`O argumento \`${argDef.name}\` deve ser uma menção de usuário ou ID.`);
                }
                break;
            case 'channel':
                if (!value.match(/^<#(\d+)>$/) && !value.match(/^\d+$/)) {
                    throw new ValidationError(`O argumento \`${argDef.name}\` deve ser uma menção de canal ou ID.`);
                }
                break;
        }
    }
}
