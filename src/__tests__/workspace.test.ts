import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Guild, Collection, ChannelType } from 'discord.js';
import { findWorkspaceModerationLogChannel, findWorkspaceMessageLogChannel, loadWorkspaceConfig } from '../workspace.js';

// Mock do fs/promises e fs
vi.mock('fs/promises', () => ({
    readFile: vi.fn().mockResolvedValue(JSON.stringify({
        category: { name: 'S.P.E.C.T.R.A.A. Workspace' },
        channels: [
            { name: 'moderation-log', type: 'text' },
            { name: 'message-log', type: 'text' },
            { name: 'debugs', type: 'text' }
        ]
    }))
}));

vi.mock('fs', () => ({
    existsSync: vi.fn().mockReturnValue(true)
}));

describe('Workspace Utils', () => {
    let mockGuild: any;

    beforeEach(() => {
        vi.clearAllMocks();
        
        const channels = new Collection<string, any>();
        
        // Mock da categoria
        channels.set('cat-id', {
            id: 'cat-id',
            name: 'S.P.E.C.T.R.A.A. Workspace',
            type: ChannelType.GuildCategory
        });

        // Mock dos canais
        channels.set('mod-log-id', {
            id: 'mod-log-id',
            name: 'moderation-log',
            type: ChannelType.GuildText,
            parentId: 'cat-id'
        });

        channels.set('msg-log-id', {
            id: 'msg-log-id',
            name: 'message-log',
            type: ChannelType.GuildText,
            parentId: 'cat-id'
        });

        mockGuild = {
            channels: {
                cache: channels
            }
        };
    });

    it('deve encontrar o canal de moderation-log', async () => {
        const channel = await findWorkspaceModerationLogChannel(mockGuild as Guild);
        expect(channel).toBeDefined();
        expect(channel?.name).toBe('moderation-log');
        expect(channel?.id).toBe('mod-log-id');
    });

    it('deve encontrar o canal de message-log', async () => {
        const channel = await findWorkspaceMessageLogChannel(mockGuild as Guild);
        expect(channel).toBeDefined();
        expect(channel?.name).toBe('message-log');
        expect(channel?.id).toBe('msg-log-id');
    });

    it('deve retornar null se o canal não existir no cache', async () => {
        mockGuild.channels.cache.delete('mod-log-id');
        const channel = await findWorkspaceModerationLogChannel(mockGuild as Guild);
        expect(channel).toBeNull();
    });

    it('deve retornar null se a categoria não existir', async () => {
        mockGuild.channels.cache.delete('cat-id');
        const channel = await findWorkspaceModerationLogChannel(mockGuild as Guild);
        expect(channel).toBeNull();
    });
});
