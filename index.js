const express = require("express");
const mongoose = require("mongoose")
const {adminRouter} = require("./routers/adminRouter");
const {userRouter} = require("./routers/userRouter");
const { courseRouter } = require("./routers/courseRouter");

const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(express.json())

app.use("api/v1/users", userRouter);
app.use("api/v1/admin", adminRouter);
app.use("api/v1/course", courseRouter);

async function main() {
  await mongoose.connect(DATABASE_URL);
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}

main();
