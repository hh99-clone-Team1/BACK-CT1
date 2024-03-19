import express from 'express';
import { prisma } from '../../../utils/prisma/index.js';
import signUpSchema from '../../../utils/joi.schemas/signupSchema.js';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const router = express.Router();

// 회원가입 API
router.post('/signup', async (req, res, next) => {
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

    const { email, nickname, password, birthDay } = value;

    // 이메일 중복 확인
    const existingUserByEmail = await prisma.users.findFirst({
        where: {
            email: email,
        },
    });

    if (existingUserByEmail) {
        return res.status(409).json({ message: '이미 사용중인 이메일 주소입니다.' });
    }
    // 아르곤2 사용해서 비밀번호 해쉬
    const hashedPassword = await argon2.hash(password); // argon2를 사용하여 비밀번호 해싱
    const user = await prisma.users.create({
        data: {
            email,
            nickname,
            password: hashedPassword,
            birthDay: birthDay,
        },
    });

    return res.status(201).json({ user });
});

export default router;
