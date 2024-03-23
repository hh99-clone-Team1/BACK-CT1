import * as PinService from '../service/pinService.js';

export const createPinController = async (req, res, nex) => {
    try {
        const userId = res.locals.user;
        const { postId } = req.params;

        const pin = await PinService.createpin({userId,postId})
        res.status(200).json({Message: '핀이 생성되엇습니다.'});
    } catch (error) {
        console.error(error);
        res.status(500).send("핀 생성 중 오류가 발생했습니다.");
      }
};
