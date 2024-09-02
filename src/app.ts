import express from 'express';
import userController from './controller/userController';
import emailController from './controller/emailController';

const app = express();

app.use(express.json());

app.use('/api/users', userController);
app.use('/api/emails', emailController);

export default app;
