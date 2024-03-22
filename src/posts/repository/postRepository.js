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
    const posts = await prisma.posts.findMany({
        select: {
            postId: true,
            title: true,
            link: true,
            createdAt: true,
            userId: true,
            image: { select: { imageId: true, url: true } },
            user: { select: { nickname: true } },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // 각 게시물 객체에 사용자의 닉네임,imageId, url 추가
    if (posts) {
        posts.forEach((post) => {
            post.nickname = post.user.nickname;
            delete post.user;
            post.imageId = post.image.imageId;
            post.url = post.image.url;
            delete post.image;
        });
    }

    return posts;
};

// 생성자 게시물 조회
export const getPostsByUserId = async (userId) => {
    const posts = await prisma.posts.findMany({
        where: {
            userId: userId,
        },
        select: {
            postId: true,
            title: true,
            content: true,
            link: true,
            createdAt: true,
            userId: true,
            user: { select: { nickname: true } },
            image: { select: { imageId: true, url: true } },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (posts) {
        posts.forEach((post) => {
            post.nickname = post.user.nickname;
            delete post.user;
            post.url = post.image.url;
            post.imageId = post.image.imageId;

            delete post.image;
        });
    }

    return posts;
};

//게시물 상세 조회
export const getPostByPostId = async (postId) => {
    const post = await prisma.posts.findFirst({
        where: { postId },
        select: {
            postId: true,
            title: true,
            content: true,
            link: true,
            createdAt: true,
            userId: true,
            user: { select: { nickname: true } },
            image: { select: { imageId: true, url: true } },
        },
    });

    if (post) {
        post.nickname = post.user.nickname;
        delete post.user;
        post.url = post.image.url;
        post.imageId = post.image.imageId;
        delete post.image;
    }

    return post;
};

//게시물 키워드 검색
export const searchPostsByKeyword = async (keyword) => {
    const posts = await prisma.posts.findMany({
        where: {
            OR: [{ title: { contains: keyword.toLowerCase() } }, { content: { contains: keyword.toLowerCase() } }],
        },
        select: {
            postId: true,
            title: true,
            link: true,
            createdAt: true,
            userId: true,
            image: { select: { imageId: true, url: true } },
            user: { select: { nickname: true } },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (posts) {
        posts.forEach((post) => {
            post.nickname = post.user.nickname;
            delete post.user;

            post.url = post.image.url;
            post.url = post.image.url;
            delete post.image;
        });
    }

    return posts;
};

// 게시물 수정
export const updatePost = async (postId, { title, content, link, imageId }) => {
    const updatedPost = await prisma.posts.update({
        where: {
            postId: postId,
        },
        data: {
            title,
            content,
            link,
            imageId,
        },
        select: {
            postId: true,
            title: true,
            content: true,
            link: true,
            createdAt: true,
            userId: true,
            image: { select: { url: true } },
            user: { select: { nickname: true } },
        },
    });

    if (updatedPost) {
        updatedPost.nickname = updatedPost.user.nickname;
        delete updatedPost.user;

        updatedPost.url = updatedPost.image.url;
        delete updatedPost.image;
    }

    return updatedPost;
};

// 게시물 삭제

export const deletePost = async (postId) => {
    return await prisma.posts.delete({
        where: { postId: postId },
    });
};
