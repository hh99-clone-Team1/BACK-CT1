import * as LikeService from '../service/likeService.js';

export const likeController = async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = res.locals.user.userId;

        if (!postId || !userId) {
            const err = new Error('데이터 형식이 올바르지 않습니다.');
            err.status = 400;
            throw err;
        }

        const { message, likeCount } = await LikeService.like({ postId, userId });

        return res.status(201).json({ message, likeCount });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
