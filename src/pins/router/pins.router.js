import express from 'express';
import authmiddleware from '../../middlewares/auth.middleware.js';
import { prisma } from '../../utils/prisma/index.js';
import { createPinController } from '../controller/pinController.js';


const router = express.Router();

router.post('/pins/:postId', authmiddleware, createPinController)





  router.get('/pins', authmiddleware, async (req, res) => {
    const userId = res.locals.user; // `authMiddleware`에서 설정된 사용자 ID
  
    try {
      // Prisma를 사용하여 사용자와 연관된 핀들을 조회
      const pins = await prisma.pins.findMany({
        where: {
          userId: userId.userId,
        },
        include: {
          post: {
            include: {
              image: true // `image`는 `posts` 테이블과 연결된 `images` 테이블을 가리킵니다.
            }
          }
        },
        orderBy: {
          pinId: 'desc' // 'asc'는 오름차순을 의미합니다. 'desc'를 사용하면 내림차순이 됩니다.
        }
      });
  
      // 조회된 핀들을 반환
      res.json({ pins });
    } catch (error) {
      console.error(error);
      res.status(500).send("핀을 조회하는 동안 오류가 발생했습니다.");
    }
  });

  router.delete('/pins/:pinId', authmiddleware, async (req, res) => {
    const { pinId } = req.params; // URL에서 핀 ID 추출
    const userId = res.locals.user.userId; // `authMiddleware`에서 설정된 사용자 ID

    try {
      // 먼저, 해당 사용자가 소유한 핀인지 확인
      const pin = await prisma.pins.findUnique({
        where: {
          pinId: parseInt(pinId),
        },
      });

      // 핀이 존재하지 않거나, 현재 사용자의 것이 아닌 경우 오류 처리
      if (!pin || pin.userId !== userId) {
        return res.status(404).send("핀을 찾을 수 없거나 삭제할 권한이 없습니다.");
      }

      // Prisma를 사용하여 핀 삭제
      await prisma.pins.delete({
        where: {
          pinId: parseInt(pinId),
        },
      });

      // 성공 응답 반환
      res.send({ message: "핀이 성공적으로 삭제되었습니다." });
    } catch (error) {
      console.error(error);
      res.status(500).send("핀을 삭제하는 동안 오류가 발생했습니다.");
    }
});


export default router;
