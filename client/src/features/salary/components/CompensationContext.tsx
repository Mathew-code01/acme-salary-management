import { Building2, Globe2, BriefcaseBusiness } from 'lucide-react';

interface CompensationContextProps {
  countryName?: string;
  departmentName?: string;
  roleName?: string;
}

export function CompensationContext({
  countryName,
  departmentName,
  roleName,
}: CompensationContextProps) {
  const items = [
    {
      label: 'Country',
      value: countryName,
      icon: Globe2,
    },
    {
      label: 'Department',
      value: departmentName,
      icon: Building2,
    },
    {
      label: 'Role',
      value: roleName,
      icon: BriefcaseBusiness,
    },
  ];

  return (
    <section
      aria-labelledby="compensation-context-heading"
      className="rounded-xl border border-border bg-card p-6"
    >
      <div>
        <h2 id="compensation-context-heading" className="text-base font-semibold text-foreground">
          Compensation context
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Organizational context associated with this compensation record.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <Icon aria-hidden="true" className="h-4 w-4 text-muted-foreground" />

              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </span>
            </div>

            <p className="mt-2 truncate text-sm font-medium text-foreground">
              {value || 'Not available'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
