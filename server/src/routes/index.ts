// server/src/routes/index.ts

import { Router } from 'express';

import employeeRoutes from './employee.routes.js';
import salaryRoutes from './salary.routes.js';
import analyticsRoutes from './analytics.routes.js';
import healthRoutes from './health.routes.js';
import referenceRoutes from './reference.routes.js';

const router = Router();

/**
 * Employee API
 *
 * /api/v1/employees/*
 */
router.use('/employees', employeeRoutes);

/**
 * Salary API
 *
 * /api/v1/salaries/*
 */
router.use('/salaries', salaryRoutes);

/**
 * Analytics API
 *
 * /api/v1/analytics/*
 */
router.use('/analytics', analyticsRoutes);

/**
 * Reference data API
 *
 * /api/v1/countries
 * /api/v1/departments
 * /api/v1/roles
 */
router.use('/', referenceRoutes);

/**
 * Health API
 *
 * /api/v1/health
 */
router.use('/health', healthRoutes);

export default router;
