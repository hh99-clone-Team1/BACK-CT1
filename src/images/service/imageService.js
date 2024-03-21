import AWS from 'aws-sdk';
import * as imageRepository from '../repository/imageRepository.js';

// AWS S3 설정
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

// s3에 이미지 업로드
export const uploadImage = async (file, userId) => {
    try {
        const params = {
            Bucket:'rosa-images-1',
            Key: `${userId}/${Date.now().toString()}-${file.originalname}`, // Include userId in the S3 Key
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read', // 이미지를 공개로 설정
        };

        const uploadedImage = await s3.upload(params).promise();
        const imageUrl = uploadedImage.Location;

        // Save image URL with userId
        const image = await saveImageUrl(imageUrl, userId);

        return { imageUrl, imageId: image.imageId }; // Return imageUrl and imageId
    } catch (error) {
        throw new Error('이미지를 업로드하는 데 실패했습니다.');
    }
};

// db에 이미지 url 저장
export const saveImageUrl = async (imageUrl, userId) => {
    try {
        const savedImage = await imageRepository.saveImageUrl(imageUrl, userId);
        return savedImage;
    } catch (error) {
        throw new Error('이미지 URL을 저장하는 데 실패했습니다.');
    }
};

// 사용자의 이미지 조회
export const getImagesByUserId = async (userId) => {
    const images = await imageRepository.getImagesByUserId(userId);
    if (images.length === 0) {
        throw new Error('사용자 Id에 해당하는 이미지가 존재하지 않습니다');
    }
    return images;
};

// 이미지 삭제
export const deleteImage = async (imageId, userId) => {
    try {
        // 이미지 업로드한 본인만 삭제 가능
        const image = await imageRepository.getImageById(imageId);
        if (image.userId !== userId) {
            throw new Error('이미지를 삭제할수 있는 권한이 없습니다');
        }

        // 이미지 삭제
        await imageRepository.deleteImageById(imageId);
    } catch (error) {
        throw new Error('이미지 삭제에 실패했습니다');
    }
};
