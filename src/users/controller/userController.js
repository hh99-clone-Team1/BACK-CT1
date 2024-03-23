import * as UserService from '../service/userService.js';
import signUpSchema from '../../utils/joi.schemas/signupSchema.js';
import sendWelcomeEmail from '../../config/sendEmail.js';

// 회원가입
export const signUpController = async (req, res, next) => {
    try {
        const { error, value } = signUpSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details
                .map((detail) => {
                    switch (detail.path[0]) {
                        case 'email':
                            return '이메일 형식이 올바르지 않습니다.';
                        case 'password':
                            return '비밀번호 형식이 올바르지 않습니다.';
                        case 'birthDay':
                            return '생년월일 형식이 올바르지 않습니다.';
                        default:
                            return '데이터 형식이 올바르지 않습니다.';
                    }
                })
                .join('\n');

            return res.status(400).json({ message: errorMessage });
        }

        const user = await UserService.signUp(value);

        // 이메일 전송 로직
        await sendWelcomeEmail(user.email);

        res.status(201).json({ user, message: '회원가입이 완료되었습니다.' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 로그인
export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const { accessToken, refreshToken } = await UserService.login(email, password);

        // 리프레시 토큰을 쿠키에 설정
        // res.cookie('refreshToken', `Bearer ${refreshToken}`, { httpOnly: true });

        // 액세스 토큰을 body에 설정
        return res.status(200).json({
            message: '로그인에 성공하였습니다',
            accessToken: `Bearer ${accessToken}`,
            refreshToken: `Bearer ${refreshToken}`,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 리프레시토큰
export const refreshTokenController = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization) return res.status(401).json({ message: 'Refresh Token을 전달받지 못했습니다.' });

        const { accessToken, newRefreshToken } = await UserService.refreshToken(authorization);

        // 리프레시 토큰을 쿠키에 설정
        // res.cookie('refreshToken', `Bearer ${newRefreshToken}`, { httpOnly: true });

        // 액세스 토큰을 body에 설정
        return res.status(200).json({
            message: 'refresh 토큰이 재발급 되었습니다',
            accessToken: `Bearer ${accessToken}`,
            refreshToken: `Bearer ${newRefreshToken}`,
        });
    } catch (error) {
        next(error);
    }
};
