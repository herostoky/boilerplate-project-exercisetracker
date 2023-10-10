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
const { ExerciseModel } = require("./exercise");

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

app.get("/api/users", function (req, res) {
  let isSuccess = false;
  UserModel.find()
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

app.post("/api/users/:_id/exercises", async function (req, res) {
  const userId = req.params._id;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  let date = req.body.date;
  if (!date) {
    date = new Date();
  }
  // Get the user
  const user = await UserModel.findById(userId);
  let exerciseEntity = new ExerciseModel({
    username: user.username,
    description: description,
    duration: duration,
    date: date,
  });
  let isSuccess = false;
  exerciseEntity
    .save()
    .then(function (data) {
      isSuccess = true;
      res.json({
        username: data.username,
        description: data.description,
        duration: data.duration,
        date: data.date.toDateString(),
        _id: user._id,
      });
      return;
    })
    .catch(function (err) {
      if (!isSuccess) {
        res.json(err);
        return;
      }
    });
});

app.get("/api/users/:_id/logs", async function (req, res) {
  const userId = req.params._id;
  // Get the user
  const user = await UserModel.findById(userId);
  let isSuccess = false;
  let filter = { username: user?.username };
  if (req.query.from && req.query.to) {
    filter.date = { $gte: req.query.from, $lte: req.query.to };
  }
  let limit = req.query.limit;
  if (!limit) {
    limit = -1;
  }
  ExerciseModel.find(filter)
    .then(function (data) {
      isSuccess = true;
      let result = {
        username: user.username,
        count: data.length,
        _id: user._id,
        log: [],
      };
      let added = 0;
      data.forEach((element) => {
        if (limit == -1 || added < limit) {
          result.log.push({
            description: element.description,
            duration: element.duration,
            date: element.date.toDateString(),
          });
        }
        added += 1;
      });
      res.json(result);
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
