import { jest, describe, it, expect, beforeEach } from '@jest/globals';
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
            managers: 'mock-path'
        }
    }
}));
const { readFile, writeFile } = await import('fs/promises');
const { existsSync } = await import('fs');
const { ManagerSystem } = await import('../src/managers.js');
const mockedReadFile = readFile;
const mockedWriteFile = writeFile;
const mockedExistsSync = existsSync;
describe('ManagerSystem', () => {
    const mockGuildId = '123456789';
    const mockUserId = '987654321';
    const mockData = {
        [mockGuildId]: [mockUserId]
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('isManager', () => {
        it('should return true if user is a manager', async () => {
            mockedExistsSync.mockReturnValue(true);
            mockedReadFile.mockResolvedValue(JSON.stringify(mockData));
            const result = await ManagerSystem.isManager(mockGuildId, mockUserId);
            expect(result).toBe(true);
        });
        it('should return false if user is not a manager', async () => {
            mockedExistsSync.mockReturnValue(true);
            mockedReadFile.mockResolvedValue(JSON.stringify(mockData));
            const result = await ManagerSystem.isManager(mockGuildId, 'other-user');
            expect(result).toBe(false);
        });
        it('should return false if file does not exist', async () => {
            mockedExistsSync.mockReturnValue(false);
            const result = await ManagerSystem.isManager(mockGuildId, mockUserId);
            expect(result).toBe(false);
        });
    });
    describe('addManager', () => {
        it('should add a manager if not already present', async () => {
            mockedExistsSync.mockReturnValue(true);
            mockedReadFile.mockResolvedValue(JSON.stringify({}));
            mockedWriteFile.mockResolvedValue(undefined);
            const result = await ManagerSystem.addManager(mockGuildId, mockUserId);
            expect(result).toBe(true);
            expect(mockedWriteFile).toHaveBeenCalled();
        });
        it('should not add a manager if already present', async () => {
            mockedExistsSync.mockReturnValue(true);
            mockedReadFile.mockResolvedValue(JSON.stringify(mockData));
            const result = await ManagerSystem.addManager(mockGuildId, mockUserId);
            expect(result).toBe(false);
            expect(mockedWriteFile).not.toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=managers.test.js.map