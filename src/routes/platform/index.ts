// MODULE IMPORTS
import express from 'express';

// ROUTES IMPORTS
import authRoutes from './auth.routes';
import legalContentRoutes from './legal-content.routes';
import utilRoutes from './utils.routes';

// ROUTER INITIALIZATION
const router = express.Router();

// INCLUDE ROUTES
router.use('/auth', authRoutes);
router.use('/utils', utilRoutes);
router.use('/legal-content', legalContentRoutes);


// EXPORTS
export default router;
