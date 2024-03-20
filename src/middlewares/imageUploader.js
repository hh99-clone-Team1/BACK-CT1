import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import paht from'path';

AWS.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3()

const allowedExtension = ['.png','.jpg','.jpeg','.bmp']

const imageUploader = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'rosa-images-1',
        key: (req, file, callback) => {
            const uploadDirectory = req.query.directory ?? ''
            const extension = paht.extname(file.originalname)
            if (!allowedExtension.includes(extension)) {
                return callback(new Error('파일의 확장자명이 틀렸습니다.'))
            }
            callback(null, `${uploadDirectory}/${Date.now()}_${file.originalname}`)
        },
        acl: 'public-read-write'
    }),
})

export default imageUploader