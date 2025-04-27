import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogClose,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { useState, FormEvent } from "react";
  import toast from "react-hot-toast";
  import { useNavigate } from "react-router-dom";
  import callApiPost from "@/utils/callApiPost";
  import conf from "@/conf/conf";
  import { Trash } from "lucide-react";
  
  type Props = {
    className?: string;
    projectId: string | undefined;
  };
  
  function DeleteProjectModal({ className = "", projectId }: Props) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  
    const handleDeleteProject = async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        const res = await callApiPost(
          `${conf.backendUrl}/delete/project/delete-project`,
          { projectId }
        );
  
        if (res?.status === 200) {
          toast.success("Project deleted");
          navigate("/");
          window.location.reload();
        }
      } catch (error) {
        toast.error("Unable to delete the project");
        console.error("Error deleting the project:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className={`flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800 transition-colors shadow-md first-letter:${className}`}>
            <Trash className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] dark:bg-neutral-800 ">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you absolutely sure? This will delete all data associated with
              the project. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDeleteProject} className="grid gap-4 py-4">
            <DialogFooter>
              <Button type="button" variant="outline">
                <DialogClose>Cancel</DialogClose>
              </Button>
              <Button type="submit" variant="destructive" disabled={loading}>
                {loading ? "Deleting..." : "Delete Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
  
  export default DeleteProjectModal;
  