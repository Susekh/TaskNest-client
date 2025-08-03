import {
  Check,
  Users,
  Zap,
  Calendar,
  Target,
  Layers,
  Clock,
  Plus,
  BarChart3,
  LucideIcon,
} from "lucide-react";

const featureList = [
  { id: 1, content: "Setup in Under 60 Seconds", icon: Zap },
  { id: 2, content: "Smart Sprint Planning", icon: Target },
  { id: 3, content: "Dynamic Kanban Boards", icon: Layers },
  { id: 4, content: "Deadline Tracking", icon: Clock },
  { id: 5, content: "Team Task Assignment", icon: Users },
];

const capabilities: {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}[] = [
  {
    id: 1,
    title: "Lightning Setup",
    description:
      "Get your team up and running in minutes. Pre-built templates, smart defaults, and guided onboarding.",
    icon: Zap,
    color: "emerald",
  },
  {
    id: 2,
    title: "Sprint Management",
    description:
      "Plan, track, and deliver sprints efficiently. Built-in velocity tracking and burndown charts.",
    icon: Target,
    color: "blue",
  },
  {
    id: 3,
    title: "Task Assignment",
    description:
      "Assign tasks with clear ownership, priorities, and due dates.",
    icon: Users,
    color: "purple",
  },
  {
    id: 4,
    title: "Kanban Boards",
    description:
      "Visualize workflow with drag-and-drop boards. Customize columns and automate transitions.",
    icon: Layers,
    color: "orange",
  },
  {
    id: 5,
    title: "Deadline Management",
    description:
      "Stay on top of deadlines with smart notifications, calendar integration, and progress tracking.",
    icon: Calendar,
    color: "red",
  },
  {
    id: 6,
    title: "Performance Analytics",
    description:
      "Track team productivity, identify bottlenecks, and optimize workflow.",
    icon: BarChart3,
    color: "indigo",
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
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans text-black dark:text-white px-6 py-12">
      <div className="max-w-6xl mx-auto space-y-20">

        {/* Key Features */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Key Features</h2>
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
            {featureList.map((f) => (
              <div
                key={f.id}
                className="bg-gray-100 dark:bg-[#1e2124] border border-gray-300 dark:border-[#40474f] p-6 rounded-lg hover:scale-105 transform transition duration-100"
              >
                <f.icon className="w-6 h-6 mb-4 text-gray-800 dark:text-white" />
                <p className="text-lg text-black dark:text-white">{f.content}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Steps */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {workflowSteps.map((ws) => (
              <div
                key={ws.step}
                className="bg-gray-100 dark:bg-[#1e2124] border border-gray-300 dark:border-[#40474f] rounded-xl p-6 text-center hover:scale-105 transition-transform duration-100 shadow hover:shadow-xl"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-300 dark:bg-[#2c3035] flex items-center justify-center">
                  <ws.icon className="w-8 h-8 text-gray-800 dark:text-white" />
                </div>
                <span className="block text-[#3b82f6] font-bold mb-2">
                  {ws.step}
                </span>
                <h3 className="text-xl font-semibold mb-1 text-black dark:text-white">
                  {ws.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {ws.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section>
          <h2 className="text-3xl font-bold mb-8 text-center">Platform Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((c) => (
              <div
                key={c.id}
                className="bg-gray-100 dark:bg-[#1e2124] border border-gray-300 dark:border-[#40474f] p-6 rounded-lg hover:shadow-lg hover:scale-[1.02] transition duration-100"
              >
                <div
                  className={`w-12 h-12 mb-4 flex items-center justify-center rounded-xl bg-${c.color}-600 dark:bg-${c.color}-500`}
                >
                  <c.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">
                  {c.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
