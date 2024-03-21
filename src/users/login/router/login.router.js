import express from 'express';

import { loginController } from '../controller/loginController.js';

const router = express.Router();

// 로그인
router.post('/login', loginController);

export default router;
