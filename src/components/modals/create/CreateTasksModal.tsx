import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogClose,
} from "../../ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "../../ui/input";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import callApiPost from "@/utils/callApiPost";
import conf from "@/conf/conf";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import { Column, Sprint } from "@/types/types";
import { AxiosResponse } from "axios";
import DateTimePicker from "@/components/ui/DateTimePicker";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

interface Props {
  className: string;
  columnId: string;
  projectId: string;
  setSprint?: Dispatch<SetStateAction<Sprint>>;
  setColumns: Dispatch<SetStateAction<Column[]>>;
  columns?: Column[];
}

interface ApiNewTaskRes {
  column: Column;
}

function CreateTasksModal({
  className,
  setColumns,
  columnId,
  projectId,
}: Props) {
  const [name, setName] = useState("");
  const [content, setContent] = useState<string>("");
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);

  const createProject = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !content || !deadline) {
      toast.error("Please fill out all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = (await callApiPost(`${conf.backendUrl}/create/task/newTask`, {
        name,
        content,
        deadline: deadline.toISOString(),
        columnId,
        projectId,
      })) as AxiosResponse<ApiNewTaskRes> | null;

      if (res?.data?.column) {
        setColumns((prevColumns: Column[]) =>
          prevColumns.map((col: Column) =>
            col.id === res.data.column.id ? { ...col, ...res.data.column } : col
          )
        );
        setLoading(false);
      }

      setName("");
      setContent("");
      setDeadline(undefined);
      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error in creating Task", error);
      toast.error("Can't create Task");
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className} variant="outline">
          <p className="text-center text-sm text-neutral-500 p-2 dark:text-neutral-400 font-medium">
            Add New Task
          </p>
          <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add new item</DialogTitle>
          <DialogDescription>
            Fill up details for your new item
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={createProject} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
              Content
            </Label>
            <div className="col-span-3">
              <MDEditor
                value={content}
                onChange={(val) => setContent(val || "")}
                height={200}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deadline" className="text-right">
              End Date
            </Label>
            <div className="col-span-3">
              <DateTimePicker value={deadline} onChange={setDeadline} />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline">
              <DialogClose>Cancel</DialogClose>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateTasksModal;
