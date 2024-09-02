import prisma from '../prisma/client';

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: { email },
    });
};

export const createUser = async (email: string, hashedPassword: string) => {
    return prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });
};

export const updateEmailsSent = async (userId: number, incrementBy: number) => {
    return prisma.user.update({
        where: { id: userId },
        data: { emailsSent: { increment: incrementBy } },
    });
};
