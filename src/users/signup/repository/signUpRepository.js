import { prisma } from '../../../utils/prisma/index.js'; // prisma 인스턴스 임포트

// 이메일 중복 확인
export const findExistingUserByEmail = async (email) => {
    return await prisma.users.findFirst({ where: { email } });
};

export const signUp = async ({ email, nickname, password, birthDay }) => {
    return await prisma.users.create({
        data: {
            email,
            nickname,
            password,
            birthDay,
        },
    });
};
