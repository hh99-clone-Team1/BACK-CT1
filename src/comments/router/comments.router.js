import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';

import {
    createCommentController,
    readCommentController,
    updateCommentController,
    deleteCommentController,
} from '../controller/commentController.js';

let router = express.Router();

// 댓글 작성 라우터
router.post('/posts/:postId/comments', authMiddleware, createCommentController);

// 댓글 조회 라우터
router.get('/posts/:postId/comments', authMiddleware, readCommentController);

// 댓글 수정 라우터
router.put('/posts/:postId/comments/:commentId', authMiddleware, updateCommentController);

// 댓글 삭제 라우터
router.delete('/posts/:postId/comments/:commentId', authMiddleware, deleteCommentController);

export default router;
