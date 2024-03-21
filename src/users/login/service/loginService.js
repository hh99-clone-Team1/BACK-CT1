import * as LoginRepository from '../repository/loginRepository.js'; //
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const login = async (email, password) => {
    if (!email || !password) {
        const err = new Error('데이터 형식이 올바르지 않습니다.');
        err.status = 400;
        throw err;
    }
    const user = await LoginRepository.findUserByEmail(email);
    if (!user) {
        const err = new Error('존재하지 않는 이메일입니다.');
        err.status = 400;
        throw err;
    }

    // argon2를 사용하여 비밀번호를 검증
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
        const err = new Error('비밀번호가 올바르지 않습니다.');
        err.status = 401;
        throw err;
    }

    // 액세스 토큰 생성
    const accessToken = jwt.sign(
        { userId: user.userId, email: user.email, nickname: user.nickname },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '38m' },
    );
    // 리프레시 토큰 생성
    const refreshToken = jwt.sign(
        { userId: user.userId, email: user.email, nickname: user.nickname },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' },
    );

    return { accessToken, refreshToken };
};
