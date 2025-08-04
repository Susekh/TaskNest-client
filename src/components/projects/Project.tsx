import conf from "@/conf/conf";
import useApiPost from "@/utils/hooks/useApiPost";
import { useNavigate, useParams } from "react-router-dom";
import ContentShimmer from "../loaders/shimmers/ContentShimmer";
import { Button } from "../ui/button";

import { Link, FolderOpen } from "lucide-react";
import toast from "react-hot-toast";
import callApiPost from "@/utils/callApiPost";
import { MouseEvent, useEffect, useState } from "react";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import DeleteProjectModal from "../modals/delete/DeleteProjectModal";

import { AxiosResponse } from "axios";
import { setUserMember } from "@/store/MemberSlice";
import { Member, Sprint } from "@/types/types";
import ProjectContent from "./ProjectContent";

interface ApiDeleteSprintRes {
  message: string;
  status: string;
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

  async function handleRemoveMember(e: MouseEvent, memberId: string) {
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
                className="flex items-center gap-1.5 px-3 py-1 bg-gray-400 dark:bg-gray-800 dark:text-white text-black rounded-md shadow hover:shadow-md hover:bg-gray-500 dark:hover:bg-gray-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

        <ProjectContent
          toggleMembersList={toggleMembersList}
          showMembers={showMembers}
          member={member}
          members={members}
          redirectToConversations={redirectToConversations}
          formatDate={formatDate}
          sprints={sprints}
          getSprintStatusColor={getSprintStatusColor}
          handleChangeRole={handleChangeRole}
          handleRemoveMember={handleRemoveMember}
          project={project}
          deleteSprint={deleteSprint}
        />
      </div>
    </section>
  );
}

export default Project;
