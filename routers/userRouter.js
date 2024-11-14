const express = require("express");
const userRouter = express.Router();
const { authenticateToken, authorizeRole } = require("../middlewares/auth");
const { userModel } = require("../db/db");
const { z } = require("zod");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const SECRET = process.env.SECRET;

const loginDataSchema = z.object({
  email: z.string().max(100).email(),
  password: z
    .string()
    .min(5)
    .max(100)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[!@#$%^&*()_+=-]/),
}).strict();
const requiredDataSchema = loginDataSchema.extend({
  firstName: z.string().min(3).max(100),
  lastName: z.string().min(3).max(100),
});

userRouter.post("/signup", async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(401).json({ message: "Invalid data passed" });

  const requiredData = requiredDataSchema.safeParse(req.body);
  if (requiredData.error) {
    return res.status(400).json({ error: requiredData.error });
  }

  let payload;
  try {
    payload = requiredData.data;
    payload.password = await bcrypt.hash(payload.password, 5);
  } catch (e) {
    return res.status(500).json({ message: "Password hashing failed" });
  }

  try {
    if (await userModel.findOne({ email: payload.email })) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new userModel(payload);
    await user.save();
  } catch (e) {
    return res.status(500).json({ message: "Unable to store user details" });
  }

  return res.json({ message: "Signup successful" });
});

userRouter.post("/login", async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(401).json({ message: "Invalid creds" });
  const loginData = loginDataSchema.safeParse(req.body);
  if (loginData.error) {
    return res.status(401).json({ error: loginData.error });
  }
  try {
    const enteredDetails = loginData.data;
    const user = await userModel.findOne({ email: enteredDetails.email });
    const matched = bcrypt.compare(enteredDetails.password, user.password);
    if (!matched) {
      return res.status(403).json({ message: "Invalid creds" });
    }
    const token = jwt.sign({ id: user._id, role: "user" }, SECRET, {
      expiresIn: "1h",
    });

    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ message: "Unable to fetch user data" });
  }
});

userRouter.get(
  "/purchases",
  authenticateToken,
  authorizeRole("user"),
  (req, res) => {
    res.json({ message: "some endpoint" });
  }
);

module.exports = {
  userRouter,
};
