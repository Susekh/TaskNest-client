import {
  Check,
  Users,
  Zap,
  Calendar,
  Target,
  Layers,
  Plus,
  BarChart3,
  ArrowRight,
} from "lucide-react";

const featureList = [
  { id: 1, content: "Setup in Under 60 Seconds", icon: Zap, description: "Skip the complexity. One-click templates and guided setup get your team productive instantly." },
  { id: 2, content: "Smart Sprint Planning", icon: Target, description: "AI-powered sprint recommendations based on team velocity and historical data." },
  { id: 3, content: "Dynamic Kanban Boards", icon: Layers, description: "Drag, drop, and automate your way to perfect workflow visualization." },
];

const capabilities = [
  {
    id: 1,
    title: "Lightning Setup",
    description:
      "Get your team up and running in minutes. Pre-built templates, smart defaults, and guided onboarding.",
    icon: Zap,
  },
  {
    id: 2,
    title: "Sprint Management",
    description:
      "Plan, track, and deliver sprints efficiently. Built-in velocity tracking and burndown charts.",
    icon: Target,
  },
  {
    id: 3,
    title: "Task Assignment",
    description:
      "Assign tasks with clear ownership, priorities, and due dates.",
    icon: Users,
  },
  {
    id: 4,
    title: "Kanban Boards",
    description:
      "Visualize workflow with drag-and-drop boards. Customize columns and automate transitions.",
    icon: Layers,
  },
  {
    id: 5,
    title: "Deadline Management",
    description:
      "Stay on top of deadlines with smart notifications, calendar integration, and progress tracking.",
    icon: Calendar,
  },
  {
    id: 6,
    title: "Performance Analytics",
    description:
      "Track team productivity, identify bottlenecks, and optimize workflow.",
    icon: BarChart3,
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Quick Setup",
    description:
      "Choose a template or start fresh. Add your team members in seconds.",
    icon: Plus,
  },
  {
    step: "02",
    title: "Create Sprint",
    description:
      "Define sprint goals, duration, and break down work into manageable tasks.",
    icon: Target,
  },
  {
    step: "03",
    title: "Assign & Track",
    description:
      "Assign tasks to team members and watch progress in real-time on Kanban boards.",
    icon: Check,
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans text-black dark:text-white flex flex-col">
      <main className="flex-grow px-10 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">

          {/* Key Features Section */}
          <section className="my-20 w-full">
            {/* Header */}
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto mb-16">
              {/* Left Column */}
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  TaskNet Features
                </p>
                <h2 className="text-5xl font-semibold text-black dark:text-white leading-tight">
                  Everything you need to succeed
                </h2>
              </div>

              {/* Right Column */}
              <div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  Discover powerful features designed to streamline your workflow. 
                  From lightning-fast setup to advanced analytics, TaskNet provides 
                  all the tools your team needs to excel.
                </p>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-6xl">
              {featureList.map((f) => (
                <div
                  key={f.id}
                  className="bg-white shadow-md dark:bg-[#1e2124] border border-gray-200 dark:border-[#40474f] rounded-lg p-6 text-left hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-semibold text-black dark:text-white leading-tight">
                      {f.content}
                    </h3>
                    <f.icon className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {f.description}
                  </p>
                  <div className="mt-6">
                    <span className="inline-block text-black dark:text-white text-xl">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow Steps Section */}
          <section className="py-24">
            {/* Header - two-column layout */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 dark:text-white">
                Get Started in 3 Simple Steps
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 md:pl-12">
                Follow these quick milestones to launch your first project in
                minutes and keep momentum from day one.
              </p>
            </div>

            {/* 3-card grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-6 md:grid-cols-3">
              {workflowSteps.map((ws, i) => {
                const pastel = [
                  "bg-[#1e3a8a]/10 dark:bg-[#1e3a8a]/20",
                  "bg-[#1e40af]/10 dark:bg-[#1e40af]/20",
                  "bg-[#1e429f]/10 dark:bg-[#1e429f]/20",
                ][i % 3];

                return (
                  <article
                    key={ws.step}
                    className={`${pastel} rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-md transition`}
                  >
                    {/* Big step number */}
                    <span className="text-4xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                      {ws.step}
                    </span>

                    {/* Title & description */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {ws.title}
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-gray-300 flex-grow">
                      {ws.description}
                    </p>

                    {/* Arrow bottom-right */}
                    <ArrowRight className="w-5 h-5 self-end text-gray-900 dark:text-gray-100 mt-6" />
                  </article>
                );
              })}
            </div>
          </section>

          {/* Platform Capabilities Section */}
          <section className="py-24">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 dark:text-white">
                A full spectrum of capabilities
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 md:pl-12">
                Ready out-of-the-box solutions so you can plan, execute, and 
                iterate without switching tools. Everything your team needs 
                to deliver exceptional results.
              </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-6 lg:grid-cols-3 md:grid-cols-2">
              {capabilities.map((c, i) => {
                const pastel = [
                  "bg-[#1e3a8a]/10",
                  "bg-[#1e40af]/10",
                  "bg-[#1e429f]/10",
                  "bg-[#1e3a8a]/20",
                  "bg-[#1e40af]/20",
                  "bg-[#1e429f]/20",
                ][i % 6];

                return (
                  <article
                    key={c.id}
                    className={`${pastel} rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-md transition`}
                  >
                    {/* Icon top-left */}
                    <div className="w-10 h-10 mb-6 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                      <c.icon className="h-6 w-6" />
                    </div>

                    {/* Title & description */}
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {c.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
                      {c.description}
                    </p>

                    {/* Arrow bottom-right */}
                    <ArrowRight className="w-5 h-5 self-end text-gray-700 mt-6" />
                  </article>
                );
              })}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}