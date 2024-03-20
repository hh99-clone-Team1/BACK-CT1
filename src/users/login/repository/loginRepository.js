import { prisma } from '../../../utils/prisma/index.js'; // prisma 인스턴스 임포트

export const findUserByEmail = async (email) => {
    return await prisma.users.findFirst({ where: { email } });
};
