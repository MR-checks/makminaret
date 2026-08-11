import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * CostTable
 *
 * Rewritten to HANDOVER §4.3. It previously rendered a GHS/NGN fee table with
 * hardcoded local-currency figures, which §4.1 bans outright: rates move
 * weekly, and a stale rate on a costs page is the worst place to be wrong.
 *
 * This is a static USD band table carrying a visible review stamp. Bands are
 * wide on purpose, and the copy is explicit that they are ranges rather than
 * quotes. Local-currency totals are confirmed in consultation at the rate on
 * the day, which is both honest and a reason to start a conversation.
 */

export interface CostBand {
  label: string;
  state: string;
  private: string;
  medicine: string;
}

export interface CostTableProps extends React.HTMLAttributes<HTMLDivElement> {
  bands?: CostBand[];
  /** Rendered as "Figures reviewed <reviewedOn>". Comes from the content file. */
  reviewedOn: string;
}

const defaultBands: CostBand[] = [
  {
    label: "Tuition per year",
    state: "$400 to $1,500",
    private: "$3,500 to $9,000",
    medicine: "$12,000 to $25,000",
  },
  {
    label: "Living, per month",
    state: "$300 to $500",
    private: "$350 to $600",
    medicine: "$350 to $600",
  },
];

const CostTable = React.forwardRef<HTMLDivElement, CostTableProps>(
  ({ className, bands = defaultBands, reviewedOn, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full overflow-hidden rounded-md border border-[var(--rule)] bg-[var(--paper)]",
          className
        )}
        {...props}
      >
        {/*
          Two presentations of the same data. A four-column money table cannot
          fit a 320px screen, and the horizontal scrollbar it produced hid two
          of the three columns behind a gesture most people never make. Below
          sm it stacks into one block per cost type; from sm up it is the table.
        */}
        <div className="sm:hidden">
          {bands.map((band) => (
            <div
              key={band.label}
              className="border-b border-[var(--rule)] px-5 py-4 last:border-b-0"
            >
              <p className="font-sans font-medium text-[var(--ink)]">{band.label}</p>
              <dl className="mt-3 flex flex-col gap-2">
                {(
                  [
                    ["State university", band.state],
                    ["Private university", band.private],
                    ["Private, Medicine", band.medicine],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between gap-4">
                    <dt className="font-mono text-[0.75rem] uppercase tracking-[0.04em] text-[var(--slate)]">
                      {label}
                    </dt>
                    <dd className="text-right font-mono text-sm text-[var(--ink-soft)]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div className="hidden sm:block">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Indicative annual study costs in US dollars, by university type
            </caption>
            <thead className="bg-[var(--paper-raised)] font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-[var(--slate)] border-b border-[var(--rule)]">
              <tr>
                <th scope="col" className="px-4 py-4 font-normal md:px-6">
                  <span className="sr-only">Cost type</span>
                </th>
                <th scope="col" className="px-4 py-4 font-normal text-right md:px-6">
                  State university
                </th>
                <th scope="col" className="px-4 py-4 font-normal text-right md:px-6">
                  Private university
                </th>
                <th scope="col" className="px-4 py-4 font-normal text-right md:px-6">
                  Private, Medicine
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rule)]">
              {bands.map((band) => (
                <tr key={band.label} className="transition-colors hover:bg-[var(--sand)]">
                  <th
                    scope="row"
                    className="px-4 py-4 text-[var(--ink)] font-medium text-left md:px-6"
                  >
                    {band.label}
                  </th>
                  <td className="px-4 py-4 font-mono text-right text-[var(--ink-soft)] md:px-6">
                    {band.state}
                  </td>
                  <td className="px-4 py-4 font-mono text-right text-[var(--ink-soft)] md:px-6">
                    {band.private}
                  </td>
                  <td className="px-4 py-4 font-mono text-right text-[var(--ink-soft)] md:px-6">
                    {band.medicine}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[var(--rule)] bg-[var(--paper-raised)] px-5 py-4 md:px-6">
          <p className="font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-[var(--slate)]">
            Figures reviewed {reviewedOn}. Ranges, not quotes.
          </p>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            We confirm your exact total in cedis or naira during consultation, at the rate
            on the day.
          </p>
        </div>
      </div>
    );
  }
);
CostTable.displayName = "CostTable";

export { CostTable };
