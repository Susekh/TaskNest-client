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
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const featureList = [
  { id: 1, content: "Setup in Under 60 Seconds", icon: Zap },
  { id: 2, content: "Smart Sprint Planning", icon: Target },
  { id: 3, content: "Dynamic Kanban Boards", icon: Layers },
  { id: 4, content: "Deadline Tracking", icon: Clock },
  { id: 5, content: "Team Task Assignment", icon: Users },
];

type ColorKey = 'emerald' | 'blue' | 'purple' | 'orange' | 'red' | 'indigo';

const capabilities: {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  color: ColorKey;
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
      "Assign tasks with clear ownership, priorities, and due dates. Never lose track of who's doing what.",
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
      "Track team productivity, identify bottlenecks, and optimize your workflow with detailed insights.",
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

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="min-h-screen bg-white dark:bg-neutral-950 flex pt-24">
        <div className="container mx-auto px-6">
          <motion.div
            className="flex flex-col lg:flex-row items-center justify-between gap-16"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Left Content */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              variants={fadeIn}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-neutral-200 dark:border-neutral-700"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-4 h-4 text-emerald-500" />
                Setup in 60 seconds
              </motion.div>

              <motion.h1
                className="text-5xl lg:text-7xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight"
                variants={fadeIn}
              >
                Project Management
                <span className="block text-emerald-600 dark:text-emerald-400">
                  Made Simple
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl leading-relaxed"
                variants={fadeIn}
              >
                Build sprints, assign tasks, track deadlines, and manage your
                team with intuitive Kanban boards. Everything you need to
                deliver projects on time.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={fadeIn}
              >
                <motion.button
                  className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 justify-center"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  Start For Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* <motion.button
                  className="border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-neutral-500 dark:hover:border-neutral-400 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Watch Demo
                </motion.button> */}
              </motion.div>
            </motion.div>

            {/* Right Features Card */}
            <motion.div className="flex-1 max-w-md w-full" variants={fadeIn}>
              <motion.div
                className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                  Core Features
                </h3>
                <ul className="space-y-4">
                  {featureList.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <motion.li
                        key={feature.id}
                        className="flex items-center gap-4 group"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <motion.div
                          className="bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                        >
                          <IconComponent className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                        </motion.div>
                        <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                          {feature.content}
                        </span>
                      </motion.li>
                    );
                  })}
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              From setup to delivery, we've streamlined every part of project
              management
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {workflowSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.step}
                  className="text-center"
                  variants={fadeIn}
                >
                  <motion.div
                    className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <IconComponent className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-2">
                    {step.step}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-neutral-950">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
              Powerful features designed for modern teams. Sprint planning, task
              management, and deadline tracking in one unified platform.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {capabilities.map((capability) => {
              const IconComponent = capability.icon;
              const colorClasses = {
                emerald:
                  "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30",
                blue: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
                purple:
                  "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30",
                orange:
                  "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30",
                red: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30",
                indigo:
                  "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30",
              };

              return (
                <motion.div
                  key={capability.id}
                  className="bg-neutral-50 dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:shadow-lg transition-all duration-200"
                  variants={fadeIn}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <motion.div
                    className={`w-12 h-12 rounded-xl ${
                      colorClasses[capability.color]
                    } flex items-center justify-center mb-4`}
                    whileHover={{ scale: 1.1 }}
                  >
                    <IconComponent className="w-6 h-6" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3">
                    {capability.title}
                  </h3>

                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {capability.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
              Ready to Transform Your Team's Productivity?
            </h2>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl "
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to={"/dashboard"} className="flex items-center gap-2 justify-center">
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

export default Home;
