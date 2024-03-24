import express from 'express';
import logMiddleware from '../../middlewares/log.middleware.js';
import { signUpController, loginController, refreshTokenController } from '../controller/userController.js';

let router = express.Router();

// 회원가입
router.post('/signUp', logMiddleware, signUpController);

// 로그인
router.post('/login', loginController);

// 리프레시 토큰 발급
router.post('/refresh', refreshTokenController);

export default router;
