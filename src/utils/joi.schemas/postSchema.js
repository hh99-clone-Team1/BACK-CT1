import Joi from 'joi';

const postSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string(),
    link: Joi.string(),
    imageId: Joi.number().required(),
});

export default postSchema;
