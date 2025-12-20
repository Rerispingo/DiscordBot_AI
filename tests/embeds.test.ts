import { jest, describe, it, expect, beforeEach } from '@jest/globals';

// Mock de discord.js
jest.unstable_mockModule('discord.js', () => ({
    EmbedBuilder: jest.fn().mockImplementation(() => ({
        setTitle: jest.fn().mockReturnThis(),
        setDescription: jest.fn().mockReturnThis(),
        setColor: jest.fn().mockReturnThis(),
        setTimestamp: jest.fn().mockReturnThis(),
        setFooter: jest.fn().mockReturnThis(),
    })),
    Client: jest.fn()
}));

// Mock de config
jest.unstable_mockModule('../src/config.js', () => ({
    Config: {
        emojis: {
            bot: '🤖',
            admin: '🛡️',
            success: '✅',
            error: '❌'
        },
        colors: {
            primary: 0x000001,
            admin: 0x000002,
            success: 0x000003,
            error: 0x000004
        }
    }
}));

const { EmbedBuilder } = await import('discord.js');
const { Embeds } = await import('../src/utils/embeds.js');

describe('Embeds', () => {
    let mockClient: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockClient = {
            user: {
                username: 'TestBot',
                displayAvatarURL: jest.fn().mockReturnValue('http://avatar.url')
            }
        };
    });

    it('should create an info embed with custom emoji', () => {
        const title = 'Test Title';
        const description = 'Test Description';
        const emoji = '🔥';

        Embeds.info(mockClient, title, description, emoji);

        const embedInstance = (EmbedBuilder as any).mock.results[0].value;
        expect(embedInstance.setTitle).toHaveBeenCalledWith(`${emoji} ${title}`);
        expect(embedInstance.setDescription).toHaveBeenCalledWith(description);
    });

    it('should create an info embed with default emoji if none provided', () => {
        const title = 'Test Title';
        const description = 'Test Description';

        Embeds.info(mockClient, title, description);

        const embedInstance = (EmbedBuilder as any).mock.results[0].value;
        expect(embedInstance.setTitle).toHaveBeenCalledWith(`🤖 ${title}`);
    });

    it('should create an admin embed', () => {
        Embeds.admin(mockClient, 'Admin Title', 'Admin Desc');
        const embedInstance = (EmbedBuilder as any).mock.results[0].value;
        expect(embedInstance.setTitle).toHaveBeenCalledWith(`🛡️ Admin Title`);
    });

    it('should create a success embed', () => {
        Embeds.success(mockClient, 'Success Desc');
        const embedInstance = (EmbedBuilder as any).mock.results[0].value;
        expect(embedInstance.setTitle).toHaveBeenCalledWith(`✅ Sucesso`);
    });

    it('should create an error embed', () => {
        Embeds.error(mockClient, 'Error Desc');
        const embedInstance = (EmbedBuilder as any).mock.results[0].value;
        expect(embedInstance.setTitle).toHaveBeenCalledWith(`❌ Erro`);
    });
});