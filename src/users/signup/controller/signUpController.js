import * as SignUpService from '../service/signUpService.js';
import signUpSchema from '../../../utils/joi.schemas/signUpSchema.js';

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
                        default:
                            return '데이터 형식이 올바르지 않습니다.';
                    }
                })
                .join('\n');

            return res.status(400).json({ message: errorMessage });
        }

        const user = await SignUpService.signUp(value);

        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        next(error);
    }
};
