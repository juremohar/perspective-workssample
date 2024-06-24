import { PrismaClient, Country } from '@prisma/client';
import { validateUserCreation, validateGetUsers } from '../../src/validators/user';
import { CreateUser } from '../../src/models/user';
import { describe, expect, test, jest, beforeEach, beforeAll } from '@jest/globals';

jest.mock('@prisma/client', () => {
    const mockCountry: Country = { id: 1, code: 'SI', name: 'Slovenia' };

    return {
        PrismaClient: jest.fn(() => ({
            country: {
                findUniqueOrThrow: jest.fn((args: { where: { id: number } }) => {
                    const { where } = args;
                    if (where?.id === 1) {
                        return mockCountry;
                    } else {
                        throw new Error('Country not found');
                    }
                }),
            },
        })),
    };
});

describe('User Validations', () => {
    let prisma: PrismaClient;

    beforeAll(() => {
        prisma = new PrismaClient();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('validateGetUsers', () => {
        test('should validate sort parameter with descending order successfully', async () => {
            const validData = { sort: '-createdAt' };
            await expect(validateGetUsers(validData)).resolves.toBeUndefined();
        });

        test('should validate sort parameter with ascending order successfully', async () => {
            const validData = { sort: 'createdAt' };
            await expect(validateGetUsers(validData)).resolves.toBeUndefined();
        });

        test('should throw an error for invalid sort parameter', async () => {
            const invalidData = { sort: '-invalid' };
            await expect(validateGetUsers(invalidData)).rejects.toThrowError();
        });

        test('should not throw an error if sort parameter is missing', async () => {
            const validData = {};
            await expect(validateGetUsers(validData)).resolves.toBeUndefined();
        });
    });

    describe('validateUserCreation', () => {
        test('should validate user creation data successfully', async () => {
            const validData: CreateUser = {
                email: 'test@example.com',
                name: 'John Doe',
                countryId: 1,
            };

            await expect(validateUserCreation(validData)).resolves.toBeUndefined();
        });

        test('should throw an error if countryId does not exist', async () => {
            const invalidData: CreateUser = {
                email: 'test@example.com',
                name: 'John Doe',
                countryId: 999,
            };

            await expect(validateUserCreation(invalidData)).rejects.toThrowError(
                'Country not found',
            );
        });

        test('should throw an error if data is invalid', async () => {
            const invalidData: CreateUser = {
                email: 'invalid-email',
                name: '',
                countryId: 999,
            };

            await expect(validateUserCreation(invalidData)).rejects.toThrowError();
        });
    });
});
