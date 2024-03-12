import express, { Router } from 'express';
import authAdminRoutes from './auth.admin.routes';
import userAdminRoutes from './users.admin.routes';
import userVerificationRoutes from './user-verification.admin.routes';
import legalContentRoutes from './legal-content.admin.routes';
import utilsAdminRoutes from '../platform/utils.routes';

const router: Router = express.Router();

router.use('/auth', authAdminRoutes);
router.use('/user', userAdminRoutes);
router.use('/user-verification', userVerificationRoutes);
router.use('/legal-content', legalContentRoutes);
router.use('/utils', utilsAdminRoutes);

export default router;
