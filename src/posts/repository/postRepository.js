import { prisma } from '../../utils/prisma/index.js';

// 전체 게시물 등록
export const createPost = async ({ userId, title, content, link }) => {
    return await prisma.posts.create({
        data: {
            userId,
            title,
            content,
            link,
        },
    });
};

// 전체 게시물 조회
export const getAllPosts = async () => {
    return await prisma.posts.findMany();
};

// 생성자 게시물 조회
export const getPostsByUserId = async (userId) => {
    return await prisma.posts.findMany({
        where: {
            userId: userId,
        },
    });
};

//게시물 상세 조회
export const getPostByPostId = async (postId) => {
    return await prisma.posts.findFirst({
        where: { postId },
    });
};

//게시물 키워드 검색
export const searchPostsByKeyword = async (keyword) => {
    return await prisma.posts.findMany({
        where: {
            OR: [{ title: { contains: keyword.toLowerCase() } }, { content: { contains: keyword.toLowerCase() } }],
        },
    });
};

// 게시물 수정
export const updatePost = async (postId, { title, content, link }) => {
    return await prisma.posts.update({
        where: {
            postId: postId,
        },
        data: {
            title,
            content,
            link,
        },
    });
};

// 게시물 삭제

export const deletePost = async (postId) => {
    return await prisma.posts.delete({
        where: { postId: postId },
    });
};
