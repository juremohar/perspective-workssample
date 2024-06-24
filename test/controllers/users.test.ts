import { Request, Response } from 'express';
import { getUsers, createUser } from '../../src/controllers/user';
import { insertUser, getUsers as fetchUsers } from '../../src/repositories/user';
import { CreateUser, GetUsersParams } from '../../src/models/user';

// This unit test is a little debatable, but I like to add it to cover the happy paths and make sure that all the required components are used.
// This could also be an integration test which would test the whole flow of a module instead of mocking certain parts.

const mockRequest = {} as Request;
const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
} as unknown as Response;

jest.mock('../../src/repositories/user', () => ({
    insertUser: jest.fn(),
    getUsers: jest.fn(),
}));

describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUsers', () => {
        test('should fetch users successfully', async () => {
            const mockUsers = [
                { id: 1, name: 'User 1' },
                { id: 2, name: 'User 2' },
            ];

            (fetchUsers as jest.Mock).mockResolvedValueOnce(mockUsers);

            await getUsers(mockRequest, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({ users: mockUsers });
        });

        test('should handle validation error', async () => {
            const queryParams: GetUsersParams = { sort: '-invalidField' };
            await getUsers({ query: queryParams } as Request, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to retrieve users' });
        });
    });

    describe('createUser', () => {
        test('should create user successfully', async () => {
            const userData: CreateUser = {
                email: 'test@example.com',
                name: 'Test User',
                countryId: 1,
            };

            (insertUser as jest.Mock).mockResolvedValueOnce({} as any);
            await createUser({ body: userData } as Request, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(201);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'User created successfully',
            });
        });

        test('should handle validation error during user creation', async () => {
            const errorMessage = '"email" must be a valid email';
            const userData: CreateUser = { email: 'invalid-email', name: '', countryId: 1 };

            await createUser({ body: userData } as Request, mockResponse);

            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({ error: errorMessage });
        });
    });
});
