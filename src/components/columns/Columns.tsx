import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import CreateTasksModal from "../modals/create/CreateTasksModal";
import TaskCard from "./components/TaskCard";
import DropArea from "./components/DropArea";
import { Check, Delete, Loader2, PencilIcon, Plus } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import conf from "@/conf/conf";
import { Column, Sprint } from "@/types/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

// Props for the Columns component
type ColumnsProps = {
  columns: Column[];
  setSprint: Dispatch<SetStateAction<Sprint | undefined>>;
  projectId: string;
};

// Props for the ColumnComponent
type ColumnComponentProps = {
  column: Column;
  setSprint: React.Dispatch<React.SetStateAction<Sprint | undefined>>;
  projectId: string;
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  activeCard: { id: string; name: string; index: number } | null;
  setActiveCard: React.Dispatch<
    React.SetStateAction<{ id: string; name: string; index: number } | null>
  >;
  columnsState: Column[];
};

function ColumnComponent({
  column,
  setSprint,
  projectId,
  setColumns,
  activeCard,
  setActiveCard,
  columnsState,
}: ColumnComponentProps) {
  const [colName, setColName] = useState(column.name);
  const [colNameDisabled, setColNameDisabled] = useState(true);
  const [deletingCol, setDeletingCol] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const member = useSelector((store: RootState) => store.member.member);

  const editColName = async () => {
    try {
      const response = await axios.put(
        `${conf.backendUrl}/update/cols/name`,
        { name: colName, columnId: column.id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("Name is updated");
      }
    } catch (error) {
      toast.error("Error occurred while updating name");
      console.log("Err at updating name in cols:", error);
    } finally {
      setColNameDisabled(true);
    }
  };

  const deleteCol = async (colId: string) => {
    try {
      setDeletingCol(true);
      setIsHovering(true);
      const response = await axios.post(
        `${conf.backendUrl}/delete/column/delete-column`,
        { columnId: colId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);

        setColumns((prev: Column[]) =>
          prev.filter((col: Column) => col.id !== colId)
        );
      }
    } catch (error) {
      toast.error("Error occurred while deleting column");
      console.log("Err at deleting column:", error);
    } finally {
      setColNameDisabled(true);
      setDeletingCol(false);
      setIsHovering(false);
    }
  };

  const handleColNameChange = async (e: FormEvent) => {
    e.preventDefault();
    setColNameDisabled(!colNameDisabled);
    if (!colNameDisabled) {
      await editColName();
    }
  };

  return (
    <div
      className="flex-shrink-0 w-64 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 flex flex-col transition-all duration-200"
      onDragOver={(e) => e.preventDefault()}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-2 w-full border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/90 rounded-t-lg">
        <form className="flex items-center flex-1 gap-2">
          <input
            type="text"
            disabled={colNameDisabled}
            value={colName}
            onChange={(e) => setColName(e.target.value)}
            className={`flex-1 px-2 py-1 text-sm border rounded-md transition-colors ${
              colNameDisabled
                ? "bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 border-transparent"
                : "bg-white dark:bg-neutral-600 border-neutral-300 dark:border-neutral-600 text-neutral-800 dark:text-white"
            } focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400`}
          />
          {member?.role === "ADMIN" || member?.role === "MODERATOR" ? (
            <button
              type="submit"
              onClick={handleColNameChange}
              className="hover:bg-neutral-200 dark:hover:bg-neutral-700 transition p-2 rounded-md"
            >
              {colNameDisabled ? (
                <PencilIcon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
              ) : (
                <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
              )}
            </button>
          ) : (
            <></>
          )}
        </form>

        {/* Show delete button only when hovering */}
        {(member?.role === "ADMIN" || member?.role === "MODERATOR") &&
          isHovering && (
            <button
              onClick={() => deleteCol(column.id)}
              className="hover:bg-red-100 dark:hover:bg-red-900/30 transition p-2 rounded-md"
            >
              {" "}
              {deletingCol ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Delete className="w-4 h-4 text-red-600 dark:text-red-500" />
              )}
            </button>
          )}
      </div>

      {/* Content */}

      <div className="p-2 flex-grow overflow-y-auto max-h-[calc(100vh-320px)]">
        {member?.role === "CONTRIBUTER" ? (
          <></>
        ) : (
          <DropArea
            role={member?.role}
            activeCard={activeCard}
            position={0}
            columnId={column.id}
            columns={columnsState}
            setColumns={setColumns}
          />
        )}

        {column?.tasks?.length === 0 ? (
          <div className="text-center p-2 border-neutral-300 dark:border-neutral-600">
            <p className="text-neutral-500 dark:text-neutral-400 text-sm mb-3">
              No tasks here
            </p>
          </div>
        ) : (
          column?.tasks?.map((task, idx) => (
            <div key={task.id}>
              <TaskCard
                taskId={task.id}
                taskName={task.name}
                taskMembers={task.members}
                taskDeadline={task.deadline}
                index={idx}
                columnId={column.id}
                setActiveCard={setActiveCard}
                setColumns={setColumns}
                columns={columnsState}
                setSprint={setSprint}
              />
              {member?.role === "CONTRIBUTER" ? (
                <></>
              ) : (
                <DropArea
                  role={member?.role}
                  position={idx + 1}
                  activeCard={activeCard}
                  columnId={column.id}
                  columns={columnsState}
                  setColumns={setColumns}
                />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {member?.role === "ADMIN" || member?.role === "MODERATOR" ? (
        <div className=" border-t border-neutral-200 flex items-center justify-center gap-4 dark:border-neutral-700 mt-auto bg-neutral-50/70 dark:bg-neutral-800/90 rounded-b-lg">
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            Add New Task
          </p>
          <CreateTasksModal
            className="bg-neutral-50 hover:bg-neutral-50 hover:text-teal-400 p-0 border-none dark:bg-neutral-800"
            setColumns={setColumns}
            projectId={projectId}
            columnId={column.id}
          ></CreateTasksModal>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

function Columns({ columns, setSprint, projectId }: ColumnsProps) {
  const [columnsState, setColumns] = useState<Column[]>(columns);
  const [activeCard, setActiveCard] = useState<{
    id: string;
    name: string;
    index: number;
  } | null>(null);

  useEffect(() => {
    setColumns(columns);
  }, [columns]);

  return (
    <div className="flex gap-4 overflow-x-auto px-4 py-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
      {columnsState.map((column) => (
        <ColumnComponent
          key={column.id}
          column={column}
          setSprint={setSprint}
          projectId={projectId}
          setColumns={setColumns}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          columnsState={columnsState}
        />
      ))}

      {columnsState.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full py-12 text-center">
          <div className="bg-neutral-200 dark:bg-neutral-800 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Plus
              size={24}
              className="text-neutral-500 dark:text-neutral-400"
            />
          </div>
          <p className="text-neutral-600 dark:text-neutral-300 font-medium">
            No columns yet
          </p>
          <p className="text-neutral-500 dark:text-neutral-500 text-sm mt-1 mb-4">
            Create your first column to organize tasks
          </p>
        </div>
      )}
    </div>
  );
}

export default Columns;
