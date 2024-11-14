const { Router } = require("express");
const courseRouter = Router();
const { courseModel, purchaseModel } = require("../db/db");
const { authenticateToken, authorizeRole } = require("../middlewares/auth");

courseRouter.post(
  "/purchase",
  authenticateToken,
  authorizeRole("user"),
  async (req, res) => {
    const { courseId } = req.body;
    try {
      const purchase = await purchaseModel.create({
        courseId,
        userId: req.headers.id,
      });
    } catch (e) {
      return res.status(400).json({ message: "Unable to purchase course" });
    }
    return res.json({ message: "Purchased course with id: " + courseId });
  }
);

courseRouter.get("/preview", async (req, res) => {
  try {
    const courses = await courseModel.find({});
    res.json(courses);
  } catch (e) {
    return res.status(400).json({ message: "Unable to fetch courses" });
  }
});

module.exports = { courseRouter };
