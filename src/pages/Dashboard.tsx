import CreateProjectModal from "@/components/modals/create/CreateProjectModal";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ChevronRight, FolderOpen, Clock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

function Dashboard() {
  const user = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <section className="bg-neutral-100 dark:bg-black text-neutral-800 dark:text-neutral-200 p-4 md:p-6 lg:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <h1 className="text-3xl font-bold text-red-600 dark:text-red-500">
              Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-1">
              Welcome back, {user.userData?.name || "User"}
            </p>
          </div>
          
          <CreateProjectModal className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 shadow-md flex items-center gap-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects Section */}
          <div>
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-red-600 dark:text-red-500">
                <FolderOpen size={20} className="mr-2" />
                Your Projects
              </h2>

              {user.userData?.members && user.userData.members.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {user.userData.members.map((member, index) => (
                    <div
                      key={index}
                      onClick={() => handleProjectClick(member.projectId)}
                      className="bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 p-4 rounded-lg cursor-pointer transition-colors border border-neutral-200 dark:border-neutral-700 flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member?.project?.imageUrl || ""} alt={member?.project?.name} />
                            <AvatarFallback>{'https://avatars.githubusercontent.com/u/124599?v=4'}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {member.project?.name || "Unnamed Project"}
                          </h3>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Role: {member.role || "Member"}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-neutral-400 dark:text-neutral-500 transform group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                    You don't have any projects yet
                  </p>
                  <CreateProjectModal className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 shadow-md" />
                </div>
              )}
            </div>
          </div>

          {/* Active Sprints Section */}
          <div>
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-red-600 dark:text-red-500">
                <Clock size={20} className="mr-2" />
                Active Sprints
              </h2>

              {user.userData?.members &&
              user.userData.members.some(
                (member) =>
                  member.project?.sprints && member.project.sprints.length > 0
              ) ? (
                <div className="space-y-4">
                  {user.userData.members.map((member, index) => {
                    // Skip if project doesn't have sprints
                    if (
                      !member.project?.sprints ||
                      member.project.sprints.length === 0
                    )
                      return null;

                    return (
                      <div key={index} className="mb-4">
                        <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-2">
                          {member.project.name || "Unnamed Project"}
                        </h3>
                        <div className="space-y-2">
                          {member.project.sprints.map((sprint) => (
                            <div
                              key={sprint.id}
                              className="bg-neutral-50 dark:bg-neutral-800 p-3 rounded-md border-l-4 border-red-500 dark:border-red-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                              onClick={() =>
                                navigate(
                                  `/projects/${member.projectId}/sprints/${sprint.id}`
                                )
                              }
                            >
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{sprint.name}</h4>
                                <ChevronRight
                                  size={16}
                                  className="text-neutral-400 dark:text-neutral-500"
                                />
                              </div>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                {sprint.startDate && sprint.endDate
                                  ? `${new Date(
                                      sprint.startDate
                                    ).toLocaleDateString()} - ${new Date(
                                      sprint.endDate
                                    ).toLocaleDateString()}`
                                  : "No date specified"}
                              </p>
                              <p className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 inline-block px-2 py-0.5 rounded mt-2">
                                {sprint.status}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                  <p className="text-neutral-500 dark:text-neutral-400">
                    No active sprints
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
