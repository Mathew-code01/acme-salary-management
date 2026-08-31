// client/src/features/employees/components/EmployeeFilters.tsx


import type {
  EmployeeFilterOptions,
  EmployeeListFilters,
} from "../types/employee";

interface EmployeeFiltersProps {
  filters: EmployeeListFilters;
  options: EmployeeFilterOptions;
  isLoading?: boolean;

  onCountryChange: (value: number | null) => void;
  onDepartmentChange: (value: number | null) => void;
  onRoleChange: (value: number | null) => void;
}

interface FilterSelectProps {
  id: string;
  label: string;
  value: number | null;
  options: Array<{
    id: number;
    name: string;
  }>;
  disabled?: boolean;
  onChange: (value: number | null) => void;
}

function FilterSelect({
  id,
  label,
  value,
  options,
  disabled,
  onChange,
}: FilterSelectProps) {
  return (
    <div className="min-w-0 flex-1">
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-muted-foreground"
      >
        {label}
      </label>

      <select
        id={id}
        value={value === null ? "" : String(value)}
        disabled={disabled}
        onChange={(event) => {
          const nextValue = event.target.value;

          onChange(
            nextValue === "" ? null : Number(nextValue),
          );
        }}
        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <option value="">All {label.toLowerCase()}s</option>

        {options.map((option) => (
          <option
            key={option.id}
            value={option.id}
          >
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export function EmployeeFilters({
  filters,
  options,
  isLoading = false,
  onCountryChange,
  onDepartmentChange,
  onRoleChange,
}: EmployeeFiltersProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <FilterSelect
        id="employee-country"
        label="Country"
        value={filters.countryId}
        options={options.countries}
        disabled={isLoading}
        onChange={onCountryChange}
      />

      <FilterSelect
        id="employee-department"
        label="Department"
        value={filters.departmentId}
        options={options.departments}
        disabled={isLoading}
        onChange={onDepartmentChange}
      />

      <FilterSelect
        id="employee-role"
        label="Role"
        value={filters.roleId}
        options={options.roles}
        disabled={isLoading}
        onChange={onRoleChange}
      />
    </div>
  );
}