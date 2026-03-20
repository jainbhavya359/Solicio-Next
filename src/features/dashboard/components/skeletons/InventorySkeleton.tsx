export default function InventorySkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 w-full min-w-0 animate-pulse mt-6 sm:mt-8">
      <div className="h-64 sm:h-80 bg-slate-200 rounded-2xl border border-stone-200 w-full" />
      <div className="flex gap-4">
        <div className="h-12 flex-1 bg-slate-200 rounded-xl" />
        <div className="h-12 flex-1 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-72 bg-slate-200 rounded-2xl border border-stone-200 w-full" />
      <div className="h-56 bg-slate-200 rounded-2xl border border-stone-200 w-full" />
      <div className="h-60 bg-slate-200 rounded-2xl border border-stone-200 w-full" />
    </div>
  );
}
