const { Router } = require("express");
const courseRouter = Router();
const {courseModel} = require("../db/db")

courseRouter.post("/purchase", (req, res) => {
    res.json({message: "some endpoint"})
});

courseRouter.get("/preview", (req, res) => {
    res.json({message: "some endpoint"})
});

module.exports = { courseRouter };
