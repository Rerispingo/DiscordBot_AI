/**
 * Classe base para erros específicos do bot.
 */
export class BotError extends Error {
    constructor(public message: string, public isPublic: boolean = true) {
        super(message);
        this.name = 'BotError';
    }
}

/**
 * Erro lançado quando argumentos de um comando são inválidos ou insuficientes.
 */
export class ValidationError extends BotError {
    constructor(message: string) {
        super(message, true);
        this.name = 'ValidationError';
    }
}

/**
 * Erro lançado quando um usuário não tem permissão para executar um comando.
 */
export class PermissionError extends BotError {
    constructor(message: string = 'Você não tem permissão para usar este comando.') {
        super(message, true);
        this.name = 'PermissionError';
    }
}

/**
 * Erro lançado quando um comando é executado em um canal não permitido.
 */
export class ChannelRestrictionError extends BotError {
    constructor(message: string = 'Este comando não pode ser usado neste canal.') {
        super(message, true);
        this.name = 'ChannelRestrictionError';
    }
}

/**
 * Erro interno genérico que não deve ser detalhado para o usuário final.
 */
export class InternalError extends BotError {
    constructor(message: string, originalError?: unknown) {
        super(message, false);
        this.name = 'InternalError';
        if (originalError) {
            console.error(`[InternalError] ${message}`, originalError);
        }
    }
}
