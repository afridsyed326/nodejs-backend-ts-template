// MODULE IMPORTS
import express from 'express';

// CONTROLLERS
import { getLegalContent } from '../../controller/legal-content.controller';

// ROUTER INITIALIZATION
const router = express.Router();

// ROUTES
router.get('/', getLegalContent);

export default router;
