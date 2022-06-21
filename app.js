const express = require('express');
const helmet = require('helmet');
// const cors = requiire('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const morgan = require('morgan');

// -- router
const userRouter = require('./routes/user');

// -- DB
const connect = require('./schemas');
connect();

// app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('dev'));

app.get('/', function (req, res) {
  res.send('hello NodeJs');
});
// app.use('/user', express.urlencoded({ extended: false }), userRouter);
app.use('/user', require('./routes/user'));

app.listen(port, () => console.log(`http://localhost:${port}`));

module.exports = app;
