import * as CommentRepository from '../repository/commentRepository.js';

// 댓글 작성
export const createComment = async ({ postId, userId, content }) => {
    // 댓글이 작성된 게시글이 있는지 없는지 조회
    const post = await CommentRepository.checkPostExists({ postId: +postId });
    if (!post) {
        const err = new Error('존재하지 않는 게시글입니다.');
        err.status = 404;
        throw err;
    }
    if (!content) return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });

    return await CommentRepository.createComment({ postId: Number(postId), userId: Number(userId), content });
};

// 댓글 조회
export const readComment = async ({ postId }) => {
    const post = await CommentRepository.checkPostExists({ postId: +postId });
    if (!post) {
        const err = new Error('존재하지 않는 게시글입니다.');
        err.status = 404;
        throw err;
    }
    const comments = await CommentRepository.readComment({ postId });

    return comments.map((comment) => ({
        ...comment,
        nickname: comment.user.nickname,
    }));
};

// 댓글 수정
export const updateComment = async ({ postId, commentId, userId, content }) => {
    const post = await CommentRepository.checkPostExists({ postId: +postId });
    if (!post) {
        const err = new Error('존재하지 않는 게시글입니다.');
        err.status = 404;
        throw err;
    }
    const comment = await CommentRepository.checkCommentExists({ commentId: +commentId });
    if (!comment) {
        return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
    } else if (comment.userId !== userId) {
        return res.status(403).json({ message: '댓글 수정 권한이 없습니다.' });
    }

    if (!content) return res.status(400).json({ message: '댓글 내용을 입력해주세요.' });

    return await CommentRepository.updateComment({ postId, commentId, userId, content });
};

// 댓글 삭제
export const deleteComment = async ({ postId, commentId, userId }) => {
    const post = await CommentRepository.checkPostExists({ postId: +postId });
    if (!post) {
        const err = new Error('존재하지 않는 게시글입니다.');
        err.status = 404;
        throw err;
    }
    const comment = await CommentRepository.checkCommentExists({ commentId: +commentId });
    if (!comment) {
        return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
    } else if (comment.userId !== userId) {
        return res.status(403).json({ message: '댓글 수정 권한이 없습니다.' });
    }
    return await CommentRepository.deleteComment({ postId, commentId, userId });
};
