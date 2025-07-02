import conf from "@/conf/conf";
import useApiPost from "@/utils/hooks/useApiPost";
import { useNavigate, useParams } from "react-router-dom";
import ContentShimmer from "../loaders/shimmers/ContentShimmer";
import { Button } from "../ui/button";
import CreateSprintModal from "../modals/create/CreateSprintModal";
import {
  Link,
  Users,
  FolderOpen,
  ChevronDown,
  Shield,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import callApiPost from "@/utils/callApiPost";
import { MouseEvent, useEffect, useState } from "react";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import DeleteProjectModal from "../modals/delete/DeleteProjectModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { AxiosResponse } from "axios";
import { setUserMember } from "@/store/MemberSlice";
import { Member } from "@/types/types";
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

interface ApiDeleteSprintRes {
  message: string;
  status: string;
}

interface Sprint {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
}

function Project() {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user.userData);
  const userMember = user.members?.filter(
    (member) => member.projectId === projectId
  )[0] as Member;
  dispatch(setUserMember(userMember));
  const member = useSelector((state: RootState) => state.member.member);
  console.log("Member from redux ::", member);

  const navigate = useNavigate();
  const [showMembers, setShowMembers] = useState(false);
  const today = new Date();

  const { data, isLoading, error } = useApiPost(
    `${conf.backendUrl}/fetch/project`,
    { projectId }
  );

  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const project = data?.project;

  useEffect(() => {
    if (project) {
      if (project.sprints) {
        setSprints(project.sprints);
      }
      if (project.members) {
        setMembers(project.members);
      }
    }
  }, [project]);

  const deleteSprint = async (id: string) => {
    const promise = callApiPost(
      `${conf.backendUrl}/delete/sprint/delete-sprints`,
      { sprintId: id }
    ) as Promise<AxiosResponse<ApiDeleteSprintRes> | null>;

    toast.promise(
      promise.then((res) => {
        if (res?.data?.message) {
          setSprints((prev) => prev.filter((sprint) => sprint.id !== id));
          return res.data.message;
        } else {
          return "Sprint deleted, but no confirmation message.";
        }
      }),
      {
        loading: "Deleting sprint...",
        success: (message) => message,
        error: "Couldn't delete sprint",
      },
      {
        success: {
          duration: 3000,
        },
        error: {
          duration: 4000,
        },
      }
    );
  };

  const copyInviteLinkToClipboard = (inviteCode: string) => {
    navigator.clipboard
      .writeText(
        `${conf.frontendUrl}/projects/${project.id}/invite/${inviteCode}`
      )
      .then(() => {
        toast.success("Invite link copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy the invite link.");
      });
  };

  const toggleMembersList = () => {
    setShowMembers(!showMembers);
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), "MMM dd, yyyy");
    } catch (e) {
      console.error("Error in date format ::", e);
      return dateStr;
    }
  };

  const getSprintStatusColor = (startDate: string, endDate: string) => {
    try {
      const start = parseISO(startDate);
      const end = parseISO(endDate);

      if (isBefore(today, start)) {
        // Upcoming sprint (not started yet)
        return "bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      } else if (isAfter(today, start) && isBefore(today, end)) {
        // Ongoing sprint
        return "bg-slate-600 text-white dark:bg-slate-400 dark:text-slate-900";
      } else if (isAfter(today, end)) {
        // Finished sprint (past deadline)
        return "bg-red-600 text-white dark:bg-red-500 dark:text-red-200";
      }
      // fallback/default
      return "bg-gray-500 text-white dark:bg-gray-600 dark:text-gray-300";
    } catch (e) {
      console.error("Err in setting sprint color ::", e);
      return "bg-gray-500 text-white dark:bg-gray-600 dark:text-gray-300";
    }
  };

  // async function handleDeleteProject(projectId: string) {
  //   try {
  //     const res = await callApiPost(
  //       `${conf.backendUrl}/delete/project/delete-project`,
  //       { projectId }
  //     );
  //     if (res?.status === 200) {
  //       toast.success("Project deleted");
  //       navigate("/dashboard");
  //     }
  //   } catch (error) {
  //     toast.error("Unable to delete the project");
  //     console.error("Error in deleting the project ::", error);

  //   }
  // }

  async function handleChangeRole(
    memberId: string,
    newRole: "ADMIN" | "MODERATOR" | "CONTRIBUTER"
  ) {
    try {
      const res = await callApiPost(
        `${conf.backendUrl}/update/project/update-role`,
        { memberId, newRole }
      );
      if (res?.status === 200) {
        toast.success(`Role updated to ${newRole} successfully`);
        setMembers((currentMembers) =>
          currentMembers.map((member) =>
            member.id === memberId ? { ...member, role: newRole } : member
          )
        );
      } else {
        toast.error(res?.data?.msg || "Something went wrong.");
      }
    } catch (error) {
      toast.error("Failed to update member role");
      console.log("Error in update Member role ::", error);
    }
  }

  function redirectToConversations(targetId: string) {
    const roomId = [userMember?.id, targetId].sort().join("");
    navigate("/conversations/" + roomId);
  }

  async function handleRemoveMember(e : MouseEvent, memberId: string) {
    e.stopPropagation();
    try {
      const res = await callApiPost(
        `${conf.backendUrl}/delete/project/delete-member`,
        { memberId }
      );
      if (res?.status === 200) {
        toast.success("Member removed from project");
        setMembers((currentMembers) =>
          currentMembers.filter((member) => member.id !== memberId)
        );
      }
    } catch (error) {
      console.error("Unable to remove member ::", error);
      toast.error("Unable to remove member");
    }
  }

  if (isLoading) return <ContentShimmer />;
  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Error: {error}
        </p>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-neutral-500 dark:text-neutral-400">
          No project data available.
        </p>
      </div>
    );

  return (
    <section className="bg-neutral-100 dark:bg-black text-neutral-800 dark:text-neutral-200 p-4 md:p-6 md:pb-52 lg:p-8 lg:pb-60">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-4 w-full mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-900/30 flex items-center justify-center overflow-hidden ring-2 ring-slate-600 dark:ring-slate-700">
              {project.imageUrl ? (
                <img
                  className="w-full h-full object-cover"
                  src={project.imageUrl}
                  alt={project.name}
                />
              ) : (
                <FolderOpen
                  size={24}
                  className="text-slate-600 dark:text-slate-500"
                />
              )}
            </div>
            <div className="flex  items-center w-full mr-4">
              <h1 className="text-2xl font-extrabold text-gray-600 dark:text-gray-400 truncate max-w-[60%]">
                {project.name}
              </h1>
              <div className="flex flex-wrap mx-auto gap-2 text-xs font-semibold">
                <span className="px-2.5 py-0.5 min-w-[5.5rem] text-center rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm">
                  Upcoming
                </span>
                <span className="px-2.5 py-0.5 min-w-[5.5rem] text-center rounded-full bg-slate-600 dark:bg-slate-700 text-white shadow-md">
                  Active
                </span>
                <span className="px-2.5 py-0.5 min-w-[5.5rem] text-center rounded-full bg-red-600 dark:bg-red-700 text-white dark:text-neutral-300 shadow-md">
                  Past Deadline
                </span>
              </div>
            </div>
          </div>

          {member?.role !== "CONTRIBUTER" && (
            <div className="ml-auto flex tems-center gap-3">
              {/* Invite Button */}
              <Button
                onClick={() => copyInviteLinkToClipboard(project.inviteCode)}
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 text-white rounded-md shadow hover:shadow-md hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Copy invite link"
              >
                <Link size={14} className="text-indigo-400" />
                <span className="font-medium text-sm select-none">Invite</span>
              </Button>

              {/* Upgrade Button */}
              {!project.isPro && (
                <Button
                  onClick={() => navigate(`/upgrade/${projectId}`)}
                  className="px-3.5 py-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 text-white rounded-md shadow hover:brightness-110 transition duration-200 font-medium text-sm select-none focus:outline-none focus:ring-2 focus:ring-pink-400"
                  aria-label="Upgrade to Pro"
                >
                  Upgrade
                </Button>
              )}

              {/* Divider */}
              <div
                className="border-l border-gray-600 h-6 mx-2"
                aria-hidden="true"
              />

              {/* Delete Button */}
              <button
                onClick={() => {}}
                aria-label="Delete Project"
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-red-500 hover:bg-red-600 hover:text-white shadow-sm hover:shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <DeleteProjectModal projectId={projectId} />
              </button>
            </div>
          )}
        </div>

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
                        className="flex items-center gap-3 p-3 rounded-md bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-black transition-colors cursor-pointer"
                      >
                        <img
                          src={
                            m.user?.imgUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              m.user?.name || "User"
                            )}&background=B91C1C&color=ffffff`
                          }
                          alt={m.user?.name || "User"}
                          className="w-10 h-10 rounded-full object-cover border-2 border-slate-500 dark:border-slate-700 flex-shrink-0"
                        />
                        <div className="bg-neutral-100 dark:bg-neutral-900 px-3 py-2 rounded-md flex flex-col justify-center min-w-[160px] max-w-[160px]">
                          <h3
                            className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 uppercase truncate"
                            title={m.user?.name || "Unknown"}
                            style={{ lineHeight: 1 }}
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
                                  className="flex items-center gap-1 text-sm px-2 py-1 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 rounded w-28 h-8"
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
                                {m.role !== "MODERATOR" &&
                                  m.id !== member.id && (
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
                            <div className="flex items-center gap-1 text-xs px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 w-28 h-8 justify-center select-none cursor-default">
                              {m.id === member?.id ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="flex items-center justify-center gap-1 text-xs px-3 py-1 dark:bg-gray-800 bg-transparent rounded w-full h-full"
                                      onClick={(e) => e.stopPropagation()}
                                      aria-label={`${
                                        m.role || "Member"
                                      } options`}
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
                            className="bg-slate-600 hover:bg-slate-700 text-white dark:bg-slate-700 dark:hover:bg-slate-800 shadow-md"
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
                          sprint.startDate,
                          sprint.endDate
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
                          {formatDate(sprint.startDate)} -{" "}
                          {formatDate(sprint.endDate)}
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
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
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
      </div>
    </section>
  );
}

export default Project;
