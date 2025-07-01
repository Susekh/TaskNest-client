export default function PricingSection() {
  return (
    <section className="max-w-xl my-20 mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        One-Time Pricing
      </h2>
      <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
        Pay once and unlock unlimited power for your projects.
      </p>

      <div className="inline-block bg-gray-100 dark:bg-gray-800 rounded-lg px-8 py-6 mb-6">
        <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
          ₹700
        </span>
        <span className="text-lg font-medium text-gray-700 dark:text-gray-400 ml-1">
          one-time fee
        </span>
      </div>

      <ul className="text-left max-w-md mx-auto px-20 mb-8 space-y-4 text-gray-800 dark:text-gray-300">
        <li>✅ Create unlimited sprints</li>
        <li>✅ Unlimited columns and tasks</li>
        <li>✅ AI-powered sprint board creation</li>
      </ul>

    </section>
  );
}
