// MODULE IMPORTS
import { Request, Response } from 'express';
// UTILS
import { apiResponse } from '../utils/apiResponse';

// MODELS
import CountryModel from '../models/country.model';

// CONTROLLERS
export const getAllCountries = async (req: Request, res: Response) => {
  const countries = await CountryModel.find({}, 'name code flag phoneCode');

  return apiResponse({
    res,
    data: countries,
  });
};