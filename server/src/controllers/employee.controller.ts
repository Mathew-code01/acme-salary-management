// server/src/controllers/employee.controller.ts

import type {
  NextFunction,
  Request,
  Response,
} from 'express';

import {
  successResponse,
} from '../lib/response';

import {
  employeeService,
} from '../services/employee.service';

import type {
  CreateEmployeeInput,
  EmployeeListQuery,
  UpdateEmployeeInput,
} from '../types/employee';

export class EmployeeController {
  async list(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query =
        req.query as unknown as EmployeeListQuery;

      const result =
        await employeeService.list(query);

      res.status(200).json(
        successResponse(result),
      );
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      const employee =
        await employeeService.getById(id);

      res.status(200).json(
        successResponse(employee),
      );
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const input =
        req.body as CreateEmployeeInput;

      const employee =
        await employeeService.create(input);

      res.status(201).json(
        successResponse(employee),
      );
    } catch (error) {
      next(error);
    }
  }

  async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      const input =
        req.body as UpdateEmployeeInput;

      const employee =
        await employeeService.update(
          id,
          input,
        );

      res.status(200).json(
        successResponse(employee),
      );
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = Number(req.params.id);

      const deleted =
        await employeeService.delete(id);

      res.status(200).json(
        successResponse({
          id: deleted.id,
          employeeCode:
            deleted.employeeCode,
        }),
      );
    } catch (error) {
      next(error);
    }
  }
}

export const employeeController =
  new EmployeeController();