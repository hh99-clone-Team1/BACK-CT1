import { prisma } from '../../utils/prisma/index.js';

// db에 이미지 url 저장
export const saveImageUrl = async (imageUrl, userId) => {
    try {
        const savedImage = await prisma.images.create({
            data: {
                url: imageUrl,
                userId: userId,
            },
            include: {
                user: {
                    select: {
                        userId: true,
                    },
                },
            },
        });
        return savedImage;
    } catch (error) {
        throw new Error('이미지 URL을 저장하는 데 실패했습니다.');
    }
};

// 사용자Id로 전체 이미지 조회
export const getImagesByUserId = async (userId) => {
    return await prisma.images.findMany({
        where: { userId: userId },
    });
};

// imageId로 이미지조회
export const getImageById = async (imageId) => {
    return await prisma.images.findUnique({
        where: { imageId: parseInt(imageId) },
    });
};

// imageId로 이미지 삭제
export const deleteImageById = async (imageId) => {
    try {
        await prisma.images.delete({
            where: { imageId: parseInt(imageId) },
        });
        return true; // 삭제 성공
    } catch (error) {
        console.error('이미지 삭제 중 오류:', error);
        throw new Error('이미지 삭제 실패');
    }
};
