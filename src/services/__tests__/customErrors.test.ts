import { describe, it, expect, vi } from 'vitest';
import { BotError, ValidationError, PermissionError, ChannelRestrictionError, InternalError } from '../customErrors.js';

describe('BotError', () => {
    it('should create a BotError instance with a message and isPublic true by default', () => {
        const error = new BotError('Test Bot Error');
        expect(error).toBeInstanceOf(BotError);
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Test Bot Error');
        expect(error.name).toBe('BotError');
        expect(error.isPublic).toBe(true);
    });

    it('should create a BotError instance with isPublic set to false', () => {
        const error = new BotError('Private Bot Error', false);
        expect(error.isPublic).toBe(false);
    });
});

describe('ValidationError', () => {
    it('should create a ValidationError instance', () => {
        const error = new ValidationError('Validation failed');
        expect(error).toBeInstanceOf(ValidationError);
        expect(error).toBeInstanceOf(BotError);
        expect(error.message).toBe('Validation failed');
        expect(error.name).toBe('ValidationError');
        expect(error.isPublic).toBe(true);
    });
});

describe('PermissionError', () => {
    it('should create a PermissionError instance with a default message', () => {
        const error = new PermissionError();
        expect(error).toBeInstanceOf(PermissionError);
        expect(error).toBeInstanceOf(BotError);
        expect(error.message).toBe('Você não tem permissão para usar este comando.');
        expect(error.name).toBe('PermissionError');
        expect(error.isPublic).toBe(true);
    });

    it('should create a PermissionError instance with a custom message', () => {
        const error = new PermissionError('User lacks roles');
        expect(error.message).toBe('User lacks roles');
    });
});

describe('ChannelRestrictionError', () => {
    it('should create a ChannelRestrictionError instance with a default message', () => {
        const error = new ChannelRestrictionError();
        expect(error).toBeInstanceOf(ChannelRestrictionError);
        expect(error).toBeInstanceOf(BotError);
        expect(error.message).toBe('Este comando não pode ser usado neste canal.');
        expect(error.name).toBe('ChannelRestrictionError');
        expect(error.isPublic).toBe(true);
    });

    it('should create a ChannelRestrictionError instance with a custom message', () => {
        const error = new ChannelRestrictionError('Command not allowed here');
        expect(error.message).toBe('Command not allowed here');
    });
});

describe('InternalError', () => {
    it('should create an InternalError instance with isPublic set to false', () => {
        const error = new InternalError('Internal server issue');
        expect(error).toBeInstanceOf(InternalError);
        expect(error).toBeInstanceOf(BotError);
        expect(error.message).toBe('Internal server issue');
        expect(error.name).toBe('InternalError');
        expect(error.isPublic).toBe(false);
    });

    it('should log the original error if provided', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const originalError = new Error('Original problem');
        new InternalError('Internal server issue', originalError);
        expect(consoleSpy).toHaveBeenCalledWith('[InternalError] Internal server issue', originalError);
        consoleSpy.mockRestore();
    });
});
