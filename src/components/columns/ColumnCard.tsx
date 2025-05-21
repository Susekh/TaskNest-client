import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { Check, PencilIcon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import conf from "@/conf/conf";
import CreateTasksModal from "../modals/create/CreateTasksModal";
import TaskCard from "./components/TaskCard";
import DropArea from "./components/DropArea";
import { Column, Sprint, Task } from "@/types/types";

type Props = {
  column: Column;
  columns: Column[];
  setColumns: Dispatch<SetStateAction<Column[]>>;
  projectId: string;
  setSprint: Dispatch<SetStateAction<Sprint | undefined>>;
};

function ColumnComponent({ column, columns, setColumns, projectId, setSprint }: Props) {
  const [colName, setColName] = useState(column.name);
  const [colNameDisabled, setColNameDisabled] = useState(true);
  const [activeCard, setActiveCard] = useState<{ id: string; name: string; index: number } | null>(null);

  console.log("cols  in the tasks ", columns);
  

  const editColName = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `${conf.backendUrl}/update/cols/name`,
        { name: colName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (error) {
      toast.error("Error occurred while updating name");
      console.log("Error updating column name:", error);
    } finally {
      setColNameDisabled(true);
    }
  };

  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md border-2">
      <div className="flex justify-center items-center p-2 w-full border-2">
        <form onSubmit={editColName} className="flex w-full">
          <input
            type="text"
            disabled={colNameDisabled}
            value={colName}
            onChange={(e) => setColName(e.target.value)}
            className="w-full text-center"
          />
          <button
            type="button"
            onClick={() => setColNameDisabled(!colNameDisabled)}
            className="hover:bg-neutral-300 duration-150 p-2 rounded-md h-12 ml-auto"
          >
            {colNameDisabled ? <PencilIcon className="w-4" /> : <Check className="w-4" />}
          </button>
        </form>
      </div>

      <div className="p-4">
        <DropArea activeCard={activeCard} position={0} columnId={column.id} columns={columns} setColumns={setColumns} />
        {column.tasks.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>No tasks here</p>
            <CreateTasksModal
              className="p-2 bg-blue-600 text-white"
              setColumns={setColumns}
              columns={columns}
              projectId={projectId}
              columnId={column.id}
            />
          </div>
        ) : (
          column.tasks.map((task : Task, idx : number) => (
            <div key={task.id}>
              <TaskCard
                taskId={task.id}
                taskDeadline={task.deadline}
                taskName={task.name}
                taskMembers={task.members}
                index={idx}
                columnId={column.id}
                setActiveCard={setActiveCard}
                setColumns={setColumns}
                columns={columns}
                setSprint={setSprint}
              />
              <DropArea position={idx + 1} activeCard={activeCard} columnId={column.id} columns={columns} setColumns={setColumns} />
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t bg-neutral-800 border-gray-200">
        <p className="text-center text-sm mb-2">Add New Task</p>
        <CreateTasksModal
          className="w-full p-2  text-white"
          setColumns={setColumns}
          columns={columns}
          projectId={projectId}
          columnId={column.id}
        />
      </div>
    </div>
  );
}

export default ColumnComponent;
