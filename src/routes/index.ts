// MODULE IMPORTS
import express, { Router } from 'express';

// ROUTES IMPORTS
import platform from './platform';
import admin from './admin';

// MIDDLEWARES
import adminAuthMiddleware from '../middlewares/admin.auth.middleware';
import authMiddleware from '../middlewares/auth.middleware';
import webhookRoutes from './platform/webhook.routes';

// import testRoutes from './tests.routes';

// ROUTER INITIALIZATION
const router: Router = express.Router();

// INCLUDE ROUTES
router.use('/v1', authMiddleware, platform);
router.use('/admin', adminAuthMiddleware, admin);
router.use('/webhook', webhookRoutes);

// temporary path to test functions
// router.use('/test', authMiddleware, testRoutes);

// EXPORTS
export default router;
