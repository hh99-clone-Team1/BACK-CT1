import AWS from 'aws-sdk';
import * as imageRepository from '../repository/imageRepository.js';

// AWS S3 설정
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// s3에 이미지 업로드
export const uploadImage = async (file, userId) => {
    try {
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
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
        // 이미지를 삭제 권한 확인
        const image = await imageRepository.getImageById(imageId);
        if (image.userId !== userId) {
            throw new Error('이미지를 삭제할 수 있는 권한이 없습니다');
        }

        //S3에서도 삭제
        // 이미지 URL에서 파일 이름을 추출
        const filename = image.url.split('/').pop();

        // S3에서 이미지를 삭제하기 위한 키를 준비합니다
        const s3Key = `${userId}/${filename}`;

        // S3에서 이미지를 삭제하는 데 필요한 매개변수를 준비합니다
        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
        };

        // S3에서 이미지를 삭제합니다
        await s3.deleteObject(s3Params).promise();

        // 데이터베이스에서 이미지를 삭제합니다
        await imageRepository.deleteImageById(imageId);

        return true; // 삭제가 성공했음을 나타내기 위해 true를 반환합니다
    } catch (error) {
        console.error('이미지 삭제 중 오류:', error);
        throw new Error('이미지 삭제 실패');
    }
};
