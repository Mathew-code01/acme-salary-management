// server/src/routes/analytics.routes.ts

import { Router } from 'express';

import { analyticsController } from '../controllers/analytics.controller';

const router = Router();

/**
 * GET /analytics/overview
 *
 * Compensation overview and currency-aware payroll summaries.
 */
router.get('/overview', analyticsController.overview.bind(analyticsController));

/**
 * GET /analytics/distribution
 *
 * Salary distribution buckets.
 */
router.get('/distribution', analyticsController.distribution.bind(analyticsController));

/**
 * GET /analytics/countries
 *
 * Compensation analysis grouped by country.
 */
router.get('/countries', analyticsController.countries.bind(analyticsController));

/**
 * GET /analytics/departments
 *
 * Compensation analysis grouped by department.
 */
router.get('/departments', analyticsController.departments.bind(analyticsController));

/**
 * GET /analytics/roles
 *
 * Compensation analysis grouped by role.
 */
router.get('/roles', analyticsController.roles.bind(analyticsController));

export default router;
