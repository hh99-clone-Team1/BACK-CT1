import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import { prisma } from '../../utils/prisma/index.js';
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

//게시글 키워드 검색 조회
router.get('/posts/search/:keyword', authMiddleware, searchPostsByKeywordController);

//게시글 수정
router.put('/posts/:postId', authMiddleware, updatePostController);

// 게시글 삭제
router.delete('/posts/:postId', authMiddleware, deletePostController);





// 페이지 네이션
router.get('/postList/:pageId', authMiddleware, async (req, res, next) => {
    try {
      const pageId = parseInt(req.params.pageId, 10);
      if (isNaN(pageId) || pageId < 1) {
        return res.status(400).json({ error: 'Invalid page number.' });
      }
  
      // 한 페이지에 표시될 항목 수
      const pageSize = 10; 
      // 건너뛸 항목의 수를 계산
      const skip = (pageId - 1) * pageSize;
  
      // 페이지네이션 적용하여 포스트 조회
      const posts = await prisma.posts.findMany({
        skip: skip,
        take: pageSize,
        select: {
          postId: true,
          title: true,
          link: true,
          createdAt: true,
          userId: true,
          image: { select: { imageId: true, url: true } },
          user: { select: { nickname: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      next(error);
    }
  });


export default router;
