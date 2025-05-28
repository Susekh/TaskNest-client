function ChatShimmer() {
  return (
    <div className="flex h-screen w-full dark:bg-neutral-900 bg-white animate-pulse">
      {/* Sidebar */}
      <div className="w-64 border-r border-neutral-200 dark:border-neutral-800 p-4 space-y-4">
        <div className="h-6 w-3/4 bg-slate-200 dark:bg-neutral-700 rounded"></div>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-1/2 bg-slate-200 dark:bg-neutral-700 rounded"></div>
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-neutral-700 rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
          <div className="h-6 w-1/3 bg-slate-200 dark:bg-neutral-700 rounded"></div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {[...Array(7)].map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
              <div className="max-w-xs">
                <div className={`p-3 rounded-xl bg-slate-200 dark:bg-neutral-700 ${i % 2 === 0 ? 'rounded-tl-none' : 'rounded-tr-none'}`}>
                  <div className="h-4 w-32 bg-slate-300 dark:bg-neutral-600 rounded mb-2"></div>
                  <div className="h-3 w-20 bg-slate-300 dark:bg-neutral-600 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4">
          <div className="h-10 w-full bg-slate-200 dark:bg-neutral-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}

export default ChatShimmer;
