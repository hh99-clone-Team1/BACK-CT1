import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import multerMiddleware from '../../middlewares/multerMiddleware.js';
import {
    uploadImageController,
    getImagesByUserIdcontroller,
    deleteImageController,
} from '../controller/imageController.js';

const router = express.Router();

// 이미지 업로드
router.post('/images', authMiddleware, multerMiddleware.single('image'), uploadImageController);

// 로그인한 사용자의 이미지 조회
router.get('/images', authMiddleware, getImagesByUserIdcontroller);

// 이미지 삭제
router.delete('/images/:imageId', authMiddleware, deleteImageController);

export default router;
