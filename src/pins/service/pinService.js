import * as PinRepository from '../repository/pinRepository.js';


export const createpin = async ({postId, userId }) => {
    return PinRepository.createPin({ postId, userId });
}



export const listPins = async ({userId}) => {
    return PinRepository.listPins({userId});
}


export const deletePin = async ({pinId}) =>{
    return PinRepository.deletePin({pinId});
}