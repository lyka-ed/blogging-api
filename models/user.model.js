const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },

    lastname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      // Remove password when object is serialized.
      transform: function (doc, user) {
        delete user.__v;
        // delete user.password;
        return user;
      },
    },
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
