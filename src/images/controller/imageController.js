import * as imageService from '../service/imageService.js';

// 이미지 업로드 컨트롤러
export const uploadImageController = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { imageUrl, imageId } = await imageService.uploadImage(req.file, userId);
        const response = { url: imageUrl, userId, imageId };
        return res.status(200).json({ message: '이미지가 등록되었습니다' });
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
        if (error.message === '사용자 Id에 해당하는 이미지가 존재하지 않습니다') {
            return res.status(404).json({ message: '사용자 Id에 해당하는 이미지가 존재하지 않습니다' });
        }
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
        if (error.message === '해당 이미지가 존재하지 않습니다') {
            return res.status(404).json({ message: '해당 이미지가 존재하지 않습니다' });
        }

        if (error.message === '이미지를 삭제할 수 있는 권한이 없습니다') {
            return res.status(404).json({ message: '이미지를 삭제할 수 있는 권한이 없습니다' });
        }
        next(error);
    }
};
