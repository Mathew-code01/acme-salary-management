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

router.get(
  '/',
  validate({
    query: salaryListQuerySchema,
  }),
  salaryController.list.bind(salaryController),
);

router.get(
  '/:id',
  validate({
    params: salaryIdParamSchema,
  }),
  salaryController.getById.bind(salaryController),
);

router.post(
  '/',
  validate({
    body: createSalarySchema,
  }),
  salaryController.create.bind(salaryController),
);

router.patch(
  '/:id',
  validate({
    params: salaryIdParamSchema,
    body: updateSalarySchema,
  }),
  salaryController.update.bind(salaryController),
);

router.delete(
  '/:id',
  validate({
    params: salaryIdParamSchema,
  }),
  salaryController.delete.bind(salaryController),
);

export default router;
