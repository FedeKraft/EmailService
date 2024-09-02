import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../repositories/userRepository';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser(email, hashedPassword);

        res.json(user);
    } catch (error) {
        res.status(500).send('Failed to register user');
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).send('Email or password is incorrect');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).send('Email or password is incorrect');
        }

        const token = jwt.sign(
            { userId: user.id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).send('Failed to login');
    }
});

export default router;
