import clsx from "clsx";
export function Card({ children, className }: { children: React.ReactNode; className?: string }) { return <div className={clsx("rounded-lg border border-ink-800 bg-ink-900/60 p-5", className)}>{children}</div>; }
