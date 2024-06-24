import { PrismaClient, User } from '@prisma/client';
import { CreateUser, GetUsersParams } from '../models/user';
import { SortCriteria } from '../models/common';

const prisma = new PrismaClient();

export const insertUser = async (data: CreateUser) => {
    try {
        return await prisma.user.create({
            data: data,
        });
    } catch (error) {
        throw new Error(`Could not create user: ${error.message}`);
    }
};

export const getUsers = async (params: GetUsersParams): Promise<User[]> => {
    const orderByBuilder = getOrderBy(params.sort);

    try {
        const users = await prisma.user.findMany({
            orderBy: orderByBuilder,
        });
        return users;
    } catch (error) {
        throw new Error(`Could not get users: ${error.message}`);
    }
};

function getOrderBy(sortParam?: string): SortCriteria[] {
    if (!sortParam) {
        return [];
    }

    return sortParam.split(',').map((sortField) => {
        const order = sortField.startsWith('-') ? 'desc' : 'asc';
        const field = sortField.replace(/^[+-]/, '').trim();

        return { [field]: order };
    });
}
