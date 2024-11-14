const express = require("express");
const adminRouter = express.Router();
const { authenticateToken, authorizeRole } = require("../middlewares/auth");
const { adminModel, courseModel } = require("../db/db");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const SECRET = process.env.SECRET;
const courseInputSchema = z
  .object({
    title: z.string().min(3).max(50),
    description: z.string().min(3).max(100),
    price: z.number(),
    imageUrl: z.string().url(),
  })
  .strict();

const loginDataSchema = z
  .object({
    email: z.string().max(100).email(),
    password: z
      .string()
      .min(5)
      .max(100)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .regex(/[!@#$%^&*()_+=-]/),
  })
  .strict();
const requiredDataSchema = loginDataSchema.extend({
  firstName: z.string().min(3).max(100),
  lastName: z.string().min(3).max(100),
});

adminRouter.post("/signup", async (req, res) => {
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
    return res.status(500).json({ message: "Password hashing failed " + e });
  }

  try {
    if (await adminModel.findOne({ email: payload.email })) {
      return res.status(400).json({ message: "User already exists" });
    }
    const admin = new adminModel(payload);
    await admin.save();
  } catch (e) {
    return res.status(500).json({ message: "Unable to store user details" });
  }

  return res.json({ message: "Signup successful" });
});

adminRouter.post("/login", async (req, res) => {
  if (Object.keys(req.body).length === 0)
    return res.status(401).json({ message: "Invalid creds" });
  const loginData = loginDataSchema.safeParse(req.body);
  if (loginData.error) {
    return res.status(401).json({ error: loginData.error });
  }
  try {
    const enteredDetails = loginData.data;
    const admin = await adminModel.findOne({ email: enteredDetails.email });
    const matched = bcrypt.compare(enteredDetails.password, admin.password);
    if (!matched) {
      return res.status(403).json({ message: "Invalid creds" });
    }
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.json({ token });
  } catch (e) {
    return res.status(500).json({ message: "Unable to fetch user data" });
  }
});

adminRouter.post(
  "/courses",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    const parsedInput = courseInputSchema.safeParse(req.body);
    if (parsedInput.error) {
      return res.status(404).json({ error: parsedInput.error });
    }
    const { title, description, price, imageUrl } = req.body;
    try {
      await courseModel.create({
        title,
        description,
        price,
        imageUrl,
        creatorId: req.headers.id,
      });
    } catch (e) {
      return res.status(500).json({ message: "Unable to create course" });
    }
    res.json({ message: "Course created successfully." });
  }
);

adminRouter.delete(
  "/courses",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({ message: "some endpoint" });
  }
);

adminRouter.put(
  "/courses",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    res.json({ message: "some endpoint" });
  }
);

adminRouter.get(
  "/courses/bulk",
  authenticateToken,
  authorizeRole("admin"),
  async (req, res) => {
    try{
      const courses = await courseModel.find({
        creatorId: req.headers.id
      });
      return res.json({courses});
    }
    catch(e){
      return res.status(500).json({message: "Unable to fetch courses"})
    }
  }
);

module.exports = {
  adminRouter,
};
