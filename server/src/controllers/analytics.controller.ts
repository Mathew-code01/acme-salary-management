
// server/src/controllers/analytics.controller.ts


import type { Request, Response } from 'express';

import { analyticsService } from '../services/analytics.service';
import { analyticsQuerySchema } from '../schemas/analytics.schema';
import { ValidationError } from '../lib/errors';

function parseFilters(request: Request) {
  const result = analyticsQuerySchema.safeParse(request.query);

  if (!result.success) {
    throw new ValidationError(
      'Invalid analytics query parameters.',
      result.error.flatten(),
    );
  }

  const {
    countryCode,
    department,
    role,
    currency,
  } = result.data;

  return {
    ...(countryCode !== undefined ? { countryCode } : {}),
    ...(department !== undefined ? { department } : {}),
    ...(role !== undefined ? { role } : {}),
    ...(currency !== undefined ? { currency } : {}),
  };
}

function sendAnalyticsResponse<T>(
  response: Response,
  data: T,
): void {
  response.status(200).json({
    data,

    meta: {
      generatedAt: new Date().toISOString(),
    },
  });
}

export class AnalyticsController {
  async overview(
    request: Request,
    response: Response,
  ): Promise<void> {
    const filters = parseFilters(request);

    const result =
      await analyticsService.getOverview(filters);

    sendAnalyticsResponse(response, result);
  }

  async distribution(
    request: Request,
    response: Response,
  ): Promise<void> {
    const filters = parseFilters(request);

    const result =
      await analyticsService.getDistribution(filters);

    sendAnalyticsResponse(response, result);
  }

  async countries(
    request: Request,
    response: Response,
  ): Promise<void> {
    const filters = parseFilters(request);

    const result =
      await analyticsService.getCountries(filters);

    sendAnalyticsResponse(response, result);
  }

  async departments(
    request: Request,
    response: Response,
  ): Promise<void> {
    const filters = parseFilters(request);

    const result =
      await analyticsService.getDepartments(filters);

    sendAnalyticsResponse(response, result);
  }

  async roles(
    request: Request,
    response: Response,
  ): Promise<void> {
    const filters = parseFilters(request);

    const result =
      await analyticsService.getRoles(filters);

    sendAnalyticsResponse(response, result);
  }
}

export const analyticsController =
  new AnalyticsController();
