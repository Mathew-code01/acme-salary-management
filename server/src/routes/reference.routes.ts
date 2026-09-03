// server/src/routes/reference.routes.ts

import { Router, type NextFunction, type Request, type Response } from 'express';

import { prisma } from '../lib/prisma.js';
import { successResponse } from '../lib/response.js';

const router = Router();

/**
 * GET /api/v1/countries
 */
router.get('/countries', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const countries = await prisma.country.findMany({
      orderBy: {
        name: 'asc',
      },

      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    response.status(200).json(
      successResponse(
        countries,
        request.requestId
          ? {
              requestId: request.requestId,
            }
          : undefined,
      ),
    );
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/departments
 */
router.get('/departments', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: {
        name: 'asc',
      },

      select: {
        id: true,
        name: true,
      },
    });

    response.status(200).json(
      successResponse(
        departments,
        request.requestId
          ? {
              requestId: request.requestId,
            }
          : undefined,
      ),
    );
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/roles
 */
router.get('/roles', async (request: Request, response: Response, next: NextFunction) => {
  try {
    const roles = await prisma.role.findMany({
      orderBy: {
        name: 'asc',
      },

      select: {
        id: true,
        name: true,
      },
    });

    response.status(200).json(
      successResponse(
        roles,
        request.requestId
          ? {
              requestId: request.requestId,
            }
          : undefined,
      ),
    );
  } catch (error) {
    next(error);
  }
});

export default router;
