export const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div>
      {eyebrow && <p className="text-xs font-black uppercase tracking-wide text-nova-600 dark:text-nova-500">{eyebrow}</p>}
      <h1 className="mt-1 text-2xl font-black text-slate-950 dark:text-white md:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
  </div>
);
