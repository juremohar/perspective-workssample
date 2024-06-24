import express from 'express';

import { createUser, getUsers } from '../controllers/user';
export const routes = express.Router();

// If any special middlewares (authorization, rate limiter, permissions, ...) need to be added, they can be added here.
routes.post('/users', createUser);
routes.get('/users', getUsers);
