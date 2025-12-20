import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { ActivityType } from 'discord.js';
import type { StatusManager as StatusManagerType } from '../src/statusManager.js';

// Mock de fs/promises
jest.unstable_mockModule('fs/promises', () => ({
    readFile: jest.fn(),
    writeFile: jest.fn(),
}));

// Mock de fs
jest.unstable_mockModule('fs', () => ({
    existsSync: jest.fn(),
}));

// Mock de config
jest.unstable_mockModule('../src/config.js', () => ({
    Config: {
        paths: {
            status: 'mock-status-path'
        }
    }
}));

const { readFile, writeFile } = await import('fs/promises');
const { existsSync } = await import('fs');
const { StatusManager } = await import('../src/statusManager.js') as { StatusManager: typeof StatusManagerType };

const mockedReadFile = readFile as jest.MockedFunction<typeof readFile>;
const mockedWriteFile = writeFile as jest.MockedFunction<typeof writeFile>;
const mockedExistsSync = existsSync as jest.MockedFunction<typeof existsSync>;

describe('StatusManager', () => {
    const mockStatus = {
        type: ActivityType.Watching,
        text: 'Test Status'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('load', () => {
        it('should load status from file if it exists', async () => {
            mockedExistsSync.mockReturnValue(true);
            mockedReadFile.mockResolvedValue(JSON.stringify(mockStatus));

            const result = await StatusManager.load();
            expect(result).toEqual(mockStatus);
        });

        it('should return default status if file does not exist', async () => {
            mockedExistsSync.mockReturnValue(false);

            const result = await StatusManager.load();
            expect(result.text).toBe('DiscordBot_AI | ./ajuda');
            expect(result.type).toBe(ActivityType.Playing);
        });
    });

    describe('setType', () => {
        it('should update the status type', async () => {
            mockedExistsSync.mockReturnValue(true);
            mockedReadFile.mockResolvedValue(JSON.stringify(mockStatus));
            mockedWriteFile.mockResolvedValue(undefined);

            await StatusManager.setType(ActivityType.Listening);
            
            expect(mockedWriteFile).toHaveBeenCalled();
            const lastCall = mockedWriteFile.mock.calls[0];
            const savedData = JSON.parse(lastCall![1] as string);
            expect(savedData.type).toBe(ActivityType.Listening);
            expect(savedData.text).toBe(mockStatus.text);
        });
    });

    describe('setText', () => {
        it('should update the status text', async () => {
            mockedExistsSync.mockReturnValue(true);
            mockedReadFile.mockResolvedValue(JSON.stringify(mockStatus));
            mockedWriteFile.mockResolvedValue(undefined);

            const newText = 'New status text';
            await StatusManager.setText(newText);
            
            expect(mockedWriteFile).toHaveBeenCalled();
            const lastCall = mockedWriteFile.mock.calls[0];
            const savedData = JSON.parse(lastCall![1] as string);
            expect(savedData.text).toBe(newText);
            expect(savedData.type).toBe(mockStatus.type);
        });
    });
});
