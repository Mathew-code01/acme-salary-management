import { Router } from 'express';

import employeeRoutes from './employee.routes';
import salaryRoutes from './salary.routes';
import analyticsRoutes from './analytics.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/employees', employeeRoutes);
router.use('/employees', salaryRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/health', healthRoutes);

export default router;
