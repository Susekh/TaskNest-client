function AuthShimmer() {
  return (
    <div className="p-8 dark:bg-neutral-900">
      <div className="border border-neutral-300 dark:border-neutral-700 shadow rounded-md p-12 max-w-sm w-full mx-auto bg-white dark:bg-neutral-900">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-8 bg-slate-200 dark:bg-neutral-700 rounded"></div>
              <div className="h-8 bg-slate-200 dark:bg-neutral-700 rounded"></div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 dark:bg-neutral-700 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 dark:bg-neutral-700 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 dark:bg-neutral-700 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 dark:bg-neutral-700 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 dark:bg-neutral-700 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 dark:bg-neutral-700 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 dark:bg-neutral-700 rounded col-span-1"></div>
                <div className="h-2 bg-slate-200 dark:bg-neutral-700 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-neutral-700 rounded"></div>
            </div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-slate-200 dark:bg-neutral-700 rounded"></div>
              <div className="h-4 bg-slate-200 dark:bg-neutral-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthShimmer;
