const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
const logger = require("./logger");
app.use(logger);

const { UserModel } = require("./user");

app.post("/api/users", function (req, res) {
  let username = req.body.username;
  let userEntity = new UserModel({
    username: username,
  });
  let isSuccess = false;
  userEntity
    .save()
    .then(function (data) {
      isSuccess = true;
      res.json(data);
      return;
    })
    .catch(function (err) {
      if (!isSuccess) {
        res.json(err);
        return;
      }
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
