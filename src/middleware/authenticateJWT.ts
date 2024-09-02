import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user as any;  // Necesita ser casteado correctamente dependiendo de tu tipo de usuario
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

export default authenticateJWT;
