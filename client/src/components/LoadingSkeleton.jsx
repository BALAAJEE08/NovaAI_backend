export const LoadingSkeleton = ({ rows = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div className="h-20 animate-pulse rounded-lg bg-slate-200 dark:bg-white/10" key={index} />
    ))}
  </div>
);
