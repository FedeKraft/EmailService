import prisma from '../prisma/client';

export const logEmail = async (userId: number, email: string) => {
    return prisma.emailLog.create({
        data: {
            userId,
            email,
        },
    });
};
