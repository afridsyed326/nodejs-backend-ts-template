// MODULE IMPORTS
import express from 'express';

// CONTROLLERS
import { addLegalContent, getLegalContent, getSingleLegalContent } from '../../controller/legal-content.controller';

// MIDDLESWARES
import { validationCheck } from '../../middlewares/validationCheck';
import { addLegalContentValidation } from '../../validations/legal-content.validations';

// ROUTER INITIALIZATION
const router = express.Router();

// ROUTES
router.get('/', getLegalContent);
router.post('/', addLegalContentValidation, validationCheck, addLegalContent);
router.get('/:type', getSingleLegalContent);

export default router;
