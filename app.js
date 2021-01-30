const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const schema = require("./schema/schema");
const jwt = require("jsonwebtoken");

const app = express();

mongoose.connect("mongodb://localhost:27017/login", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.once("open", () => console.log("connected to db"));

const checkUser = (req, res, next) => {
  const token = req.header("name");
  //   console.log("to", token);
  if (!token) {
    req.auth = false;
  } else {
    const decoded = jwt.verify(token, "privatekey");
    console.log("de", decoded);
    req.auth = true;
    req.authId = decoded.id;
  }

  next();
};

app.use(
  "/graphql",
  checkUser,
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);

app.listen(5000, () => console.log("server runing on port 5000"));
