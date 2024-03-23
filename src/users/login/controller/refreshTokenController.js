import * as RefreshTokenService from '../service/refreshTokenService.js';

export const refreshTokenController = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) return res.status(401).json({ message: 'Refresh Token을 전달받지 못했습니다.' });

        const { accessToken, newRefreshToken } = await RefreshTokenService.refreshToken(authorization);

        // 리프레시 토큰을 쿠키에 설정
        // res.cookie('refreshToken', `Bearer ${newRefreshToken}`, { httpOnly: true });
        // 리프레시 토큰을 헤더에 설정
        res.header('refreshToken', `Bearer ${newRefreshToken}`);

        // 액세스 토큰을 body에 설정
        return res.status(200).json({
            message: 'refresh 토큰이 재발급 되었습니다',
            accessToken: `Bearer ${accessToken}`,
        });
    } catch (error) {
        next(error);
    }
};
