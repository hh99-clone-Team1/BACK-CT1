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
        include: {
            user: {
                select: {
                    nickname: true,
                },
            },
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
            imageId: true,
            user: { select: { nickname: true } }, // user 객체에서 닉네임 선택
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // 각 게시물 객체에 사용자의 닉네임을 추가
    if (posts) {
        posts.forEach((post) => {
            post.nickname = post.user.nickname;
            delete post.user;
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
            imageId: true,
            user: { select: { nickname: true } },
            image: { select: { url: true } }, // 이미지 객체에서 URL 선택
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    if (posts) {
        posts.forEach((post) => {
            post.nickname = post.user.nickname;
            delete post.user;
        });
    }

    return posts;
};

//게시물 상세 조회
export const getPostByPostId = async (postId, userId) => {
    const post = await prisma.posts.findFirst({
        where: { postId },
        include: {
            user: { select: { nickname: true } },
            image: { select: { imageId: true, url: true } },
            likes: {
                where: {
                    likeCheck: true, // 좋아요가 활성화된 항목만 포함
                },
            },
            _count: {
                select: {
                    likes: {
                        where: {
                            likeCheck: true, // 좋아요가 활성화된 항목만 카운트
                        },
                    },
                },
            },
        },
    });

    // if (post) {
    //     const { _count, user, image, likes, ...rest } = post;
    //     const enhancedPost = {
    //         ...rest,
    //         nickname: user.nickname,
    //         url: image?.url,
    //         imageId: image?.imageId,
    //         likeCount: _count.likes,
    //         isLikedByUser: likes.some((like) => like.userId === userId),
    //     };
    //     return enhancedPost;
    // }
    if (post) {
        // 각 게시물에 대해 사용자별 좋아요 상태 및 좋아요 총 수 포함하여 반환
        const isLikedByUser = post.likes.some((like) => like.userId === userId && like.likeCheck);
        return {
            ...post,
            nickname: post.user.nickname,
            url: post.image?.url,
            imageId: post.image?.imageId,
            likeCount: post._count.likes, // 좋아요 총 개수 (likeCheck가 true인 경우만 카운트)
            isLikedByUser, // 현재 사용자가 좋아요 눌렀는지 여부 (likeCheck를 고려)
        };
    }

    return null;
};
// 게시물 상세 조회 : 원래 재훈님 코드
// export const getPostByPostId = async (postId, userId) => {
//     const post = await prisma.posts.findFirst({
//         where: { postId },
//         select: {
//             postId: true,
//             title: true,
//             content: true,
//             link: true,
//             createdAt: true,
//             userId: true,
//             user: { select: { nickname: true } },
//             image: { select: { imageId: true, url: true } },
//         },
//     });

//     // // 게시물 정보에 사용자의 닉네임 추가
//     if (post) {
//         post.nickname = post.user.nickname;
//         delete post.user;
//     }

//     return post;
// };

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
            imageId: true,
            user: { select: { nickname: true } }, // 사용자 객체에서 닉네임 선택
            image: { select: { url: true } }, // 이미지 객체에서 URL 선택
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    // 각 게시물 객체에 사용자의 닉네임을 추가
    if (posts) {
        posts.forEach((post) => {
            post.nickname = post.user.nickname; // 사용자의 닉네임을 게시물 정보에 추가
            delete post.user; // 사용자 정보는 더 이상 필요하지 않으므로 삭제
        });
    }

    return posts;
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
