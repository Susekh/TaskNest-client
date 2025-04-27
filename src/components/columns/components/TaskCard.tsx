import { Dispatch, SetStateAction, useState } from "react";
import DeleteTaskModal from "@/components/modals/delete/DeleteTasksModal";
import { format } from "date-fns";
import { Calendar, Users, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Column, Member, Sprint } from "@/types/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type TaskCardProps = {
  taskId: string;
  taskName: string;
  taskDeadline: Date;
  taskMembers: Member[] | undefined;
  index: number;
  columnId: string;
  setActiveCard: Dispatch<
    SetStateAction<{ id: string; name: string; index: number } | null>
  >;
  setColumns: Dispatch<SetStateAction<Column[]>>;
  columns: Column[];
  setSprint: Dispatch<SetStateAction<Sprint | null>>;
};

const TaskCard = ({
  taskId,
  taskName,
  taskDeadline,
  taskMembers = [],
  index,
  setActiveCard,
  setColumns,
  columns,
}: TaskCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const member = useSelector((store: RootState) => store.member.member);

  const handleDragStart = (
    e: React.DragEvent,
    taskId: string,
    name: string,
    index: number,
    role?: string
  ) => {
    if (role === "CONTRIBUTER") {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("taskId", taskId);
    setActiveCard({ id: taskId, name, index });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if(member?.role === "CONTRIBUTER") return;
    e.dataTransfer.setData("taskId", "");
    setActiveCard(null);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteModal(!showDeleteModal);
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteTaskModal
          className="p-0 bg-white hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-800 text-red-500 cursor-pointer"
          taskId={taskId}
          setColumns={setColumns}
          columns={columns}
        />
      )}

      <div
        draggable={member?.role !== "CONTRIBUTER"}
        onDragStart={(e) => handleDragStart(e, taskId, taskName, index, member?.role)}
        onDragEnd={handleDragEnd}
        className="rounded-lg border shadow-sm bg-card text-card-foreground hover:shadow-md transition-all dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-900/30 mb-3 p-3 relative"
      >
        {}
        {member?.role === "ADMIN" || member?.role === "MODERATOR" ? (
          <button
            onClick={handleDeleteClick}
            className="absolute top-2 right-2 text-neutral-400 hover:text-red-500 z-10"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <></>
        )}

        <Link to={`./task/${taskId}`} className="block w-full h-full">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-base text-neutral-900 dark:text-neutral-100">
              {taskName}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 text-xs mt-2">
            <div className="flex items-center text-neutral-500 dark:text-neutral-400">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{format(new Date(taskDeadline), "MMM d, yyyy")}</span>
            </div>

            <div className="flex items-center text-neutral-500 dark:text-neutral-400">
              <Users className="h-3 w-3 mr-1" />
              <span>
                {Array.isArray(taskMembers) && taskMembers.length > 0
                  ? `${taskMembers.length} ${
                      taskMembers.length === 1 ? "member" : "members"
                    }`
                  : "None"}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default TaskCard;
