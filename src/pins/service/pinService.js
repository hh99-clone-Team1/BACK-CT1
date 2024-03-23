import * as PinRepository from '../repository/pinRepository.js';


export const createpin = async ({postId, userId }) => {
    return await PinRepository.createPin({ postId, userId });
}