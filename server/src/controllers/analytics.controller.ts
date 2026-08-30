
// server/src/controllers/analytics.controller.ts

import type { Request, Response } from 'express';

import { analyticsService } from '../services/analytics.service';
import { analyticsQuerySchema } from '../schemas/analytics.schema';
import { ValidationError } from '../lib/errors';
import type { AnalyticsFilters } from '../types/analytics';

function parseFilters(request: Request): AnalyticsFilters {
  const result = analyticsQuerySchema.safeParse(request.query);

  if (!result.success) {
    throw new ValidationError(
      'Invalid analytics query parameters.',
      result.error.flatten(),
    );
  }

  const filters: AnalyticsFilters = {};

  if (result.data.countryCode !== undefined) {
    filters.countryCode = result.data.countryCode;
  }

  if (result.data.department !== undefined) {
    filters.department = result.data.department;
  }

  if (result.data.role !== undefined) {
    filters.role = result.data.role;
  }

  if (result.data.currency !== undefined) {
    filters.currency = result.data.currency;
  }

  return filters;
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

    const result = await analyticsService.getOverview(filters);

    sendAnalyticsResponse(response, result);
  }

  async distribution(
    request: Request,
    response: Response,
  ): Promise<void> {
    const filters = parseFilters(request);

    const result = await analyticsService.getDistribution(filters);

    sendAnalyticsResponse(response, result);
  }

  async countries(
    request: Request,
    response: Response,
  ): Promise<void> {
    const filters = parseFilters(request);

    const result = await analyticsService.getCountries(filters);

    sendAnalyticsResponse(response, result);
  }

  async departments(
    request: Request,
    response: Response,
  ): Promise<void> {
    const filters = parseFilters(request);

    const result = await analyticsService.getDepartments(filters);

    sendAnalyticsResponse(response, result);
  }

  async roles(
    request: Request,
    response: Response,
  ): Promise<void> {
    const filters = parseFilters(request);

    const result = await analyticsService.getRoles(filters);

    sendAnalyticsResponse(response, result);
  }
}

export const analyticsController = new AnalyticsController();
