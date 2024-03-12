import { Response } from "express";
import { CustomRequest } from "../../interface/CustomRequest";
import UserModel from "../../models/user.model";
import { apiResponse } from "../../utils/apiResponse";
import { SORT_BY } from "../../utils/constance";
import BadRequestError from "../../errors/BadRequestError";
import { COUNTRY_MODEL_NAME } from "../../models/country.model";
import { aggregatePaginate } from "../../utils/paginationV2";
import mongoose from "mongoose";
import VerificationCodeModel, {
  VERIFICATION_CODE_TYPE,
} from "../../models/verification-code.model";
import generateOTP from "../../utils/generateOTP";


export const getAllUsers = async (req: CustomRequest, res: Response) => {
    const {
      page = 1,
      limit,
      sortBy = SORT_BY.DESC,
      search = "",
      country,
      sortKey = "createdAt",
    }: any = req.query;
  
    let config: any = {
      $and: [
        {
          $or: [
            {
              username: {
                $regex: search,
                $options: "i",
              },
            },
            {
              email: {
                $regex: search,
                $options: "i",
              },
            },
            {
              fullName: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      ],
    };

  
    if (country) {
      config["country._id"] = new mongoose.Types.ObjectId(country);
    }
  
    const pipeline = [
      { $sort: { [sortKey]: sortBy === SORT_BY.ASC ? 1 : -1 } } as any,
      { $project: { updatedAt: 0 } },
      {
        $addFields: {
          fullName: { $concat: ["$firstName", " ", "$lastName"] },
        },
      },
      {
        $lookup: {
          from: COUNTRY_MODEL_NAME,
          localField: "country",
          foreignField: "_id",
          as: "country",
        },
      },
      { $unwind: { path: "$country", preserveNullAndEmptyArrays: true } },
      { $match: config },
    ];
  
    let users = await aggregatePaginate(UserModel, pipeline, page, limit);
  
    return apiResponse({
      res,
      data: users,
    });
  };


  export const impersonateUser = async (req: CustomRequest, res: Response) => {
    const { userId } = req.params;
  
    const user = await UserModel.findById(userId).lean();
    if (!user) throw new BadRequestError({ message: "Invalid user id" });
    const otp = generateOTP();
  
    const currentDate = new Date();
  
    const expireIn = new Date(currentDate.getTime() + 2 * 60000);
  
    await VerificationCodeModel.create({
      code: otp,
      user: user._id,
      type: VERIFICATION_CODE_TYPE.IMPERSONATE_USER,
      expireIn,
    });
  
    const url = process.env.FRONTEND_LINK + `/impersonate?code=${otp}`;

    return apiResponse({
      res,
      data: { url },
    });
  };