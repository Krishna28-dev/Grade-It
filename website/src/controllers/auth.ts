import { Handler } from "express";
import { User } from "../models/user";

const loginFormHandler: Handler = async (req, res, next) => {
  res.render("auth/login");
};

const registerForm: Handler = async (req, res, next) => {
  res.render("auth/register");
};

const loginHandler: Handler = async (req, res, next) => {
  try {
    console.log(req.body);

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      // such user doesn't exist
      return res.status(401).send("Invalid email");
    }

    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch) return res.send("Incorect password");
    else return res.send("Logged in");
  } catch (err) {
    next({ status: 500, message: err });
  }
};

const registerHandler: Handler = async (req, res, next) => {
  try {
    console.log(req.body);

    const newUser = {
      name: String(req.body.username),
      email: String(req.body.email),
      password: String(req.body.password),
      isStudent: req.body.type === "0",
    };

    const user = await User.create(newUser);

    console.log("New User has been created", user);

    res.send("New user created");
  } catch (err) {
    // console.log(err);
    if (err.code == 11000) {
      //mongoose error,
      res.send("A user with that email already exists.");
    }
    next({ status: 500, message: err });
  }
};

export { loginFormHandler, loginHandler };

export { registerForm, registerHandler };
