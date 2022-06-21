const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../schemas/users');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middlewares/auth-middleware');
const Joi = require('joi');
const dotenv = require('dotenv');
dotenv.config();
const jwtKey = process.env.JWT_TOKEN;

// -- 회원가입 검증
// const registerSchema = Joi.object({
//   userEmail: Joi.string()
//     .pattern(
//       new RegExp(
//         '/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i',
//       ),
//     )
//     .required(),
//   password: Joi.string()
//     .pattern(new RegExp('/^(?=.*[A-Za-z])(?=.*d)[A-Za-zd]{8,}$/'))
//     .required(),
// });

// -- 회원가입
router.post('/signup', async (req, res) => {
  const { userInfo } = req.body;
  // const { userInfo } = await registerSchema.validateAsync(req.body);
  let userEmail = userInfo.userEmail;
  let password = userInfo.password;
  let fullName = userInfo.fullName;
  let userName = userInfo.userName;

  try {
    const recentUser = await User.find().sort('userIdx').limit(1);
    let userIdx = 1;
    if (recentUser.length != 0) {
      userIdx = recentUser[0]['userIdx'] + 1;
    }

    const userID = await User.find({ userEmail: userEmail });
    if (userID.length !== 0) {
      res.status(400).send({
        errorMessage: '중복된 이메일입니다.',
      });
      return;
    }

    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    await User.create({
      userIdx,
      fullName,
      userEmail,
      userName,
      password,
    });

    res.status(201).send({
      success: true,
      message: '회원가입 완료',
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      errorMessage: '입력한 내용을 다시 확인해주세요.',
    });
  }
});

const loginSchema = Joi.object({
  userEmail: Joi.string().required(),
  password: Joi.string().required(),
});

// -- 로그인
router.post('/signin', async (req, res) => {
  try {
    const { userEmail, password } = req.body;
    const user = await User.findOne({ userEmail }).exec();
    const userIdx = user['userIdx'];

    const authenticate = await bcrypt.compare(password, user.password);

    if (authenticate === true) {
      const token = jwt.sign({ userIdx: user.userIdx }, jwtKey);

      res.status(200).send({
        success: true,
        message: '로그인 성공',
        token,
      });
    } else {
      res.status(401).send({
        errorMessage: '아이디 또는 비밀번호를 확인해주세요',
      });
      return;
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: '로그인 실패',
    });
  }
});

module.exports = router;
