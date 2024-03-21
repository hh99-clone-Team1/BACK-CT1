import * as SingUpRepository from '../repository/signUpRepository.js';
import * as argon2 from 'argon2';

export const signUp = async ({ email, nickname, password, birthDay }) => {
    // 이메일 중복 확인
    const existingUserByEmail = await SingUpRepository.findExistingUserByEmail(email);
    if (existingUserByEmail) {
        const err = new Error('이미 사용중인 이메일 주소입니다.');
        err.status = 401;
        throw err;
    }

    // nickname이 제공되지 않았다면 이메일의 @ 이전 문자열을 사용
    if (!nickname) {
        nickname = email.split('@')[0];
    }

    // 아르곤2 사용해서 비밀번호 해쉬
    const hashedPassword = await argon2.hash(password); // argon2를 사용하여 비밀번호 해싱
    const user = await SingUpRepository.signUp({
        email,
        nickname : nickname,
        password: hashedPassword,
        birthDay,
    });

    return user;
};
