import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../../ui/dialog";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import callApiPost from "@/utils/callApiPost";
import conf from "@/conf/conf";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { Column } from "@/types/types";
import { AxiosResponse } from "axios";

interface Props {
  className: string;
  taskId: string;
  setColumns: Dispatch<SetStateAction<Column[]>>;
  columns: Column[];
};

interface ApiDeleteTaskRes {
  status : string,
  column : Column,
  errMsgs : {
    otherErr : {msg : string},
    taskId : {msg : string},
  }
}

function DeleteTaskModal({
  className,
  setColumns,
  taskId,
}: Props) {
  const [loading, setLoading] = useState<boolean>(false);

  const deleteTask = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = (await callApiPost(
        `${conf.backendUrl}/delete/task/delete-tasks`,
        { taskId }
      )) as AxiosResponse<ApiDeleteTaskRes> | null;

      console.log("Response at Delete Tasks ::", res);

      if (res?.data?.status === "success" && res?.data?.column) {
        const updatedColumn = res.data.column;

        setColumns((prevColumns: Column[]) =>
          prevColumns.map((col: Column) =>
            col.id === updatedColumn.id ? { ...col, ...updatedColumn } : col
          )
        );

        toast.success("Task deleted");
      } else {
        const errMsg =
          res?.data?.errMsgs?.otherErr?.msg ||
          res?.data?.errMsgs?.taskId?.msg ||
          "Something went wrong.";
        toast.error(errMsg);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Could not delete task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={className}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] dark:bg-neutral-800 bg-white">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={deleteTask} className="grid gap-4 py-4">
            <DialogFooter>
              <Button type="button" variant="outline">
                <DialogClose>Cancel</DialogClose>
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={loading}
              >
                {loading ? (
                  <>
                    Deleting...
                  </>
                ) : (
                  "Delete Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DeleteTaskModal;
