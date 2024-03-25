import * as UserRepository from '../repository/userRepository.js';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// 회원가입
export const signUp = async ({ email, nickname, password, birthDay }) => {
    // 이메일 중복 확인
    const existingUserByEmail = await UserRepository.findExistingUserByEmail(email);
    if (existingUserByEmail) {
        const err = new Error('이미 사용중인 이메일 주소입니다.');
        err.status = 409;
        throw err;
    }

    // nickname이 제공되지 않았다면 이메일의 @ 이전 문자열을 사용
    if (!nickname) {
        nickname = email.split('@')[0];
    }

    // 아르곤2 사용해서 비밀번호 해쉬
    const hashedPassword = await argon2.hash(password); // argon2를 사용하여 비밀번호 해싱

    const user = await UserRepository.signUp({
        email,
        nickname: nickname,
        password: hashedPassword,
        birthDay: new Date(birthDay),
    });

    return user;
};

// 로그인
export const login = async (email, password) => {
    if (!email || !password) {
        const err = new Error('데이터 형식이 올바르지 않습니다.');
        err.status = 400;
        throw err;
    }
    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
        const err = new Error('존재하지 않는 이메일입니다.');
        err.status = 401;
        throw err;
    }

    // argon2를 사용하여 비밀번호를 검증
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
        const err = new Error('비밀번호가 일치하지 않습니다.');
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

// 리프레시 토큰
export const refreshToken = async (authorization) => {
    // 인증 정보가 있는 경우, 리프레시 토큰을 추출
    const [bearer, refreshToken] = authorization.split('%20');
    // 만약 토큰 타입이 Bearer가 아닐때 오류 메세지
    if (bearer !== 'Bearer') {
        const err = new Error('토큰 타입이 Bearer 형식이 아닙니다.');
        err.status = 401;
        throw err;
    }

    // JWT를 사용하여 서버에서 발급한 토큰이 유효한지 검증
    const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // 유효한 토큰의 id로 사용자 찾기
    const user = await UserRepository.findUserById(decodedRefreshToken.userId);
    if (!user) {
        const err = new Error('토큰의 사용자를 찾을 수 없습니다.');
        err.status = 404;
        throw err;
    }

    // 액세스 토큰 생성
    const accessToken = jwt.sign(
        { userId: user.id, email: user.email, nickname: user.nickname },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '38m' },
    );
    // 리프레시 토큰 생성
    const newRefreshToken = jwt.sign(
        { userId: user.id, email: user.email, nickname: user.nickname },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' },
    );

    return { accessToken, newRefreshToken };
};
