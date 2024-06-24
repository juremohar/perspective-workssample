import express, { Express } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import { routes as userRoutes } from './routes/user';

dotenv.config();
const app: Express = express();
app.use(cors()).use(express.json()).options('*', cors());

// All the middlewares that are generic (affect all the API routes) should be added here.
app.use('/api', userRoutes);

module.exports = app;
