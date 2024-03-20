import { prisma } from '../../utils/prisma/index.js';

// 전체 게시물 등록
export const createPost = async ({ userId, title, content, link, imageId }) => {
    return await prisma.posts.create({
        data: {
            userId,
            title,
            content,
            link,
            imageId,
        },
    });
};

// 전체 게시물 조회
export const getAllPosts = async () => {
    return await prisma.posts.findMany({
        include: {
            image: {
                select: {
                    url: true,
                },
            },
        },
    });
};

// 생성자 게시물 조회
export const getPostsByUserId = async (userId) => {
    return await prisma.posts.findMany({
        where: {
            userId: userId,
        },
        include: {
            image: {
                select: {
                    url: true,
                },
            },
        },
    });
};

//게시물 상세 조회
export const getPostByPostId = async (postId) => {
    return await prisma.posts.findFirst({
        where: { postId },
        include: {
            image: {
                select: {
                    url: true,
                },
            },
        },
    });
};
//게시물 키워드 검색
export const searchPostsByKeyword = async (keyword) => {
    return await prisma.posts.findMany({
        where: {
            OR: [{ title: { contains: keyword.toLowerCase() } }, { content: { contains: keyword.toLowerCase() } }],
        },
        include: {
            image: {
                select: {
                    url: true,
                },
            },
        },
    });
};

// 게시물 수정
export const updatePost = async (postId, { title, content, link, imageId }) => {
    return await prisma.posts.update({
        where: {
            postId: postId,
        },
        data: {
            title,
            content,
            link,
            imageId,
        },
    });
};

// 게시물 삭제

export const deletePost = async (postId) => {
    return await prisma.posts.delete({
        where: { postId: postId },
    });
};

//
