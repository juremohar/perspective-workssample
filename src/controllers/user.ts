import { Request, Response } from 'express';
import { validateUserCreation, validateGetUsers } from '../validators/user';
import { CreateUser, GetUsersParams } from '../models/user';
import { insertUser, getUsers as fetchUsers } from '../repositories/user';

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    // Depending on the use case we could add some caching here (eg. Redis)
    try {
        const queryParams: GetUsersParams = req.query;
        await validateGetUsers(queryParams);
        const users = await fetchUsers(queryParams);
        return res.status(200).json({ users });
    } catch (error) {
        // We could add some external log of the error here, so we could solve it easier later on:
        // eg. Grafana for dashboard, Sentry/Sumologic for log collections
        return res.status(400).json({ error: 'Failed to retrieve users' });
    }
};

export const createUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const data: CreateUser = req.body;
        await validateUserCreation(data);
        await insertUser(data);

        // Depending on the use case, we could have a helper class that would be handling all our responses.
        // This way we would get some unity for all the controllers.
        // eg. ResponseFactory.created(msg)
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        // The better way here would be to register middleware that can handle different errors and return the appropriate response.
        // For example, if a user is not authenticated correctly, we could throw an AuthorizationException, and the middleware would catch it and return a 401 status code.
        return res.status(400).json({ error: error.message });
    }
};
