const express = require("express");
const adminRouter = express.Router();
const { authenticateToken, authorizeRole } = require("../middlewares/auth");
const {adminModel} = require("../db/db");

adminRouter.post(
  "/signup",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({message: "some endpoint"})
  }
);

adminRouter.post(
  "/login",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({message: "some endpoint"})
  }
);

adminRouter.post(
  "/courses",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({message: "some endpoint"})
  }
);

adminRouter.delete(
  "/courses/:id",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({message: "some endpoint"})
  }
);

adminRouter.put(
  "/courses/:id",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({message: "some endpoint"})
  }
);

module.exports = {
  adminRouter,
};
