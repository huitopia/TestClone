const express = require('express');
const router = express.Router();
const Post = require('../schemas/posts');
const authMiddleware = require('../middlewares/auth-middleware');

// -- 게시글 작성
router.post('/post', authMiddleware, async (req, res) => {
  const { image, title, description } = req.body;
  const { user } = res.locals;
  const { userIdx } = user;
  const { userName } = user;

  console.log(title, description, userIdx);
  try {
    const recentPost = await Post.find().sort('-postIdx').limit(1);
    let postIdx = 1;
    if (recentPost.length !== 0) {
      postIdx = recentPost[0].postIdx + 1;
    }

    await Post.create({
      postIdx,
      userIdx,
      userName,
      image,
      title,
      description,
    });

    res.status(201).send({
      success: true,
      message: '게시글 작성 완료',
    });
    return;
  } catch (error) {
    res.status(400).json({
      success: false,
      message: '게시글 작성 실패',
    });
  }
});

// -- 게시글 전체 조회
router.get('/', async (req, res) => {
  try {
    const body = await Post.find(
      {},
      { _id: 0, postIdx: 1, userName: 1, image: 1 },
    )
      .sort('-postIdx')
      .limit();

    res.status(200).send({
      success: true,
      body,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: '정보 불러오기 실패',
    });
  }
});

// -- 게시글 상세 조회
router.get('/:postIdx', async (req, res) => {
  const { postIdx } = req.params;
  try {
    const body = await Post.findOne(
      { postIdx },
      { _id: 0, postIdx: 1, userName: 1, image: 1, title: 1, description: 1 },
    )
      .sort('-postIdx')
      .limit();

    res.status(200).send({
      success: true,
      body,
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: '정보 불러오기 실패',
    });
  }
});

// -- 게시글 수정
router.put('/:postIdx', authMiddleware, async (req, res) => {
  const { postIdx } = req.params;
  const { user } = res.locals;
  const { title, description } = req.body;
  try {
    const postUser = await Post.findOne({ postIdx });
    const tokenUser = user.userIdx;
    const dbUser = postUser.userIdx;

    if (tokenUser == dbUser) {
      await Post.updateOne({ postIdx }, { $set: { title, description } });
      res.status(200).send({
        success: true,
        message: '수정 완료',
      });
      return;
    } else {
      res.status(401).send({
        success: false,
        message: '권한 없음',
      });
      return;
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: '수정 실패',
    });
  }
});

// -- 게시글 삭제
router.delete('/:postIdx', authMiddleware, async (req, res) => {
  const { postIdx } = req.params;
  const { user } = res.locals;
  try {
    const postUser = await Post.findOne({ postIdx });
    const tokenUser = user.userIdx;
    const dbUser = postUser.userIdx;

    if (tokenUser == dbUser) {
      await Post.deleteOne({ postIdx });
      res.status(200).send({
        success: true,
        message: '삭제 완료',
      });
      return;
    } else {
      res.status(401).send({
        success: false,
        message: '권한 없음',
      });
      return;
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: '삭제 실패',
    });
  }
});

module.exports = router;
