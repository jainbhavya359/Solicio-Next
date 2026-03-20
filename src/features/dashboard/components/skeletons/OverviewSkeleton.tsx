export default function OverviewSkeleton() {
  return (
    <div className="space-y-6 sm:space-y-8 w-full min-w-0 animate-pulse mt-6 sm:mt-8">
      <div className="h-16 bg-slate-200 rounded-2xl w-full" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 rounded-2xl sm:rounded-3xl w-full" />
        ))}
      </div>
      <div className="h-40 bg-slate-200 rounded-2xl sm:rounded-3xl w-full" />
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
        <div className="h-64 bg-slate-200 rounded-2xl sm:rounded-3xl w-full" />
        <div className="h-64 bg-slate-200 rounded-2xl sm:rounded-3xl w-full" />
      </div>
      <div className="h-80 bg-slate-200 rounded-2xl sm:rounded-3xl w-full mt-10" />
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
        <div className="h-60 bg-slate-200 rounded-2xl sm:rounded-3xl w-full" />
        <div className="h-60 bg-slate-200 rounded-2xl sm:rounded-3xl w-full" />
      </div>
    </div>
  );
}
