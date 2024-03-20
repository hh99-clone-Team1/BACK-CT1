import * as RefreshTokenRepository from '../repository/refreshTokenRepository.js';
import jwt from 'jsonwebtoken';

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
    const user = await RefreshTokenRepository.findUserById(decodedRefreshToken.userId);
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
