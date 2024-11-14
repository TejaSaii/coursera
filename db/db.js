const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});
const AdminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});
const CourseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: mongoose.Types.ObjectId,
});
const PurchaseSchema = new Schema({
  courseId: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
});

const userModel = mongoose.model("users", UserSchema);
const adminModel = mongoose.model("admins", AdminSchema);
const courseModel = mongoose.model("courses", CourseSchema);
const purchaseModel = mongoose.model("purchase", PurchaseSchema);

module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel,
};
