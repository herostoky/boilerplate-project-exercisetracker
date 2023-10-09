require("dotenv").config();
let mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
  },
  { strict: true },
  { collection: "user" }
);
let User = mongoose.model("User", userSchema);

exports.UserModel = User;
