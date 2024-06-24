import { PrismaClient } from '@prisma/client';
import { insertUser, getUsers } from '../../src/repositories/user.repository';
import { describe, expect, test, beforeEach, afterEach } from '@jest/globals';

const prisma = new PrismaClient();
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('User Functions', () => {
    afterEach(async () => {
        await prisma.user.deleteMany({});
    });

    describe('insertUser', () => {
        test('should insert a new user', async () => {
            const userData = {
                email: 'test@example.com',
                name: 'John Doe',
                countryId: 1,
            };

            const insertedUser = await insertUser(userData);

            expect(insertedUser.email).toBe(userData.email);
            expect(insertedUser.name).toBe(userData.name);
            expect(insertedUser.countryId).toBe(userData.countryId);
        });

        test('should throw an error for duplicate user insertion', async () => {
            const userData = {
                email: 'test@example.com',
                name: 'John Doe',
                countryId: 1,
            };

            await insertUser(userData);
            await expect(insertUser(userData)).rejects.toThrowError();
        });
    });

    describe('getUsers', () => {
        beforeEach(async () => {
            const users = [
                { email: 'user1@example.com', name: 'User 1', countryId: 1 },
                { email: 'user2@example.com', name: 'User 2', countryId: 2 },
                { email: 'user3@example.com', name: 'User 3', countryId: 1 },
            ];

            for (const user of users) {
                await delay(100); // Introduce a delay of 100 milliseconds before each user creation so we can test sorting
                await prisma.user.create({
                    data: user,
                });
            }
        });

        test('should fetch users', async () => {
            const fetchedUsers = await getUsers({});

            expect(fetchedUsers).toHaveLength(3);
            expect(fetchedUsers[0].name).toBe('User 1');
            expect(fetchedUsers[1].name).toBe('User 2');
            expect(fetchedUsers[2].name).toBe('User 3');
        });

        test('should fetch users sorted by createdAt in descending order', async () => {
            const fetchedUsers = await getUsers({ sort: '-createdAt' });

            expect(fetchedUsers).toHaveLength(3);
            expect(fetchedUsers[0].name).toBe('User 3');
            expect(fetchedUsers[1].name).toBe('User 2');
            expect(fetchedUsers[2].name).toBe('User 1');
        });

        test('should fetch users sorted by createdAt in ascending order', async () => {
            const fetchedUsers = await getUsers({ sort: 'createdAt' });

            expect(fetchedUsers).toHaveLength(3);
            expect(fetchedUsers[0].name).toBe('User 1');
            expect(fetchedUsers[1].name).toBe('User 2');
            expect(fetchedUsers[2].name).toBe('User 3');
        });

        test('should throw an error for invalid sort parameter', async () => {
            const invalidSortParam = { sort: '-invalidField' };

            await expect(getUsers(invalidSortParam)).rejects.toThrowError();
        });
    });
});
