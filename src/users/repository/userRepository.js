import { prisma } from '../../utils/prisma/index.js'; // prisma 인스턴스 임포트

// 이메일 중복 확인
export const findExistingUserByEmail = async (email) => {
    return await prisma.users.findFirst({ where: { email } });
};

// 회원가입
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

// 로그인
// 이메일로 사용자 찾기
export const findUserByEmail = async (email) => {
    return await prisma.users.findFirst({ where: { email } });
};

// 리프레시 토큰
// 유효한 토큰의 id로 사용자 찾기
export const findUserById = async (userId) => {
    return await prisma.users.findUnique({ where: { userId: userId } });
};
