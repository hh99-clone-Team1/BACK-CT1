import * as PinService from '../service/pinService.js';
import { prisma } from '../../utils/prisma/index.js' ; // prisma 인스턴스 임포트

export const createPinController = async (req, res, next) => {
    try {
        const userId = res.locals.user;
        const { postId } = req.params;

        const pin = await PinService.createpin({ userId, postId });
        res.status(200).json({ Message: '핀이 생성되엇습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('핀 생성 중 오류가 발생했습니다.');
    }
};

export const listPinsController = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const pinList = await PinService.listPins({ userId });

        res.status(200).json(pinList);
    } catch (error) {
        console.error(error);
        res.status(500).send('핀을 조회하는 동안 오류가 발생했습니다.');
    }
};

export const deletePinController = async (req, res, next) => {
    const { pinId } = req.params; // URL에서 핀 ID 추출
    const userId = res.locals.user.userId; // `authMiddleware`에서 설정된 사용자 ID

    try {
        // 먼저, 해당 사용자가 소유한 핀인지 확인
        const pin = await prisma.pins.findUnique({
            where: {
                pinId: +pinId,
            },
        });

        // 핀이 존재하지 않거나, 현재 사용자의 것이 아닌 경우 오류 처리
        if (!pin || pin.userId !== userId) {
            return res.status(404).send('핀을 찾을 수 없거나 삭제할 권한이 없습니다.');
        }

        const deletePin = await PinService.deletePin({pinId})
            // 성공 응답 반환
            res.send({ message: '핀이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).send('핀을 삭제하는 동안 오류가 발생했습니다.');
    }
};
