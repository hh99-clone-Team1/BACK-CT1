import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';

import {
    createPostController,
    getAllPostsController,
    getPostsByUserIdController,
    getPostDetailController,
    searchPostsByKeywordController,
    updatePostController,
    deletePostController,
} from '../controller/postController.js';

const router = express.Router();

// 게시글 작성
router.post('/posts', authMiddleware, createPostController);

// 전체 게시글 조회
router.get('/posts', authMiddleware, getAllPostsController);

// 게시글 생성 조회
router.get('/posts/user/:userId', authMiddleware, getPostsByUserIdController);

// 게시글 상세 조회
router.get('/posts/:postId', authMiddleware, getPostDetailController);

//게시글 검색시 조회
router.get('/posts/search/:keyword', authMiddleware, searchPostsByKeywordController);

//게시글 수정
router.put('/posts/:postId', authMiddleware, updatePostController);
// 게시글 삭제
router.delete('/posts/:postId', authMiddleware, deletePostController);

export default router;

//
