// MODULE IMPORTS
import { body } from 'express-validator';
import { LEGAL_CONTENT_TYPE } from '../models/legal-content.model';

// VALIDATION SCHEMAS
export const addLegalContentValidation = [
  body('content').notEmpty().withMessage('Content is required'),
  body('type')
    .notEmpty()
    .withMessage('Legal Content Type is required')
    .isIn([LEGAL_CONTENT_TYPE.PRIVACY_POLICY, LEGAL_CONTENT_TYPE.TERMS_AND_CONDITIONS])
    .withMessage(
      `Legal Content Type must be "${LEGAL_CONTENT_TYPE.PRIVACY_POLICY}" or "${LEGAL_CONTENT_TYPE.TERMS_AND_CONDITIONS}"`
    ),
];
