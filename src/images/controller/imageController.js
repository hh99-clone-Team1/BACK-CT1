import * as imageService from '../service/imageService.js';

// 이미지 업로드 컨트롤러
export const uploadImageController = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { imageUrl, imageId } = await imageService.uploadImage(req.file, userId);
        // const response = { url: imageUrl, userId, imageId };
        return res.status(200).json({ message: '이미지가 저장되었습니다.' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 사용자의 이미지 조회 컨트롤러
export const getImagesByUserIdcontroller = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const images = await imageService.getImagesByUserId(+userId);
        return res.status(200).json({ images });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 이미지 삭제 컨트롤러
export const deleteImageController = async (req, res, next) => {
    try {
        const { imageId } = req.params;
        const { userId } = res.locals.user;
        await imageService.deleteImage(imageId, userId);
        return res.status(200).json({ message: '이미지를 삭제하였습니다' });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
