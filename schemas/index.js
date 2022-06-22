const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const production = process.env.DB_PRODUCTION;
// const dev = process.env.DB_DEV;

const connect = () => {
  mongoose
    .connect(production, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
  console.error("mongodb connect error", err);
});

module.exports = connect;
