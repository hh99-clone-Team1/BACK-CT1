import postSchema from '../../utils/joi.schemas/postSchema.js';
import * as postService from '../service/postService.js';

// 게시물 등록
export const createPostController = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { error, value } = postSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        }
        const { title, content, link, imageId } = value;

        // 게시물 생성
        const post = await postService.createPost({ userId, title, content, link, imageId });
        res.status(201).json({ post });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 게시물 전체 조회
export const getAllPostsController = async (req, res, next) => {
    try {
        const posts = await postService.getAllPosts();
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

// 생성자 게시물 조회
export const getPostsByUserIdController = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const posts = await postService.getPostsByUserId(+userId);
        res.status(200).json(posts);
    } catch (error) {
        if (error.message === '사용자 ID에 해당하는 게시물이 존재하지 않습니다') {
            return res.status(404).json({ message: '사용자 ID에 해당하는 게시물이 존재하지 않습니다' });
        }
        console.error(error);
        next(error);
    }
};

//게시물 상세 조회
export const getPostDetailController = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.postId);
        const userId = res.locals.user.userId;

        const post = await postService.getPostByPostId(postId, userId);

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        if (error.message === '존재하지 않는 게시물입니다.') {
            return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
        }
        next(error);
    }
};

//게시글 키워드 검색 조회
export const searchPostsByKeywordController = async (req, res, next) => {
    try {
        const { keyword } = req.params;
        if (!keyword) {
            return res.status(400).json({ message: '키워드를 입력해주세요.' });
        }
        const posts = await postService.searchPostsByKeyword(keyword);
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        if (error.message === '검색어에 해당하는 게시물이 존재하지 않습니다.') {
            return res.status(404).json({ message: '검색어에 해당하는 게시물이 존재하지 않습니다.' });
        }
        next(error);
    }
};

// 게시물 수정
export const updatePostController = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const postId = parseInt(req.params.postId);
        const { error, value } = postSchema.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
        }
        const { title, content, link, imageId } = value;

        const post = await postService.getPostByPostId(+postId);

        // 게시물 작성자와 로그인된 사용자가 일치하는지 확인
        if (userId !== post.userId) {
            return res.status(403).json({ message: '게시물 수정 권한이 없습니다.' });
        }

        // 게시물 업데이트
        const updatedPost = await postService.updatePost(postId, { title, content, link, imageId });
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        if (error.message === '존재하지 않는 게시물입니다.') {
            return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
        }
        next(error);
    }
};

// 게시물 삭제
export const deletePostController = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const postId = parseInt(req.params.postId);

        const post = await postService.getPostByPostId(+postId);
        if (userId !== post.userId) {
            return res.status(403).json({ message: '게시물 삭제 권한이 없습니다' });
        }
        //게시물 삭제
        await postService.deletePost(postId);
        res.status(200).json({ message: '게시물 삭제가 완료되었습니다.' });
    } catch (error) {
        console.error(error);
        if (error.message === '존재하지 않는 게시물입니다.') {
            return res.status(404).json({ message: '게시물이 존재하지 않습니다.' });
        }
        next(error);
    }
};
