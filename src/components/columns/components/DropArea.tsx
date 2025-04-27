import conf from "@/conf/conf";
import { Column, MemberRole, Task } from "@/types/types";
import callApiPost from "@/utils/callApiPost";
import { AxiosResponse } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";


type ActiveCard = {
  id: string;
  name: string;
  index: number;
} | null;

interface ApiDropTaskRes {
  message : string
}

type Props = {
  position: number; 
  columnId: string; 
  activeCard: ActiveCard; 
  role : MemberRole | undefined;
  columns: Column[]; 
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>; 
};

function DropArea({
  position,
  columnId,
  activeCard,
  columns,
  role,
  setColumns,
}: Props) 
{
  
  const [showDrop, setShowDrop] = useState(false);
  console.log("Member in dropArea ::", role);
  

  const handleDragEnter = () => {
    if(role === "CONTRIBUTER") {
      setShowDrop(false)
      return
    }
    setShowDrop(true);
  }

  const onDrop = async () => {
    if (!activeCard || role === "CONTRIBUTER") return;
  
    let taskToMove: Task | null = null;
    let sourceColumnId: string | null = null;
    const sourceIndex = activeCard.index;
  
    for (const column of columns) {
      const task = column.tasks.find((t) => t.id === activeCard.id);
      if (task) {
        taskToMove = task;
        sourceColumnId = column.id;
        break;
      }
    }
  
    if (!taskToMove || !sourceColumnId) return;
  
    // Optimistic UI update
    const updatedColumns = columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => task.id !== activeCard.id),
    }));
  
    const targetColumnIndex = updatedColumns.findIndex((column) => column.id === columnId);
  
    if (targetColumnIndex !== -1) {
      if (sourceColumnId === columnId) {
        if (position > sourceIndex) {
          updatedColumns[targetColumnIndex].tasks.splice(position - 1, 0, taskToMove);
        } else {
          updatedColumns[targetColumnIndex].tasks.splice(position, 0, taskToMove);
        }
      } else {
        updatedColumns[targetColumnIndex].tasks.splice(position, 0, taskToMove);
      }
    }
  
    setColumns(updatedColumns);
    setShowDrop(false);
  
    
    try {
      const response = await callApiPost(`${conf.backendUrl}/create/task/move-task`, {
        taskId: taskToMove.id,
        previousColumnId: sourceColumnId,
        targetColumnId: columnId,
        order: position,
      }) as AxiosResponse<ApiDropTaskRes> | null;
  
      console.log("✅ Task moved on backend:", response);
      toast.success("Task moved succesfulyy");
  
  
    } catch (error) {
      console.error("❌ Failed to move task on backend:", error);
      toast.error("Couldn't move the task");
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={() => setShowDrop(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={
        showDrop
          ? "duration-300 ease-in-out opacity-1 mt-1 p-4 border-2 border-dashed font-extralight border-gray-400 rounded"
          : "p-2 duration-300"
      }
    >
      {showDrop && "Drop Here"}
    </div>
  );
}

export default DropArea;
