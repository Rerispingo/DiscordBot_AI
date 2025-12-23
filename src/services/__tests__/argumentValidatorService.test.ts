import { describe, it, expect, vi } from 'vitest';
import { ArgumentValidatorService } from '../argumentValidatorService.js';
import { ValidationError } from '../customErrors.js';
import { Command } from '../../types/command.js';

describe('ArgumentValidatorService', () => {
    const mockCommand: Command = {
        name: 'testCommand',
        description: 'A test command',
        category: 'consulta', // Adicionado para satisfazer a interface Command
        execute: async () => {},
        minArgs: 1,
        maxArgs: 2,
        args: [
            { name: 'arg1', description: 'Argument 1', required: true, type: 'string' },
            { name: 'arg2', description: 'Argument 2', required: false, type: 'number' },
        ],
    };

    it('should throw ValidationError if too few arguments', () => {
        expect(() => ArgumentValidatorService.validate(mockCommand, [])).toThrow(ValidationError);
        expect(() => ArgumentValidatorService.validate(mockCommand, [])).toThrow('Este comando requer pelo menos 1 argumento(s).');
    });

    it('should throw ValidationError if too many arguments', () => {
        expect(() => ArgumentValidatorService.validate(mockCommand, ['a', 'b', 'c'])).toThrow(ValidationError);
        expect(() => ArgumentValidatorService.validate(mockCommand, ['a', 'b', 'c'])).toThrow('Este comando aceita no máximo 2 argumento(s).');
    });

    it('should throw ValidationError if required argument is missing', () => {
        // This is covered by minArgs usually, but let's test the args definition loop
        const cmdWithArgsOnly: Command = {
            name: 'test',
            description: 'test',
            category: 'consulta', // Adicionado para satisfazer a interface Command
            execute: async () => {},
            args: [{ name: 'req', description: 'req', required: true, type: 'string' }]
        };
        expect(() => ArgumentValidatorService.validate(cmdWithArgsOnly, [])).toThrow('O argumento `req` é obrigatório.');
    });

    it('should throw ValidationError if argument type is invalid (number)', () => {
        expect(() => ArgumentValidatorService.validate(mockCommand, ['val1', 'not-a-number'])).toThrow('O argumento `arg2` deve ser um número.');
    });

    it('should validate correctly with valid arguments', () => {
        expect(() => ArgumentValidatorService.validate(mockCommand, ['val1'])).not.toThrow();
        expect(() => ArgumentValidatorService.validate(mockCommand, ['val1', '123'])).not.toThrow();
    });

    it('should validate user mentions', () => {
        const userCmd: Command = {
            name: 'user',
            description: 'user',
            category: 'consulta', // Adicionado para satisfazer a interface Command
            execute: async () => {},
            args: [{ name: 'target', description: 'target', required: true, type: 'user' }]
        };
        expect(() => ArgumentValidatorService.validate(userCmd, ['<@123>'])).not.toThrow();
        expect(() => ArgumentValidatorService.validate(userCmd, ['<@!123>'])).not.toThrow();
        expect(() => ArgumentValidatorService.validate(userCmd, ['123456789'])).not.toThrow();
        expect(() => ArgumentValidatorService.validate(userCmd, ['invalid'])).toThrow('O argumento `target` deve ser uma menção de usuário ou ID.');
    });

    it('should validate channel mentions', () => {
        const channelCmd: Command = {
            name: 'channel',
            description: 'channel',
            category: 'consulta', // Adicionado para satisfazer a interface Command
            execute: async () => {},
            args: [{ name: 'target', description: 'target', required: true, type: 'channel' }]
        };
        expect(() => ArgumentValidatorService.validate(channelCmd, ['<#123>'])).not.toThrow();
        expect(() => ArgumentValidatorService.validate(channelCmd, ['123456789'])).not.toThrow();
        expect(() => ArgumentValidatorService.validate(channelCmd, ['invalid'])).toThrow('O argumento `target` deve ser uma menção de canal ou ID.');
    });
});
