const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
const port = 3000;
const morgan = require('morgan');

// -- router
const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

// -- DB
const connect = require('./schemas');
connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('dev'));

app.get('/', function (req, res) {
  res.send('hello NodeJs');
});

app.use('/user', express.urlencoded({ extended: false }), userRouter);
app.use('/posts', express.urlencoded({ extended: false }), postRouter);

app.listen(port, () => console.log(`http://localhost:${port}`));

module.exports = app;
