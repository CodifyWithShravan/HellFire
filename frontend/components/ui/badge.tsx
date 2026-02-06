import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-slate-600 bg-slate-700/80 text-slate-200",
        cost: "border-amber-500/50 bg-amber-500/10 text-amber-400",
        growth: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
        neutral: "border-cyan-500/50 bg-cyan-500/10 text-cyan-400",
        outline: "border-slate-500 text-slate-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
