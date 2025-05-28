function ContentShimmer() {
  return (
    <div className="flex flex-wrap justify-center md:justify-start gap-6 p-6 dark:bg-neutral-900 bg-white min-h-screen">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="w-80 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 animate-pulse"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-neutral-700"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 bg-slate-200 dark:bg-neutral-700 rounded"></div>
              <div className="h-3 w-1/2 bg-slate-200 dark:bg-neutral-700 rounded"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 w-full bg-slate-200 dark:bg-neutral-700 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-200 dark:bg-neutral-700 rounded"></div>
            <div className="h-3 w-2/3 bg-slate-200 dark:bg-neutral-700 rounded"></div>
            <div className="h-3 w-3/4 bg-slate-200 dark:bg-neutral-700 rounded"></div>
            <div className="h-3 w-4/6 bg-slate-200 dark:bg-neutral-700 rounded"></div>
            <div className="h-3 w-1/3 bg-slate-200 dark:bg-neutral-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ContentShimmer;
