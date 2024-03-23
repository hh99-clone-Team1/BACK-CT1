import * as LoginService from '../service/loginService.js';

export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { accessToken, refreshToken } = await LoginService.login(email, password);

        // 리프레시 토큰을 쿠키에 설정
        // res.cookie('refreshToken', `Bearer ${refreshToken}`, { httpOnly: true });
        res.header('refreshToken', `Bearer ${refreshToken}`);

        // 액세스 토큰을 body에 설정
        return res.status(200).json({
            message: '로그인에 성공하였습니다',
            accessToken: `Bearer ${accessToken}`,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
