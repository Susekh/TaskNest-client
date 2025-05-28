function AuthShimmer() {
  return (
    <div className="flex justify-center items-center min-h-screen p-6 dark:bg-neutral-900 bg-white">
      <div className="w-full max-w-sm p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm animate-pulse">
        {/* Logo / Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-neutral-700"></div>
        </div>

        {/* Title */}
        <div className="h-6 w-2/3 mx-auto mb-8 bg-slate-200 dark:bg-neutral-700 rounded"></div>

        {/* Input Fields */}
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <div className="h-3 w-1/4 bg-slate-200 dark:bg-neutral-700 rounded"></div>
            <div className="h-10 w-full bg-slate-200 dark:bg-neutral-700 rounded-md"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-1/4 bg-slate-200 dark:bg-neutral-700 rounded"></div>
            <div className="h-10 w-full bg-slate-200 dark:bg-neutral-700 rounded-md"></div>
          </div>
        </div>

        {/* Button */}
        <div className="h-10 w-full bg-slate-200 dark:bg-neutral-700 rounded-md mb-4"></div>

        {/* Footer Text */}
        <div className="space-y-2">
          <div className="h-3 w-1/2 bg-slate-200 dark:bg-neutral-700 rounded mx-auto"></div>
          <div className="h-3 w-1/3 bg-slate-200 dark:bg-neutral-700 rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default AuthShimmer;
