import express from 'express';
import authmiddleware from '../../middlewares/auth.middleware.js';
import { prisma } from '../../utils/prisma/index.js';

const router = express.Router();

router.post('/pins/:postId', authmiddleware, async (req, res) => {
    const { postId } = req.params;
    const userId = res.locals.user;
  
    try {
      const newPin = await prisma.pins.create({
        data: {
          postId: parseInt(postId),
          userId: userId.userId,
        },
      });
  
      res.status(200).json(newPin);
    } catch (error) {
      console.error(error);
      res.status(500).send("핀 생성 중 오류가 발생했습니다.");
    }
  });





  router.get('/pins', authmiddleware, async (req, res) => {
    const userId = res.locals.user; // `authMiddleware`에서 설정된 사용자 ID
  
    try {
      // Prisma를 사용하여 사용자와 연관된 핀들을 조회
      const pins = await prisma.pins.findMany({
        where: {
          userId: userId.userId,
        },
      });
  
      // 조회된 핀들을 반환
      res.json({ pins });
    } catch (error) {
      console.error(error);
      res.status(500).send("핀을 조회하는 동안 오류가 발생했습니다.");
    }
  });
export default router;
