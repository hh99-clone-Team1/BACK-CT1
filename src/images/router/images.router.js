import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { createImageController } from '../controller/imageController.js';

const router = express.Router();

//  이미지 등록 API
router.post('/images', authMiddleware, createImageController);

export default router;
