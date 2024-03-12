import { Response, Request } from "express";
import { USER_LOGIN_TYPE } from "../auth.controller";
import { getUser } from "../../service/user.service";
import { USER_TYPE, User } from "../../models/user.model";
import bcrypt from "bcryptjs";
import BadRequestError from "../../errors/BadRequestError";
import { generateUserJWT } from "../../service/auth.service";
import { apiResponse } from "../../utils/apiResponse";

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password }: USER_LOGIN_TYPE = req.body;

  // CHECK IF USER EXISTS
  const userExists: User = await getUser(
    email.toString(),
    "Admin user not found for given credentials",
    USER_TYPE.ADMIN
  );

  // IF PASSWORDS DOESN'T MATCH
  if (!await bcrypt.compare(password, String(userExists?.password))) {
    throw new BadRequestError({ message: "Incorrect Password" });
  }

  const { token, user } = await generateUserJWT({
    _id: userExists._id.toString(),
  });

  return apiResponse({
    res,
    message: "Login Successfull",
    data: {
      token,
      user,
    },
  });
};
