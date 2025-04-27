import ContentShimmer from "@/components/loaders/shimmers/ContentShimmer";
import TaskDetails from "@/components/TaskDetails";
import conf from "@/conf/conf";
import { Task } from "@/types/types";
import callApiPost from "@/utils/callApiPost";
import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

interface ApiFetchTask {
 task : Task
}

function TaskPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState<Task | null>(null); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTask = async () => {
      if (!taskId) return;

      try {
        const res = await callApiPost(`${conf.backendUrl}/fetch/task`, { taskId }) as AxiosResponse<ApiFetchTask> | null;

        if (!res?.data?.task) {
          toast.error("Task not found");
          setIsLoading(false);
          return;
        }

        console.log("data in task ::", res.data);
        setTask(res.data.task);
      }  catch (error) {
        if (error instanceof AxiosError) {
          if (error.response) {
            toast.error(`Error: ${error.response.data.message || "Something went wrong"}`);
          } else {
            toast.error("Network error or server is down");
          }
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    getTask();
  }, [taskId]);

  return (
    <div className="min-h-screen p-4 bg-white text-neutral-800 dark:bg-black dark:text-neutral-200 transition-colors duration-300">
      {isLoading ? (
        <ContentShimmer />
      ) : task ? (
        <TaskDetails task={task} />
      ) : (
        <p className="text-center text-neutral-500 dark:text-neutral-400 mt-10">
          No task found.
        </p>
      )}
    </div>
  );
}

export default TaskPage;
