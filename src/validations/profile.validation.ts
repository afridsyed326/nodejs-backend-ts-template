// MODULE IMPORTS
import { body } from 'express-validator';

// VALIDATION SCHEMAS
export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current Password is required'),
  body('newPassword')
    .notEmpty()
    .withMessage('New Password is required')
    .isLength({ min: 8 })
    .withMessage('New Password should be minimum length of 8 chars')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    )
    .withMessage(
      'New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm Password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

export const updateEmailValidation = [
  body('email').notEmpty().withMessage('Email is required'),
];

export const updateSecurityCodeValidation = [
  body('code').custom((value, { req }) => {
    const enabled = req.body.enabled;

    if (enabled) {
      // If the field is provided, it should not be an empty string
      if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        throw new Error('Code is required.');
      }
      if (value.length < 6 || value.length > 6) {
        throw new Error('Code must have 6 digits.');
      }
    }

    return true;
  }),
  body('enabled').notEmpty().withMessage('Enabled is required.'),
];

export const toggleTfaValidation = [
  body('code')
    .custom((value) => {
      // If the field is provided, it should not be an empty string
      if (
        value !== null &&
        value !== undefined &&
        typeof value === 'string' &&
        value.trim() === ''
      ) {
        throw new Error('Code should not be empty');
      }
      return true;
    })
    .isLength({ min: 6, max: 6 })
    .withMessage('Code must have 6 digits.'),
  body('enabled').notEmpty().withMessage('Enabled is required.'),
];

export const setNotificationPreferenceValidation = [
  body('type')
    .notEmpty()
    .withMessage('type is required.')
    .isIn(['loginActivity', 'accountActivity', 'news'])
    .withMessage(
      "Invalid 'type', Accepted Types are ('loginActivity', 'accountActivity', 'news')"
    ),
  body('values').isObject().withMessage("'values' must be an object."),
  body('values.email')
    .exists()
    .isBoolean()
    .withMessage('Email must be a boolean'),
  body('values.browser')
    .exists()
    .isBoolean()
    .withMessage('Browser must be a boolean'),
];

export const userVerificationDcoumentValidation = [
  body('type')
    .isIn([
      'CERTIFICATE_OF_INCORPORATION',
      'SHAREHOLDER_REGISTRY',
      'DIRECTOR_REGISTRY',
      'DIRECTOR_IDENTIFICATION',
      'GOVERMENT_ID',
      'SELFIE_VERIFICATION',
    ])
    .withMessage(
      'Invalid document type. It must be one of: CERTIFICATE_OF_INCORPORATION, SHAREHOLDER_REGISTRY, DIRECTOR_REGISTRY, DIRECTOR_IDENTIFICATION, GOVERMENT_ID, SELFIE_VERIFICATION'
    ),
];
