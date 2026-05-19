export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-4 md:p-8 flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary-light)] dark:text-[var(--color-text-secondary-dark)]">
          This page is currently under construction.
        </p>
      </div>
    </div>
  );
}
