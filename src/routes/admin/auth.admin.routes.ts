import express from 'express';
import { loginValidation } from '../../validations/auth.validation';
import { validationCheck } from '../../middlewares/validationCheck';
import { adminLogin } from '../../controller/admin/auth.admin.controller';

const router = express.Router();

router.post('/login', loginValidation, validationCheck, adminLogin);

export default router;
