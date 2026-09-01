import { beforeEach, describe, expect, it, vi } from 'vitest';

import { employeesApi } from '@/features/employees/api/employees-api';

const fetchMock = vi.fn();

vi.stubGlobal('fetch', fetchMock);

function createResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

describe('employeesApi', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('requests paginated employees', async () => {
    fetchMock.mockResolvedValueOnce(
      createResponse({
        data: [],
        pagination: {
          page: 1,
          pageSize: 25,
          total: 0,
          totalPages: 0,
        },
      }),
    );

    await employeesApi.getEmployees({
      search: 'Matthew',
      countryId: 1,
      departmentId: 2,
      roleId: 3,
      page: 1,
      pageSize: 25,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/v1/employees?'),
      expect.objectContaining({
        method: 'GET',
      }),
    );

    const url = fetchMock.mock.calls[0][0] as string;

    expect(url).toContain('search=Matthew');

    expect(url).toContain('countryId=1');

    expect(url).toContain('departmentId=2');

    expect(url).toContain('roleId=3');

    expect(url).toContain('page=1');

    expect(url).toContain('pageSize=25');
  });

  it('loads countries', async () => {
    fetchMock.mockResolvedValueOnce(
      createResponse([
        {
          id: 1,
          name: 'Nigeria',
        },
      ]),
    );

    const result = await employeesApi.getCountries();

    expect(result).toEqual([
      {
        id: 1,
        name: 'Nigeria',
      },
    ]);
  });

  it('loads departments', async () => {
    fetchMock.mockResolvedValueOnce(
      createResponse([
        {
          id: 1,
          name: 'Engineering',
        },
      ]),
    );

    const result = await employeesApi.getDepartments();

    expect(result).toEqual([
      {
        id: 1,
        name: 'Engineering',
      },
    ]);
  });

  it('loads roles', async () => {
    fetchMock.mockResolvedValueOnce(
      createResponse([
        {
          id: 1,
          name: 'Software Engineer',
        },
      ]),
    );

    const result = await employeesApi.getRoles();

    expect(result).toEqual([
      {
        id: 1,
        name: 'Software Engineer',
      },
    ]);
  });

  it('returns a meaningful API error', async () => {
    fetchMock.mockResolvedValueOnce(
      createResponse(
        {
          message: 'Employee service unavailable',
        },
        503,
      ),
    );

    await expect(employeesApi.getCountries()).rejects.toThrow('Employee service unavailable');
  });
});
