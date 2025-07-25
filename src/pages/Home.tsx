import {
  Check,
  ArrowRight,
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
import { Link } from "react-router-dom";

const featureList = [
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
}[] = [
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

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#121416] font-sans text-black dark:text-white flex flex-col">
      {/* Main Content */}
      <main className="flex-grow px-10 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <div className="relative h-96 rounded-xl bg-gradient-to-br from-black via-gray-900 to-[#0a0a0a] mb-12 flex flex-col justify-end p-8 animate-fade-in">
            <h1 className="text-4xl font-black mb-4 animate-slide-up delay-100 text-white">
              Welcome to TaskNet
            </h1>
            <p className="text-base mb-6 animate-slide-up delay-200 text-gray-300">
              Manage your projects efficiently with our intuitive platform.
              Track progress, assign tasks, and collaborate seamlessly with your
              team.
            </p>
            <Link
              to="/dashboard"
              className="transition-all duration-300 bg-[#b2cae5] hover:bg-[#d3e4f7] active:scale-95 text-[#121416] font-bold rounded-full px-5 py-2 shadow-md hover:shadow-lg inline-flex items-center gap-2 self-start"
            >
              Get Started
            </Link>
          </div>

          {/* Key Features */}
          <section className="mb-16 animate-fade-in delay-200">
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
              Key Features
            </h2>
            <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
              {featureList.map((f) => (
                <div
                  key={f.id}
                  className="bg-gray-100 dark:bg-[#1e2124] border border-gray-300 dark:border-[#40474f] p-6 rounded-lg hover:scale-105 transform transition duration-300"
                >
                  <f.icon className="w-6 h-6 mb-4 text-gray-800 dark:text-white" />
                  <p className="text-lg text-black dark:text-white">
                    {f.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow Steps */}
          <section className="mb-16 animate-fade-in delay-300">
            <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
              Get Started in 3 Simple Steps
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {workflowSteps.map((ws) => (
                <div
                  key={ws.step}
                  className="bg-gray-100 dark:bg-[#1e2124] border border-gray-300 dark:border-[#40474f] rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300 shadow hover:shadow-xl"
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
          <section className="mb-16 animate-fade-in delay-400">
            <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">
              Everything You Need to Succeed
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map((c) => (
                <div
                  key={c.id}
                  className="bg-gray-100 dark:bg-[#1e2124] border border-gray-300 dark:border-[#40474f] p-6 rounded-lg hover:shadow-lg hover:scale-[1.02] transition duration-300"
                >
                  <div
                    className={`w-12 h-12 mb-4 flex items-center justify-center rounded-xl`}
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

          {/* CTA */}
          <section className="text-center py-12 animate-fade-in delay-500">
            <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">
              Ready to Transform Your Team's Productivity?
            </h2>
            <Link
              to="/dashboard"
              className="transition-all duration-300 bg-[#b2cae5] hover:bg-[#d3e4f7] active:scale-95 text-[#121416] font-bold rounded-full px-6 py-3 inline-flex items-center gap-2 shadow-xl"
            >
              Get Started Now
              <ArrowRight className="inline-block w-5 h-5" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
