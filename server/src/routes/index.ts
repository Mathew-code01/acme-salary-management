// server/src/routes/index.ts


import { Router } from 'express';

import healthRoutes from './health.routes.js';

import { HEALTH_PATH } from '../config/constants.js';

const router = Router();

router.use(HEALTH_PATH, healthRoutes);

export default router;