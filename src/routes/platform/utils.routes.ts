// MODULE IMPORTS
import express from 'express';

// CONTROLLERS
import { getAllCountries } from '../../controller/utils.controller';

// ROUTER INITIALIZATION
const router = express.Router();

// ROUTES
router.get('/countries', getAllCountries);
export default router;
