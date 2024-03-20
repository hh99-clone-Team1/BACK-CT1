import { prisma } from '../../../utils/prisma/index.js'; // prisma 인스턴스 임포트

// id(PK)로 사용자 찾기
export const findUserById = async (userId) => {
    return await prisma.users.findUnique({ where: { userId: userId } });
};
