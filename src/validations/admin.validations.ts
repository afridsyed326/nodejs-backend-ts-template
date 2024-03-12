import { body } from "express-validator";
import UserModel from "../models/user.model";
import BadRequestError from "../errors/BadRequestError";

export const adminCreateValidation = [
  body("firstName").notEmpty().withMessage("firstName is required"),
  body("lastName").notEmpty().withMessage("lastName is required"),
  body("username")
    .notEmpty()
    .withMessage("username is required")
    .isLength({ min: 6 })
    .withMessage("username must be minimum length of 6 chars.")
    .custom(async (value: string, { req }) => {
      const user = await UserModel.findOne({ username: value });
      if (user) {
        throw new BadRequestError({ message: "username already exits" });
      }
    }),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter valid email")
    .custom(async (value: string, { req }) => {
      const user = await UserModel.findOne({ email: value });
      if (user) {
        throw new BadRequestError({ message: "Email already exits" });
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password should be minimum length of 8 chars")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  body("phoneNumber")
    .notEmpty()
    .withMessage("PhoneNumber is required")
    .custom(async (value: string, { req }) => {
      const user = await UserModel.findOne({ phoneNumber: value });
      if (user) {
        throw new BadRequestError({ message: "phoneNumber already exits" });
      }
    }),
];

export const adminUpdateValidation = [
  body("firstName").notEmpty().withMessage("firstName is required"),
  body("lastName").notEmpty().withMessage("lastName is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter valid email")
    .custom(async (value: string, { req }) => {
      const user = await UserModel.findOne({ email: value });
      console.log(user);
      console.log(req.user._id, " - ", user?._id);

      if (user) {
        if (String(req.user._id) !== String(user?._id)) {
          throw new BadRequestError({ message: "Email already exits" });
        }
      }
    }),
  body("phoneNumber")
    .notEmpty()
    .withMessage("PhoneNumber is required")
    .custom(async (value: string, { req }) => {
      const user = await UserModel.findOne({ phoneNumber: value });
      if (user) {
        if (String(req.user._id) !== String(user?._id)) {
          throw new BadRequestError({ message: "Phone Number already exits" });
        }
      }
    }),
];
