// client/src/app/route-config.tsx

import type { RouteObject } from "react-router-dom";

import { AppShell } from "../components/layout/AppShell";

import DashboardPage from "../pages/DashboardPage";
import EmployeesPage from "../pages/EmployeesPage";
import EmployeeDetailsPage from "../pages/EmployeeDetailsPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import NotFoundPage from "../pages/NotFoundPage";
import ErrorPage from "../pages/ErrorPage";

export const routeConfig: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "employees",
        element: <EmployeesPage />,
      },
      {
        path: "employees/:employeeId",
        element: <EmployeeDetailsPage />,
      },
      {
        path: "analytics",
        element: <AnalyticsPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
];
