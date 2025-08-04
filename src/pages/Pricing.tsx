export default function PricingSection() {
  return (
    <section className="w-full flex justify-center py-24 px-4 bg-white dark:bg-neutral-900">
      <div className="max-w-2xl w-full border border-gray-200 dark:border-gray-800 rounded-2xl p-10 bg-[#F9FAFB] dark:bg-gray-950  text-center">
        <h2 className="text-3xl font-semibold text-gray-900 dark:text-white mb-4">
          Simple, One-Time Pricing
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
          Get lifetime access to everything with a single payment.
        </p>

        <div className="mb-8">
          <div className="inline-flex items-baseline space-x-2">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">
              ₹700
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              one-time payment
            </span>
          </div>
        </div>

        <ul className="text-left text-sm text-gray-700 dark:text-gray-300 space-y-4 mb-10 max-w-sm mx-auto">
          <li className="flex items-start space-x-3">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>Unlimited sprint creation</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>Unlimited columns and tasks</span>
          </li>
          <li className="flex items-start space-x-3">
            <span className="text-blue-600 dark:text-blue-400">✓</span>
            <span>AI-powered sprint board generator</span>
          </li>
        </ul>

        <button className="mt-2 px-6 py-3 text-sm font-medium bg-gray-800 hover:bg-blue-950 text-white rounded-lg transition">
          Get Started
        </button>
      </div>
    </section>
  );
}
