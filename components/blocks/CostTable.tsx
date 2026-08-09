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
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">
              Indicative annual study costs in US dollars, by university type
            </caption>
            <thead className="bg-[var(--paper-raised)] font-mono text-[0.8125rem] uppercase tracking-[0.04em] text-[var(--slate)] border-b border-[var(--rule)]">
              <tr>
                <th scope="col" className="px-6 py-4 font-normal">
                  <span className="sr-only">Cost type</span>
                </th>
                <th scope="col" className="px-6 py-4 font-normal text-right">
                  State university
                </th>
                <th scope="col" className="px-6 py-4 font-normal text-right">
                  Private university
                </th>
                <th scope="col" className="px-6 py-4 font-normal text-right">
                  Private, Medicine
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rule)]">
              {bands.map((band) => (
                <tr key={band.label} className="transition-colors hover:bg-[var(--sand)]">
                  <th
                    scope="row"
                    className="px-6 py-4 text-[var(--ink)] font-medium text-left"
                  >
                    {band.label}
                  </th>
                  <td className="px-6 py-4 font-mono text-right text-[var(--ink-soft)]">
                    {band.state}
                  </td>
                  <td className="px-6 py-4 font-mono text-right text-[var(--ink-soft)]">
                    {band.private}
                  </td>
                  <td className="px-6 py-4 font-mono text-right text-[var(--ink-soft)]">
                    {band.medicine}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[var(--rule)] bg-[var(--paper-raised)] px-6 py-4">
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
