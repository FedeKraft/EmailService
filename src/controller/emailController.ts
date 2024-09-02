import express, { Request, Response } from 'express';
import authenticateJWT from '../middleware/authenticateJWT';
import emailService from '../service/emailService';
import { logEmail } from '../repositories/emailRepository';
import { updateEmailsSent, findUserByEmail } from '../repositories/userRepository';

const router = express.Router();

router.post('/send-email', authenticateJWT, async (req: Request, res: Response) => {
    try {
        const { to, subject, text } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).send('Unauthorized');
        }

        const user = await findUserByEmail(req.user.email);

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.emailsSent >= 1000) {
            return res.status(429).send('Daily email limit reached');
        }

        const emailResponse = await emailService.sendEmail(to, subject, text);

        await logEmail(userId, to);
        await updateEmailsSent(userId, 1);

        res.json({ success: true, emailResponse });
    } catch (error) {
        res.status(500).send('Failed to send email');
    }
});

router.get('/stats', authenticateJWT, async (req: Request, res: Response) => {
    try {
        if (!req.user?.isAdmin) {
            return res.status(403).send('Forbidden');
        }

        const users = await prisma.user.findMany({
            where: {
                emailsSent: { gt: 0 }
            },
            select: {
                email: true,
                emailsSent: true,
            },
        });

        res.json(users);
    } catch (error) {
        res.status(500).send('Failed to retrieve stats');
    }
});

export default router;
