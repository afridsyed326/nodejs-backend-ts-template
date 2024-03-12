import { ACCOUNT_TYPE } from '../models/user.model';

export const sanitizeUserBasedOnAccountType = (accountType: string) => {
  let selectFields = '-password -tfaSecret';

  if (accountType === ACCOUNT_TYPE.INDIVIDUAL) {
    selectFields += ' -billingAddress -differentBillingAddress -companyName';
  } else {
    selectFields += ' -firstName -lastName';
  }

  return selectFields;
};
