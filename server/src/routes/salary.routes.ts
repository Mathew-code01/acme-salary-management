// server/src/routes/salary.routes.ts

import { Router } from 'express';

import { salaryController } from '../controllers/salary.controller';

import { validate } from '../middleware/validation';

import {
  createSalarySchema,
  salaryIdParamSchema,
  salaryListQuerySchema,
  updateSalarySchema,
} from '../schemas/salary.schema';

import { employeeIdParamSchema } from '../schemas/employee.schema';

const router = Router();

/**
 * GET /api/v1/salary
 *
 * List salary records.
 */
router.get(
  '/',
  validate({
    query: salaryListQuerySchema,
  }),
  salaryController.list.bind(salaryController),
);

/**
 * GET /api/v1/salary/employee/:employeeId
 *
 * Get the salary record belonging to an employee.
 *
 * This route must appear before /:id so "employee" is not
 * interpreted as a salary record ID.
 */
router.get(
  '/employee/:employeeId',
  validate({
    params: employeeIdParamSchema,
  }),
  salaryController.getByEmployeeId.bind(salaryController),
);

/**
 * GET /api/v1/salary/:id
 *
 * Get one salary record by its primary key.
 */
router.get(
  '/:id',
  validate({
    params: salaryIdParamSchema,
  }),
  salaryController.getById.bind(salaryController),
);

/**
 * POST /api/v1/salary
 *
 * Create a salary record.
 */
router.post(
  '/',
  validate({
    body: createSalarySchema,
  }),
  salaryController.create.bind(salaryController),
);

/**
 * PATCH /api/v1/salary/:id
 *
 * Update a salary record.
 */
router.patch(
  '/:id',
  validate({
    params: salaryIdParamSchema,
    body: updateSalarySchema,
  }),
  salaryController.update.bind(salaryController),
);

/**
 * DELETE /api/v1/salary/:id
 *
 * Delete a salary record.
 */
router.delete(
  '/:id',
  validate({
    params: salaryIdParamSchema,
  }),
  salaryController.delete.bind(salaryController),
);

export default router;
