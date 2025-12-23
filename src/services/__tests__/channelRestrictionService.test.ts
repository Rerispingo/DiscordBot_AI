import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Message, TextChannel, Guild, Collection } from 'discord.js';
import { ChannelRestrictionService } from '../channelRestrictionService.js';

describe('ChannelRestrictionService', () => {
    let mockMessage: Partial<Message>;
    let mockLogsChannel: Partial<TextChannel>;
    let mockGuild: Partial<Guild>;

    beforeEach(() => {
        mockLogsChannel = {
            id: 'logs-channel-id',
            send: vi.fn().mockResolvedValue({
                delete: vi.fn(() => Promise.resolve()),
                id: 'warning-message-id',
                channel: mockLogsChannel as TextChannel,
                author: { id: 'bot-id' } as any,
                guild: mockGuild as Guild,
                // Propriedades mínimas para Message
                content: '', client: {} as any, createdAt: new Date(), createdTimestamp: Date.now(),
                type: 0, system: false, pinned: false, partial: false, member: {} as any,
                mentions: {} as any, url: '', webhookId: null, cleanContent: '', editable: false,
                pinnable: false, tts: false, embeds: [], attachments: new Collection(),
                stickers: new Collection(), editedTimestamp: null, reactions: {} as any,
                groupActivityApplication: null, applicationId: null, activity: null,
                flags: {} as any, reference: null, interaction: null, components: [],
                crosspostable: false, hasThread: false, thread: null, guildId: 'guild-id',
                channelId: 'logs-channel-id',
            } as Message)
        };
        mockGuild = {
            id: 'guild-id'
        } as Guild;
        mockMessage = {
            guild: mockGuild as Guild,
            channel: { id: 'other-channel-id' } as TextChannel,
            author: { id: 'user-id' } as any,
            deletable: true,
            delete: vi.fn(() => Promise.resolve()),
            id: 'message-id',
            content: 'test',
            client: {} as any,
            createdAt: new Date(),
            createdTimestamp: Date.now(),
            type: 0,
            system: false,
            pinned: false,
            partial: false,
            member: {} as any,
            mentions: {} as any,
            url: 'http://example.com',
            webhookId: null,
            cleanContent: 'test',
            editable: false,
            pinnable: false,
            tts: false,
            embeds: [],
            attachments: new Collection(),
            stickers: new Collection(),
            editedTimestamp: null,
            reactions: {} as any,
            groupActivityApplication: null,
            applicationId: null,
            activity: null,
            flags: {} as any,
            reference: null,
            interaction: null,
            components: [],
            crosspostable: false,
            hasThread: false,
            thread: null,
            guildId: 'guild-id',
            channelId: 'other-channel-id',
        } as Message;
    });

    it('should return false if not in a guild', async () => {
        const messageWithoutGuild: Partial<Message> = {
            channel: { id: 'other-channel-id' } as TextChannel,
            author: { id: 'user-id' } as any,
            deletable: true,
            delete: vi.fn(() => Promise.resolve()),
            id: 'message-id',
            content: 'test',
            client: {} as any,
            createdAt: new Date(),
            createdTimestamp: Date.now(),
            type: 0,
            system: false,
            pinned: false,
            partial: false,
            member: {} as any,
            mentions: {} as any,
            url: 'http://example.com',
            webhookId: null,
            cleanContent: 'test',
            editable: false,
            pinnable: false,
            tts: false,
            embeds: [],
            attachments: new Collection(),
            stickers: new Collection(),
            editedTimestamp: null,
            reactions: {} as any,
            groupActivityApplication: null,
            applicationId: null,
            activity: null,
            flags: {} as any,
            reference: null,
            interaction: null,
            components: [],
            crosspostable: false,
            hasThread: false,
            thread: null,
            guildId: null,
            channelId: 'other-channel-id',
        } as Message;
        const result = await ChannelRestrictionService.handleLogChannelRestriction(
            messageWithoutGuild as Message,
            async () => null
        );
        expect(result).toBe(false);
    });

    it('should return false if logs channel is not found', async () => {
        const result = await ChannelRestrictionService.handleLogChannelRestriction(
            mockMessage as Message,
            async () => null
        );
        expect(result).toBe(false);
    });

    it('should return false if message is not in logs channel', async () => {
        const result = await ChannelRestrictionService.handleLogChannelRestriction(
            mockMessage as Message,
            async () => mockLogsChannel as TextChannel
        );
        expect(result).toBe(false);
    });

    it('should return true, delete message and send warning if in logs channel', async () => {
        mockMessage.channel!.id = 'logs-channel-id';
        const findLogsChannel = vi.fn<() => Promise<TextChannel | null>>().mockResolvedValue(mockLogsChannel as TextChannel);
        
        // Use fake timers for the setTimeout
        vi.useFakeTimers();

        const result = await ChannelRestrictionService.handleLogChannelRestriction(
            mockMessage as Message,
            findLogsChannel as any
        );

        expect(result).toBe(true);
        expect(mockMessage.delete).toHaveBeenCalled();
        expect(mockLogsChannel.send).toHaveBeenCalledWith(expect.objectContaining({
            content: expect.stringContaining('<@user-id>')
        }));

        // Advance timers to check if warning is deleted
        const warning = await (mockLogsChannel.send as any).mock.results[0].value as Message;
        vi.runAllTimers();
        
        expect(warning.delete).toHaveBeenCalled();
        
        vi.useRealTimers();
    });
});
