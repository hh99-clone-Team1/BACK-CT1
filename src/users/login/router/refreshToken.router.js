import express from 'express';
import { refreshTokenController } from '../controller/refreshTokenController.js';

const router = express.Router();

// 리프레시 토큰 발급
router.post('/refresh', refreshTokenController);

export default router;
