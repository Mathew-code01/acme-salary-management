
// server/src/controllers/salary.controller.ts

import type {
  NextFunction,
  Request,
  Response,
} from 'express';

import { salaryService } from '../services/salary.service';

import {
  createSalarySchema,
  salaryIdParamSchema,
  salaryListQuerySchema,
  updateSalarySchema,
} from '../schemas/salary.schema';

import type {
  CreateSalaryInput,
  SalaryListQuery,
  UpdateSalaryInput,
} from '../types/salary';

export class SalaryController {
  /**
   * GET /api/salaries
   */
  async list(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const parsedQuery =
        salaryListQuerySchema.parse(req.query);

      const query: SalaryListQuery = {
        page: parsedQuery.page,
        limit: parsedQuery.limit,
        sortBy: parsedQuery.sortBy,
        sortOrder: parsedQuery.sortOrder,
      };

      if (parsedQuery.employeeId !== undefined) {
        query.employeeId = parsedQuery.employeeId;
      }

      if (parsedQuery.currency !== undefined) {
        query.currency = parsedQuery.currency;
      }

      if (parsedQuery.minAmountCents !== undefined) {
        query.minAmountCents =
          parsedQuery.minAmountCents;
      }

      if (parsedQuery.maxAmountCents !== undefined) {
        query.maxAmountCents =
          parsedQuery.maxAmountCents;
      }

      if (parsedQuery.effectiveFrom !== undefined) {
        query.effectiveFrom =
          parsedQuery.effectiveFrom;
      }

      if (parsedQuery.search !== undefined) {
        query.search = parsedQuery.search;
      }

      const result = await salaryService.list(query);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * GET /api/salaries/:id
   */
  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } =
        salaryIdParamSchema.parse(req.params);

      const salary =
        await salaryService.getById(id);

      res.status(200).json({
        success: true,
        data: salary,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * POST /api/salaries
   */
  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const parsedInput =
        createSalarySchema.parse(req.body);

      const input: CreateSalaryInput = {
        employeeId: parsedInput.employeeId,
        amountCents: parsedInput.amountCents,
        currency: parsedInput.currency,
        effectiveFrom: parsedInput.effectiveFrom,
      };

      const salary =
        await salaryService.create(input);

      res.status(201).json({
        success: true,
        data: salary,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * PATCH /api/salaries/:id
   */
  async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } =
        salaryIdParamSchema.parse(req.params);

      const parsedInput =
        updateSalarySchema.parse(req.body);

      const input: UpdateSalaryInput = {};

      if (parsedInput.amountCents !== undefined) {
        input.amountCents =
          parsedInput.amountCents;
      }

      if (parsedInput.currency !== undefined) {
        input.currency =
          parsedInput.currency;
      }

      if (parsedInput.effectiveFrom !== undefined) {
        input.effectiveFrom =
          parsedInput.effectiveFrom;
      }

      const salary =
        await salaryService.update(id, input);

      res.status(200).json({
        success: true,
        data: salary,
      });
    } catch (error: unknown) {
      next(error);
    }
  }

  /**
   * DELETE /api/salaries/:id
   */
  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } =
        salaryIdParamSchema.parse(req.params);

      const result =
        await salaryService.delete(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: unknown) {
      next(error);
    }
  }
}

export const salaryController =
  new SalaryController();
