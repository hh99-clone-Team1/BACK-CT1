import { prisma } from '../../utils/prisma/index.js' ; // prisma 인스턴스 임포트

export const createPin = async ({ postId, userId }) => {
    const newPin = await prisma.pins.create({
        data: {
            postId: parseInt(postId),
            userId: userId.userId,
        },
    });
};
