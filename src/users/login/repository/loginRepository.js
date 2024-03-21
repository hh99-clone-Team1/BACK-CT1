import { prisma } from '../../../utils/prisma/index.js'; // prisma 인스턴스 임포트 //

// 이메일로 사용자 찾기
export const findUserByEmail = async (email) => {
    return await prisma.users.findFirst({ where: { email } });
};
