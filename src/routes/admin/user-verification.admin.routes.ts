// MODULE IMPORTS
import express from 'express';

// MIDDLEWARES
import { validationCheck } from '../../middlewares/validationCheck';

// CONTROLLERS
import {
  getUserVerificationsList,
  updateVerificationRequest,
} from '../../controller/admin/user-verification.controller';
import {
  checkUpdateVerificationRequest,
  updateUserVerificationValidation,
} from '../../validations/user-verification.validations';

// VALIDATIONS

// ROUTER INITIALIZATION
const router = express.Router();

// ROUTES
// router.get('/', getVerificationRequests);
router.patch('/:id', checkUpdateVerificationRequest, validationCheck, updateVerificationRequest);
router.get('/user/:userId', getUserVerificationsList);

// EXPORTS
export default router;
