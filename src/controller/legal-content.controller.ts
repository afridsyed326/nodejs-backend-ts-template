// MODULE IMPORTS
import { Request, Response } from 'express';

// UTILS
import { apiResponse } from '../utils/apiResponse';

// MODELS
import LegalContentModel, { LEGAL_CONTENT_TYPE } from '../models/legal-content.model';
import { CustomRequest } from '../interface/CustomRequest';
import BadRequestError from '../errors/BadRequestError';

// CONTROLLERS
export const getLegalContent = async (req: Request, res: Response) => {
  const latestLegalContent = await LegalContentModel.aggregate([
    { $match: { type: { $in: [LEGAL_CONTENT_TYPE.PRIVACY_POLICY, LEGAL_CONTENT_TYPE.TERMS_AND_CONDITIONS,LEGAL_CONTENT_TYPE.AGREEMENT] } } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: '$type', documents: { $first: '$$ROOT' } } },
    { $replaceRoot: { newRoot: '$documents' } },
  ]);

  return apiResponse({
    res,
    data: latestLegalContent,
  });
};

export const getSingleLegalContent = async (req: Request, res: Response) => {
  const type = req.params.type;

  const pipeline: any[] = [{ $match: { type: type } }, { $sort: { createdAt: -1 } }, { $limit: 1 }];
  const data = await LegalContentModel.aggregate(pipeline);

  if (!data) throw new BadRequestError({ message: 'no data available' });

  return apiResponse({
    res,
    data: data ? data[0] : null,
  });
};

export const addLegalContent = async (req: CustomRequest, res: Response) => {
  const { type, content } = req.body;

  const legalContent = await LegalContentModel.create({
    type,
    content,
  });

  return apiResponse({
    res,
    message: `Legal Content (${type}) Added.`,
    data: legalContent,
  });
};
