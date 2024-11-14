const express = require("express");
const userRouter = express.Router();
const { authenticateToken, authorizeRole } = require("../middlewares/auth");
const {userModel} = require("../db/db")

require("dotenv").config();

const SECRET = process.env.SECRET;

userRouter.post(
  "/signup",
  authenticateToken,
  authorizeRole("user"),
  (req, res) => {
    res.json({message: "some endpoint"})
  }
);

userRouter.post(
  "/login",
  authenticateToken,
  authorizeRole("user"),
  (req, res) => {
    res.json({message: "some endpoint"})
  }
);

userRouter.get(
  "/courses/:id",
  authenticateToken,
  authorizeRole("user"),
  (req, res) => {
    res.json({message: "some endpoint"})
  }
);

userRouter.get(
  "/courses",
  authenticateToken,
  authorizeRole("user"),
  (req, res) => {
    res.json({message: "some endpoint"})
  }
)

userRouter.get(
  "/purchases",
  authenticateToken,
  authorizeRole("user"),
  (req, res) => {
    res.json({message: "some endpoint"})
  }
)

module.exports = {
  userRouter,
};
