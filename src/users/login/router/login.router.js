import express from 'express';
import { prisma } from '../../../utils/prisma/index.js';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const router = express.Router();

// 로그인 API
router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        }
        const user = await prisma.users.findFirst({
            where: { email },
        });
        if (!user) {
            return res.status(400).json({ message: '존재하지 않는 이메일입니다.' });
        }

        // argon2를 사용하여 비밀번호를 검증합니다.
        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) {
            return res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });
        }

        // 토큰 생성
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, nickname: user.nickname },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '38m' },
        );
        const refreshToken = jwt.sign(
            { id: user.id, email: user.email, nickname: user.nickname },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' },
        );

        // 리프레시 토큰을 쿠키에 설정
        res.cookie('refreshToken', `Bearer ${refreshToken}`, { httpOnly: true });
        // res.cookie('accessToken', `Bearer ${accessToken}`, { httpOnly: true });

        return res.status(200).json({
            message: '로그인에 성공하였습니다',
            accessToken: `Bearer ${accessToken}`,
            // refreshToken: `Bearer ${refreshToken}`,
        });
    } catch (error) {
        next(error);
    }
});

// Refresh토큰으로 AccessToken 재발급 받기 API
router.post('/refresh', async (req, res) => {
    const { authorization } = req.headers;

    if (!authorization) return res.status(401).json({ message: 'Refresh Token을 전달받지 못했습니다.' });

    // 인증 정보가 있는 경우, 리프레시 토큰을 추출
    const [bearer, refreshToken] = authorization.split('%20');
    // // 만약 토큰 타입이 Bearer가 아닐때 오류 메세지
    if (bearer !== 'Bearer') return res.status(401).json({ message: '토큰 타입이 Bearer 형식이 아닙니다' });

    // 리프레시 토큰을 확인
    let decodedRefreshToken;
    try {
        // JWT를 사용하여 서버에서 발급한 토큰이 유효한지 검증
        decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // 토큰 생성
        const accessToken = jwt.sign(
            { id: decodedRefreshToken.id, email: decodedRefreshToken.email, nickname: decodedRefreshToken },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '38m' },
        );
        const newRefreshToken = jwt.sign(
            { id: decodedRefreshToken.id, email: decodedRefreshToken.email, nickname: decodedRefreshToken },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' },
        );

        // 리프레시 토큰을 쿠키에 설정
        res.cookie('refreshToken', `Bearer ${refreshToken}`, { httpOnly: true });
        // res.cookie('accessToken', `Bearer ${accessToken}`, { httpOnly: true });

        return res.status(200).json({
            message: 'refresh 토큰이 재발급 되었습니다',
            accessToken: `Bearer ${accessToken}`,
        });
    } catch (error) {
        // 리프레시 토큰이 만료된 경우, 로그인 창으로 리다이렉트
        if (error.name === 'TokenExpiredError') {
            // return res.redirect('service.com/login'); // 나중에 frontend 주소로 변경하기
            return res.status(200).json({ message: 'refresh token이 만료되었습니다 = 성공!' });
        } else {
            throw error;
        }
    }
});

export default router;
