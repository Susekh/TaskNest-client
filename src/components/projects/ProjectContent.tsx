import { Users, ChevronDown, Shield, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import CreateSprintModal from "../modals/create/CreateSprintModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { BiExit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { Member, Project, Sprint } from "@/types/types";
import { MouseEvent, ReactNode } from "react";

type ProjectContentType = {
  toggleMembersList: () => void;
  showMembers: boolean;
  members: Member[];
  redirectToConversations: (id: string) => void;
  member: Member | null;
  formatDate: (dateStr: string) => ReactNode;
  handleChangeRole: (
    id: string,
    role: "ADMIN" | "MODERATOR" | "CONTRIBUTER"
  ) => Promise<void>;
  handleRemoveMember: (e: MouseEvent, id: string) => Promise<void>;
  project: Project;
  sprints: Sprint[];
  deleteSprint: (id: string) => Promise<void>;
  getSprintStatusColor: (startDate: string, endDate: string) => string;
};

function ProjectContent({
  toggleMembersList,
  showMembers,
  members,
  redirectToConversations,
  member,
  formatDate,
  handleChangeRole,
  handleRemoveMember,
  project,
  sprints,
  deleteSprint,
  getSprintStatusColor,
}: ProjectContentType) {
  const navigate = useNavigate();

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center text-neutral-600 dark:text-neutral-500">
                <Users size={20} className="mr-2" />
                Team Members
              </h2>
              <Button
                onClick={toggleMembersList}
                variant="outline"
                className="text-sm border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-950 bg-white dark:bg-neutral-900"
              >
                {showMembers ? "Hide" : "Show"} All
              </Button>
            </div>

            {showMembers && (
              <div className="space-y-3 mt-4">
                {members && members.length > 0 ? (
                  members.map((m, index) => (
                    <div
                      key={index}
                      onClick={() => redirectToConversations(m.id)}
                      className="flex items-center gap-4 px-4 py-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
                    >
                      <img
                        src={
                          m.user?.imgUrl ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            m.user?.name || "User"
                          )}&background=1e3a8a&color=ffffff`
                        }
                        alt={m.user?.name || "User"}
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-400 dark:border-slate-600 flex-shrink-0"
                      />

                      <div className="flex flex-col min-w-0">
                        <h3
                          className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate"
                          title={m.user?.name || "Unknown"}
                        >
                          {m.user?.name || "Unknown"}
                        </h3>
                        <p
                          className="text-xs text-neutral-500 dark:text-neutral-400 truncate"
                          title={`@${m.user?.username || "username"}`}
                        >
                          @{m.user?.username || "username"}
                        </p>
                      </div>

                      <div className="ml-auto">
                        {member?.role === "ADMIN" ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="flex items-center gap-1 text-sm px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full h-8"
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`${m.role || "Member"} options`}
                              >
                                {m.role || "Member"}
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="w-56"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {m.role !== "ADMIN" && m.id !== member.id && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleChangeRole(m.id, "ADMIN")
                                  }
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Make Admin
                                </DropdownMenuItem>
                              )}
                              {m.role !== "MODERATOR" && m.id !== member.id && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleChangeRole(m.id, "MODERATOR")
                                  }
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  Make Moderator
                                </DropdownMenuItem>
                              )}
                              {m.role !== "CONTRIBUTER" &&
                                m.id !== member.id && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleChangeRole(m.id, "CONTRIBUTER")
                                    }
                                  >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Make Contributor
                                  </DropdownMenuItem>
                                )}
                              <DropdownMenuItem
                                onClick={(e) => handleRemoveMember(e, m.id)}
                                className="text-red-600 focus:bg-slate-100 dark:focus:bg-red-900"
                              >
                                {m.id === member.id ? (
                                  <span className="flex items-center text-red-500">
                                    <BiExit className="w-4 h-4 mr-2" />
                                    Leave the project
                                  </span>
                                ) : (
                                  <span className="flex items-center text-red-500">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Remove Member
                                  </span>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <div className="flex items-center text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 h-8 justify-center select-none cursor-default">
                            {m.id === member?.id ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="flex items-center gap-1 text-xs px-2 py-0.5 dark:bg-gray-800 bg-transparent rounded-full h-full"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={`${m.role || "Member"} options`}
                                  >
                                    {m.role || "Member"}
                                    <ChevronDown className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="text-sm">
                                  <DropdownMenuItem
                                    onClick={(e) => handleRemoveMember(e, m.id)}
                                    className="text-red-600 focus:bg-gray-200 dark:focus:bg-red-900"
                                    role="menuitem"
                                    tabIndex={-1}
                                  >
                                    <p className="flex items-center text-red-500">
                                      <BiExit className="w-4 h-4 mr-2" />
                                      Leave the project
                                    </p>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <span aria-label={m.role || "Member"}>
                                {m.role || "Member"}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-neutral-500 dark:text-neutral-400 mb-3">
                      No team members yet
                    </p>
                    <Button className="bg-slate-600 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-800">
                      Add Members
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!showMembers && members && members.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {members.slice(0, 5).map((member, idx) => (
                  <img
                    key={idx}
                    src={
                      member.user?.imgUrl ||
                      `https://ui-avatars.com/api/?name=${
                        member.user?.name || "User"
                      }&background=B91C1C&color=ffffff`
                    }
                    alt={member.user?.name || "User"}
                    title={member.user?.name || "User"}
                    className="w-8 h-8 rounded-full object-cover border-2 border-slate-500 dark:border-slate-700"
                  />
                ))}
                {members.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-slate-600 dark:bg-slate-700 flex items-center justify-center text-xs font-medium text-white">
                    +{members.length - 5}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-neutral-600 dark:text-neutral-400">
                Sprints
              </h2>
              {member?.role === "CONTRIBUTER" ? (
                ""
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <CreateSprintModal
                          disabled={!project.isPro && sprints.length >= 5}
                          className="bg-slate-600 hover:bg-slate-700 text-white hover:text-white dark:bg-slate-700 dark:hover:bg-slate-800 shadow-md"
                          projectId={project.id}
                        />
                      </div>
                    </TooltipTrigger>
                    {sprints.length >= 5 && (
                      <TooltipContent side="top">
                        <p className="text-xs">
                          Premium required to create more than 5 sprints.
                        </p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {sprints.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sprints.map((sprint) => (
                  <div
                    key={sprint.id}
                    className="relative bg-white dark:bg-neutral-900 rounded-xl shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden transition hover:shadow-lg"
                  >
                    {/* Status Badge */}
                    <div
                      className={`absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full font-semibold ${getSprintStatusColor(
                        String(sprint.startDate),
                        String(sprint.endDate)
                      )}`}
                    >
                      {sprint.status}
                    </div>

                    {/* Main Content */}
                    <div
                      className="p-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => navigate(`sprints/${sprint.id}`)}
                    >
                      <h3 className="font-semibold text-lg text-neutral-800 dark:text-white mb-1">
                        {sprint.name}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {formatDate(String(sprint.startDate))} -{" "}
                        {formatDate(String(sprint.endDate))}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-neutral-200 dark:border-neutral-700 px-4 py-2 flex items-center justify-between">
                      {member?.role !== "CONTRIBUTER" ? (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-sm hover:text-red-600 dark:hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">
                              This action cannot be undone. Do you really want
                              to delete this sprint?
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteSprint(sprint.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <div />
                      )}

                      <span className="text-xs text-neutral-400 dark:text-neutral-500">
                        #{sprint.id.slice(0, 6)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-neutral-500 dark:text-neutral-400">
                  No sprints available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectContent;
