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
  import callApiPost from "@/utils/callApiPost";
  import conf from "@/conf/conf";
  import { Trash2 } from "lucide-react";

  type Props = {
    className?: string;
    memberId: string;
  };
  
  function RemoveMemberModal({ className = "",  memberId }: Props) {
    const [loading, setLoading] = useState(false);
  
    const handleRemoveMember = async (e: FormEvent) => {
      e.preventDefault();
      setLoading(true);
  
      try {
        const res = await callApiPost(
          `${conf.backendUrl}/delete/project/delete-member`,
          {  memberId }
        );
  
        if (res?.status === 200) {
          toast.success("Member removed from project");
          window.location.reload();
        }
      } catch (error) {
        toast.error("Unable to remove member");
        console.error("Error removing member:", error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Dialog>
        <DialogTrigger className={className} asChild>
          <Button className="bg-white w-full p-0 hover:bg-red-100 text-red-500">
            <div className="mr-auto flex">
              <Trash2 className="w-4 h-4 mr-4" />
              Remove User
            </div>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] dark:bg-neutral-800">
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this member from the project? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRemoveMember} className="grid gap-4 py-4">
            <DialogFooter>
              <Button type="button" variant="outline">
                <DialogClose>Cancel</DialogClose>
              </Button>
              <Button type="submit" variant="destructive" disabled={loading}>
                {loading ? "Removing..." : "Remove Member"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
  
  export default RemoveMemberModal;
  