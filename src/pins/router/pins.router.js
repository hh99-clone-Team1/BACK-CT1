import express from 'express';
import authmiddleware from '../../middlewares/auth.middleware.js';
import { prisma } from '../../utils/prisma/index.js';
import { createPinController } from '../controller/pinController.js';


const router = express.Router();

router.post('/pins/:postId', authmiddleware, createPinController)

// node js 화이팅


router.get('/pins/:userId', authmiddleware, async (req, res) => {

  const userId = req.params.userId;

  try {

    const pins = await prisma.pins.findMany({
      where: {

        userId: +userId
      },
      include: {
        post: {
          include: {
            image: true 
          }
        }
      },
      orderBy: {
        pinId: 'desc'
      }
    });


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
