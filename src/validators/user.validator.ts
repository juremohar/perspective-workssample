import Joi from 'joi';
import { PrismaClient } from '@prisma/client';
import { CreateUser } from '../models/user';

const prisma = new PrismaClient();

const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().allow('').required(),
    countryId: Joi.number().integer().required(),
});

const getUsersSchema = Joi.object({
    sort: Joi.string().valid('createdAt', '-createdAt').optional(),
});

export const validateUserCreation = async (data: CreateUser) => {
    await createUserSchema.validateAsync(data);

    await prisma.country.findUniqueOrThrow({
        where: {
            id: data.countryId,
        },
    });
};

export const validateGetUsers = async (data: object) => {
    await getUsersSchema.validateAsync(data);
};
