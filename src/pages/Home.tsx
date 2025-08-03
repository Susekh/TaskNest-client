import DarkVeil from "@/components/ui/DarkVeil";
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
import ShinyText from "./ShinyText";

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
    <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans text-black dark:text-white flex flex-col">
      {/* Main Content */}
      <main className="flex-grow px-10 py-8 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {/* Hero Section */}
          <div className="h-[450px] relative">
            <DarkVeil hueShift={20} speed={1.5} />
            <div className="h-96 rounded-xl absolute top-0 mb-12 flex flex-col justify-end p-8">
              <h1 className="text-4xl font-black mb-4 animate-slide-up delay-100 text-white">
                Welcome to TaskNet
              </h1>
              <p className="text-base mb-6 animate-slide-up delay-200 text-gray-300">
                Manage your projects efficiently with our intuitive platform.
                Track progress, assign tasks, and collaborate seamlessly with
                your team.
              </p>
              <Link
                to="/dashboard"
                className="transition-all duration-300 bg-gray-800 hover:bg-gray-900 active:scale-95 font-bold rounded-full px-5 py-2 shadow-md hover:shadow-lg inline-flex items-center gap-2 self-start"
              >
                <ShinyText
                  text="Get Started"
                  disabled={false}
                  speed={3}
                  className="custom-class"
                />
              </Link>
            </div>
          </div>

          {/* Key Features */}
          <section className=" my-20 w-full">
            {/* Header */}
            <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto mb-16">
              {/* Left Column */}
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                  TaskNet
                </p>
                <h2 className="text-5xl font-semibold text-black dark:text-white leading-tight">
                  Built for marketing success
                </h2>
              </div>

              {/* Right Column */}
              <div>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  Built on a foundation of enterprise trust, TaskNet delivers
                  outputs fine-tuned to project management, with built-in
                  workflows and intuitive features that empower every team
                  member to move faster.
                </p>
                <Link
                  to="/dashboard"
                  className="transition-all duration-300 bg-gray-800 hover:bg-gray-900 active:scale-95 font-bold rounded-full px-5 py-2 shadow-md hover:shadow-lg inline-flex items-center gap-2 self-start"
                >
                  <ShinyText
                    text="Explore the platform"
                    disabled={false}
                    speed={3}
                    className="custom-class"
                  />
                </Link>
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6  mx-auto">
              {featureList.map((f) => (
                <div
                  key={f.id}
                  className="bg-white shadow-md dark:bg-[#1e2124] border border-gray-200 dark:border-[#40474f] rounded-lg  p-6 text-left hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-semibold text-black dark:text-white leading-tight">
                      {f.content}
                    </h3>
                    <f.icon className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    This feature helps your team streamline workflows and stay
                    aligned.
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

          {/* ─────────────  Workflow Steps  ───────────── */}
          <section className="py-24">
            {/* header – two-column like Jasper */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 dark:text-white">
                Get Started&nbsp;in 3&nbsp;Simple&nbsp;Steps
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 md:pl-12">
                Follow these quick milestones to launch your first project in
                minutes and keep momentum from day&nbsp;one.
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
                    {/* big step number */}
                    <span className="text-4xl font-bold mb-1 text-gray-900 dark:text-gray-100">
                      {ws.step}
                    </span>

                    {/* title & description */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {ws.title}
                    </h3>
                    <p className="text-sm text-gray-800 dark:text-gray-300 flex-grow">
                      {ws.description}
                    </p>

                    {/* arrow bottom-right */}
                    <ArrowRight className="w-5 h-5 self-end text-gray-900 dark:text-gray-100 mt-6" />
                  </article>
                );
              })}
            </div>
          </section>

          {/* ─────────────  Capabilities  ───────────── */}
          <section className="py-24">
            {/* header */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-12 mb-16">
              <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 dark:text-white">
                Everything You Need&nbsp;to&nbsp;Succeed
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 md:pl-12">
                A full spectrum of capabilities—ready out-of-the-box—so you can
                plan, execute, and iterate without switching tools.
              </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-6 lg:grid-cols-3 md:grid-cols-2">
              {capabilities.map((c, i) => {
                const pastel = [
                  "bg-[#1e3a8a]/10",
                  "bg-[#1e40af]/10",
                  "bg-[#1e429f]/10",
                  "bg-[#1e3a8a]/20",
                ][i % 4];

                return (
                  <article
                    key={c.id}
                    className={`${pastel} rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-md transition`}
                  >
                    {/* icon top-left */}
                    <div className="w-10 h-10 mb-6 bg-white bg-opacity-30 rounded-lg flex items-center justify-center">
                      <c.icon className="h-6 w-6" />
                    </div>

                    {/* title & description */}
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300  mb-2">
                      {c.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex-grow">
                      {c.description}
                    </p>

                    {/* arrow bottom-right */}
                    <ArrowRight className="w-5 h-5 self-end text-gray-700 mt-6" />
                  </article>
                );
              })}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-12 animate-fade-in delay-500">
            <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">
              Ready to Transform Your Team's Productivity?
            </h2>
            <Link
              to="/dashboard"
              className="transition-all duration-300 bg-gray-900 hover:bg-gray-800 active:scale-95 text-[#121416] font-bold rounded-full px-6 py-3 inline-flex items-center gap-2 shadow-xl"
            >
              <ShinyText text="Get Started Now" />
              <ArrowRight className="inline-block text-gray-400 w-5 h-5" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
