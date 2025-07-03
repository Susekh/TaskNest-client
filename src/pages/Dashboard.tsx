import { useRef } from "react";
import CreateProjectModal from "@/components/modals/create/CreateProjectModal";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Clock, Folder } from "lucide-react";

export default function Dashboard() {
  const user = useSelector((s: RootState) => s.user);
  const navigate = useNavigate();

  const statusSections = [
    { key: "ACTIVE", label: "Active Sprints" },
    { key: "PLANNED", label: "Planned Sprints" },
  ];

  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    if (direction === "left") {
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black overflow-x-hidden font-inter">
      <div className="flex flex-col flex-grow">
        {/* Main Content */}
        <main className="px-4 sm:px-8 md:px-12 py-8 flex-1 flex justify-center">
          <div className="flex flex-col flex-1 max-w-[960px]">
            {/* Welcome */}
            <section className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-700 dark:text-neutral-300 leading-tight select-none">
                Welcome back, {user.userData?.name || "User"}
              </h1>
            </section>

            {/* Add Create Project Button */}
            <section className="mb-6 flex justify-end">
              <CreateProjectModal className="px-4 py-2 rounded-md bg-gray-800 hover:bg-blue-950 text-white font-semibold transition-colors" />
            </section>

            {/* Projects Carousel */}
            <section className="mb-10 relative">
              <h2 className="px-2 pb-4 text-2xl font-semibold text-[#111418] dark:text-neutral-200 select-none">
                Your Projects
              </h2>

              {/* Carousel Navigation Buttons */}
              <button
                aria-label="Scroll projects left"
                onClick={() => scrollCarousel("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-neutral-900 shadow-md hover:bg-[#0c77f2] hover:text-white transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                aria-label="Scroll projects right"
                onClick={() => scrollCarousel("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-neutral-900 shadow-md hover:bg-[#0c77f2] hover:text-white transition-colors"
              >
                <ChevronRight size={24} />
              </button>

              <div
                ref={carouselRef}
                className="flex overflow-hidden gap-5 px-2 py-2 scroll-smooth"
              >
                {user.userData?.members?.length ? (
                  user.userData.members.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col min-w-[260px] sm:min-w-[280px] rounded-lg shadow-md cursor-pointer hover:shadow-xl transition-shadow duration-300 border border-transparent hover:border-[#0c77f2] dark:hover:border-[#3b82f6]"
                      onClick={() => navigate(`/projects/${m.projectId}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        navigate(`/projects/${m.projectId}`)
                      }
                      aria-label={`Go to project ${
                        m.project?.name || "Unnamed Project"
                      }`}
                    >
                      {m.project?.imageUrl ? (
                        <div
                          className="w-full aspect-video bg-center bg-cover rounded-t-lg"
                          style={{
                            backgroundImage: `url("${m.project.imageUrl}")`,
                          }}
                        />
                      ) : (
                        <div className="w-full aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-t-lg flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500">
                          <Folder size={48} />
                          <p className="mt-2 text-sm select-none">No Image</p>
                        </div>
                      )}
                      <div className="px-5 py-4 bg-white dark:bg-neutral-900 rounded-b-lg">
                        <p className="text-lg font-semibold text-[#111418] dark:text-neutral-200 truncate">
                          {m.project?.name || "Unnamed Project"}
                        </p>
                        <p className="text-sm text-[#60748a] dark:text-neutral-400 mt-1 truncate">
                          Role: {m.role || "Member"}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center px-4 py-12 w-full bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                    <p className="text-[#60748a] dark:text-neutral-400 select-none">
                      No projects yet
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Sprint Sections */}
            <section className="space-y-8">
              {statusSections.map(({ key, label }) => {
                const hasSprints = user.userData?.members?.some((m) =>
                  m.project?.sprints?.some((s) => s.status === key)
                );

                return (
                  <div
                    key={key}
                    className="bg-white dark:bg-neutral-900 rounded-lg shadow-md border border-[#f0f2f5] dark:border-neutral-800"
                  >
                    <div className="p-6">
                      <h2 className="text-xl font-semibold mb-5 flex items-center text-[#111418] dark:text-neutral-200 select-none">
                        <Clock
                          size={20}
                          className="mr-3 text-[#0c77f2] dark:text-[#3b82f6]"
                        />
                        {label}
                      </h2>

                      {hasSprints ? (
                        <div className="flex overflow-x-auto hide-scrollbar gap-6 pt-1 pb-5 scroll-smooth">
                          {user?.userData?.members?.map((m, mi) => {
                            const filtered = m.project?.sprints?.filter(
                              (s) => s.status === key
                            );
                            if (!filtered?.length) return null;
                            return (
                              <div key={mi} className="min-w-[280px] space-y-3">
                                <h3 className="text-sm font-medium text-[#60748a] dark:text-neutral-400 truncate">
                                  {m.project?.name}
                                </h3>
                                {filtered.map((s) => (
                                  <div
                                    key={s.id}
                                    onClick={() =>
                                      navigate(
                                        `/projects/${m.projectId}/sprints/${s.id}`
                                      )
                                    }
                                    className={`bg-neutral-50 dark:bg-neutral-800 p-4 rounded-md border-l-4 cursor-pointer transition-colors duration-200
                                      ${
                                        key === "ACTIVE"
                                          ? "border-emerald-500 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/70"
                                          : "border-yellow-500 dark:border-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/70"
                                      }
                                    `}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) =>
                                      e.key === "Enter" &&
                                      navigate(
                                        `/projects/${m.projectId}/sprints/${s.id}`
                                      )
                                    }
                                    aria-label={`Go to sprint ${s.name} in project ${m.project?.name}`}
                                  >
                                    <div className="flex justify-between items-center">
                                      <h4 className="font-semibold text-[#111418] dark:text-neutral-200 truncate">
                                        {s.name}
                                      </h4>
                                      <ChevronRight
                                        size={16}
                                        className="text-[#60748a] dark:text-neutral-400"
                                      />
                                    </div>
                                    <p className="text-xs text-[#60748a] dark:text-neutral-400 mt-1 truncate">
                                      {s.startDate && s.endDate
                                        ? `${new Date(
                                            s.startDate
                                          ).toLocaleDateString()} - ${new Date(
                                            s.endDate
                                          ).toLocaleDateString()}`
                                        : "No date specified"}
                                    </p>
                                    <span
                                      className={`inline-block mt-2 px-2 py-1 rounded text-xs font-semibold select-none ${
                                        key === "ACTIVE"
                                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-[#111418] dark:text-neutral-200"
                                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                      }`}
                                    >
                                      {s.status}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800 rounded-lg select-none">
                          <p className="text-[#60748a] dark:text-neutral-400">
                            No {label.toLowerCase()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
