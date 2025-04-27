import conf from "@/conf/conf";
import useApiPost from "@/utils/useApiPost";
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
import { useEffect, useState } from "react";
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
    try {
      const res = (await callApiPost(
        `${conf.backendUrl}/delete/sprint/delete-sprints`,
        { sprintId: id }
      )) as AxiosResponse<ApiDeleteSprintRes> | null;

      if (res && res.data && res.data.message) {
        toast.success(res.data.message);
        setSprints((prev) => prev.filter((sprint) => sprint.id !== id));
      } else {
        toast.error("Unexpected response structure");
      }
    } catch (error) {
      toast.error("Couldn't delete sprint");
      console.error("Error in deleting sprint ::", error);
    }
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
        return "bg-neutral-700 text-neutral-100";
      } else if (isAfter(today, start) && isBefore(today, end)) {
        return "bg-red-600 text-white";
      } else if (isAfter(today, end)) {
        return "bg-black text-red-400";
      }
      return "bg-red-800 text-white";
    } catch (e) {
      console.error("Err in setting sprint color ::", e);
      return "bg-red-800 text-white";
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

  async function handleRemoveMember(memberId: string) {
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
        <p className="text-red-500 dark:text-red-400 text-lg">Error: {error}</p>
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
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="w-12 h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center overflow-hidden ring-2 ring-red-600 dark:ring-red-700">
              {project.imageUrl ? (
                <img
                  className="w-full h-full object-cover"
                  src={project.imageUrl}
                  alt={project.name}
                />
              ) : (
                <FolderOpen
                  size={24}
                  className="text-red-600 dark:text-red-500"
                />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-500">
                {project.name}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                ID: {project.id}
              </p>
            </div>
          </div>
          {member?.role === "CONTRIBUTER" ? (
            ""
          ) : (
            <div className="ml-auto flex gap-2">
              <Button
                onClick={() => copyInviteLinkToClipboard(project.inviteCode)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 transition-colors shadow-md"
              >
                <Link size={16} />
                Invite Members
              </Button>
              <Button onClick={() => {}} className="bg-none p-0">
                <DeleteProjectModal projectId={projectId} />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center text-red-600 dark:text-red-500">
                  <Users size={20} className="mr-2" />
                  Team Members
                </h2>
                <Button
                  onClick={toggleMembersList}
                  variant="outline"
                  className="text-sm border border-red-200 dark:border-red-700 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 bg-white dark:bg-neutral-900"
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
                        className="flex items-center gap-3 p-3 hover:cursor-pointer bg-neutral-50 dark:bg-neutral-800 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                      >
                        <img
                          src={
                            m.user?.imgUrl ||
                            `https://ui-avatars.com/api/?name=${
                              m.user?.name || "User"
                            }&background=B91C1C&color=ffffff`
                          }
                          alt={m.user?.name || "User"}
                          className="w-10 h-10 rounded-full object-cover border-2 border-red-500 dark:border-red-700"
                        />
                        <div>
                          <h3 className="font-medium">
                            {m.user?.name || "Unknown"}
                          </h3>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            @{m.user?.username || "username"}
                          </p>
                        </div>

                        <div className="ml-auto">
                          {member?.role === "ADMIN" ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="flex items-center gap-1 text-sm px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 hover:bg-red-200 dark:hover:bg-red-800"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {m.role || "Member"}
                                  <ChevronDown className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="w-56"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {m.role !== "ADMIN" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleChangeRole(m.id, "ADMIN")
                                    }
                                  >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Make Admin
                                  </DropdownMenuItem>
                                )}
                                {m.role !== "MODERATOR" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleChangeRole(m.id, "MODERATOR")
                                    }
                                  >
                                    <Shield className="w-4 h-4 mr-2" />
                                    Make Moderator
                                  </DropdownMenuItem>
                                )}
                                {m.role !== "CONTRIBUTER" && (
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
                                  onClick={() => handleRemoveMember(m.id)}
                                  className="text-red-600 focus:bg-red-100 dark:focus:bg-red-900"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remove Member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            <div className="flex items-center gap-1 text-sm px-2 py-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100">
                              {m.role || "Member"}
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
                      <Button className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800">
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
                      className="w-8 h-8 rounded-full object-cover border-2 border-red-500 dark:border-red-700"
                    />
                  ))}
                  {members.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-red-600 dark:bg-red-700 flex items-center justify-center text-xs font-medium text-white">
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
                <h2 className="text-xl font-semibold text-red-600 dark:text-red-500">
                  Sprints
                </h2>
                {member?.role === "CONTRIBUTER" ? (
                  ""
                ) : (
                  <CreateSprintModal
                    className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 shadow-md"
                    projectId={project.id}
                  />
                )}
              </div>

              {sprints.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sprints.map((sprint) => (
                    <div
                      key={sprint.id}
                      className="bg-neutral-50 dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm border-l-4 border-red-500 dark:border-red-700"
                    >
                      <div
                        className="p-4 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        onClick={() => navigate(`sprints/${sprint.id}`)}
                      >
                        <div className="flex justify-between mb-2">
                          <h3 className="font-semibold text-lg">
                            {sprint.name}
                          </h3>
                        </div>

                        <div
                          className={`text-sm font-medium py-2 px-3 rounded-full ${getSprintStatusColor(
                            sprint.startDate,
                            sprint.endDate
                          )}`}
                        >
                          {sprint.status}
                        </div>
                      </div>

                      <div className="border-t p-2 flex justify-between border-neutral-200 dark:border-neutral-700">
                        {member?.role === "CONTRIBUTER" ? (
                          ""
                        ) : (
                          <Button
                            className="bg-neutral-800 hover:bg-neutral-900 text-white text-sm py-2 hover:text-red-600"
                            onClick={() => deleteSprint(sprint.id)}
                          >
                            <Trash2 />
                          </Button>
                        )}

                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {formatDate(sprint.startDate)} -{" "}
                          {formatDate(sprint.endDate)}
                        </p>
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
