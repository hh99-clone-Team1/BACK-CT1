import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { createPinController, listPinsController, deletePinController } from '../controller/pinController.js';

// node js 화이팅

const router = express.Router();

// 핀생성 API
router.post('/pins/:postId', authMiddleware, createPinController);

// 핀조회 API
router.get('/pins/:userId', authMiddleware, listPinsController);

// 핀삭제 API
router.delete('/pins/:pinId', authMiddleware, deletePinController);

export default router;
