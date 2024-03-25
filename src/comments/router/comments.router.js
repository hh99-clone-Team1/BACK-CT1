import express from 'express'; //
import authMiddleware from '../../middlewares/auth.middleware.js';

import {
    createCommentController,
    readCommentController,
    updateCommentController,
    deleteCommentController,
} from '../controller/commentController.js';

let router = express.Router();

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: 댓글 작성
 *     description: 새로운 댓글을 작성합니다.
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *             properties:
 *               postId:
 *                 type: string
 *                 description: 포스트 ID
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *     responses:
 *       201:
 *         description: 댓글이 성공적으로 작성되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 댓글이 성공적으로 작성되었습니다.
 *       400:
 *         description: 데이터 형식이 올바르지 않습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 데이터 형식이 올바르지 않습니다.
 */
// 댓글 작성
router.post('/posts/:postId/comments', authMiddleware, createCommentController);

// 댓글 조회
router.get('/posts/:postId/comments', authMiddleware, readCommentController);

// 댓글 수정
router.put('/posts/:postId/comments/:commentId', authMiddleware, updateCommentController);

// 댓글 삭제
router.delete('/posts/:postId/comments/:commentId', authMiddleware, deleteCommentController);

export default router;
