import { prisma } from '../../utils/prisma/index.js'; // prisma 인스턴스 임포트

export const createPin = async ({ postId, userId }) => {
    const newPin = await prisma.pins.create({
        data: {
            postId: parseInt(postId),
            userId: userId.userId,
        },
    });
};

export const listPins = async ({ userId }) => {
    const pins = await prisma.pins.findMany({
        where: {
            userId: +userId,
        },
        include: {
            post: {
                include: {
                    image: true,
                },
            },
        },
        orderBy: {
            pinId: 'desc',
        },
    });
    return pins;
};

export const deletePin = async ({ pinId }) => {
    const badPin = await prisma.pins.delete({
        where: {
            pinId: +pinId,
        },
    });
};
