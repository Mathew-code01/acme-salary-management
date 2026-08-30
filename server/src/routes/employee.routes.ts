// server/src/routes/employee.routes.ts

import { Router } from 'express';

import {
  validate,
} from '../middleware/validation';

import {
  employeeController,
} from '../controllers/employee.controller';

import {
  employeeIdParamSchema,
  employeeListQuerySchema,
  createEmployeeSchema,
  updateEmployeeSchema,
} from '../schemas/employee.schema';

const router = Router();

/**
 * GET /api/v1/employees
 *
 * List employees with:
 * - search
 * - filtering
 * - pagination
 * - sorting
 */
router.get(
  '/',
  validate({
    query: employeeListQuerySchema,
  }),
  employeeController.list.bind(employeeController),
);

/**
 * GET /api/v1/employees/:id
 *
 * Get one employee.
 */
router.get(
  '/:id',
  validate({
    params: employeeIdParamSchema,
  }),
  employeeController.getById.bind(
    employeeController,
  ),
);

/**
 * POST /api/v1/employees
 *
 * Create an employee.
 */
router.post(
  '/',
  validate({
    body: createEmployeeSchema,
  }),
  employeeController.create.bind(
    employeeController,
  ),
);

/**
 * PATCH /api/v1/employees/:id
 *
 * Update an employee.
 */
router.patch(
  '/:id',
  validate({
    params: employeeIdParamSchema,
    body: updateEmployeeSchema,
  }),
  employeeController.update.bind(
    employeeController,
  ),
);

/**
 * DELETE /api/v1/employees/:id
 *
 * Delete an employee.
 */
router.delete(
  '/:id',
  validate({
    params: employeeIdParamSchema,
  }),
  employeeController.delete.bind(
    employeeController,
  ),
);

export default router;