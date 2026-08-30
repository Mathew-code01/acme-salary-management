// server/src/routes/index.ts

import { Router } from 'express';

import employeeRoutes from './employee.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/employees', employeeRoutes);

router.use('/health', healthRoutes);

export default router;
