import * as postRepository from '../repository/postRepository.js ';

// 게시물 등록
export const createPost = async ({ userId, title, content, link }) => {
    return await postRepository.createPost({ userId, title, content, link });
};

// 전체 게시물 조회
export const getAllPosts = async () => {
    return await postRepository.getAllPosts();
};

// 생성자 게시물 조회
export const getPostsByUserId = async (userId) => {
    const posts = await postRepository.getPostsByUserId(userId);
    if (posts.length === 0) {
        throw new Error('사용자 ID에 해당하는 게시물이 존재하지 않습니다');
    }
    return posts;
};

// 게시물 상세조회
export const getPostByPostId = async (postId) => {
    const post = await postRepository.getPostByPostId(postId);
    if (!post) {
        throw new Error('존재하지 않는 게시물입니다.');
    }
    return post;
};

//게시물 키워드 검색
export const searchPostsByKeyword = async (keyword) => {
    const posts = await postRepository.searchPostsByKeyword(keyword);
    if (posts.length === 0) {
        throw new Error('검색어에 해당하는 게시물이 존재하지 않습니다.');
    }
    return posts;
};

// 게시물 수정
export const updatePost = async (postId, { title, content, link }) => {
    return await postRepository.updatePost(postId, { title, content, link });
};

// 게시물 삭제
export const deletePost = async (postId) => {
    const existingPost = await postRepository.getPostByPostId(postId);
    if (!existingPost) {
        throw new Error('존재하지 않는 게시물입니다.');
    }
    return await postRepository.deletePost(postId);
};

//
