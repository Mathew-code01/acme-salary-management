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

const router = Router();

/**
 * GET /api/v1/salaries
 */
router.get(
  '/',
  validate({
    query: salaryListQuerySchema,
  }),
  salaryController.list.bind(salaryController),
);

/**
 * GET /api/v1/salaries/employee/:employeeId
 *
 * IMPORTANT:
 * This must appear before /:id.
 */
router.get(
  '/employee/:employeeId',
  validate({
    params: salaryIdParamSchema.extend({
      employeeId: salaryIdParamSchema.shape.id,
    }),
  }),
  salaryController.getByEmployeeId.bind(salaryController),
);

/**
 * GET /api/v1/salaries/:id
 */
router.get(
  '/:id',
  validate({
    params: salaryIdParamSchema,
  }),
  salaryController.getById.bind(salaryController),
);

/**
 * POST /api/v1/salaries
 */
router.post(
  '/',
  validate({
    body: createSalarySchema,
  }),
  salaryController.create.bind(salaryController),
);

/**
 * PATCH /api/v1/salaries/:id
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
 * DELETE /api/v1/salaries/:id
 */
router.delete(
  '/:id',
  validate({
    params: salaryIdParamSchema,
  }),
  salaryController.delete.bind(salaryController),
);

export default router;