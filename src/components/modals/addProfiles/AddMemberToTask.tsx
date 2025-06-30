import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../../ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../ui/input";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import conf from "@/conf/conf";
import callApiPost from "@/utils/callApiPost";
import { toast } from "react-hot-toast";
import { AxiosResponse } from "axios";
import { Member } from "@/types/types";

type Props = {
  className: string;
  projectId: string;
  taskId: string;
  taskMembers: Member[];
  setTaskMembers: Dispatch<SetStateAction<Member[]>>;
  onMembersAdded?: (memberIds: string[]) => void;
};

type ApiAddToTaskRes = {
  task: {
    members: Member[];
  };
};

type ApiFetchMembers = {
  members: Member[];
};

function AddMemberToTask({
  className,
  projectId,
  taskId,
  setTaskMembers,
  onMembersAdded,
}: Props) {
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<Member[] | undefined>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch members when projectId changes or dialog opens
  useEffect(() => {
    if (isDialogOpen && projectId) {
      fetchMembers();
    }
  }, [projectId, isDialogOpen]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = (await callApiPost(
        `${conf.backendUrl}/fetch/project-members`,
        { projectId }
      )) as AxiosResponse<ApiFetchMembers> | null;
      setMembers(response?.data?.members);
      setError(null);
    } catch (err) {
      if (err) {
        setError("Failed to fetch members. Please try again later.");
        toast.error("Failed to fetch members. Please try again later.", err);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Filter members based on the search query
  const filteredMembers = members?.filter(
    (member) =>
      member.user.username.toLowerCase().includes(search.toLowerCase()) ||
      member.user.name.toLowerCase().includes(search.toLowerCase())
  );

  // Toggle member selection
  const handleSelectMember = (memberId: string) => {
    setSelectedMembers((prev) => {
      if (prev.includes(memberId)) {
        return prev.filter((id) => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  // Handle submitting the form to add members to the task
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    setSubmitting(true);
    try {
      const response = (await callApiPost(
        `${conf.backendUrl}/add-profiles/task/add-to-task`,
        {
          taskId,
          memberIds: selectedMembers,
        }
      )) as AxiosResponse<ApiAddToTaskRes> | null;

      if (response?.status === 200 || response?.status === 201) {
        setMembers(response?.data?.task?.members);

        toast.success("Members added to task successfully");
        setTaskMembers(response?.data?.task?.members);
        // Call the callback function if provided
        if (onMembersAdded) {
          onMembersAdded(selectedMembers);
        }

        // Reset selection and close dialog
        setSelectedMembers([]);
        setIsDialogOpen(false);
      } else {
        toast.error("Failed to add members to task");
      }
    } catch (err) {
      console.error("Error adding members to task:", err);
      toast.error("Failed to add members to task. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className={className} variant="outline">
            Add Member
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Member to Task</DialogTitle>
            <DialogDescription>
              Choose members to assign to the task
            </DialogDescription>
          </DialogHeader>

          <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
            {/* Search Bar */}
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="search" className="text-sm font-semibold">
                Search Members
              </Label>
              <Input
                id="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by name or username"
                className="p-2 border rounded"
              />
            </div>

            {/* Loading / Error State */}
            {loading && (
              <p className="text-sm text-gray-500">Loading members...</p>
            )}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Selected Members Count */}
            {selectedMembers.length > 0 && (
              <p className="text-sm text-blue-600">
                {selectedMembers.length}{" "}
                {selectedMembers.length === 1 ? "member" : "members"} selected
              </p>
            )}

            {/* Members List */}
            <div className="max-h-64 overflow-y-auto grid gap-2 mt-2">
              {(filteredMembers ?? []).length > 0 ? (
                filteredMembers?.map((member) => {
                  const isSelected = selectedMembers.includes(member.id);
                  return (
                    <div
                      key={member.id}
                      className={`flex items-center gap-4 p-2 cursor-pointer rounded border ${
                        isSelected
                          ? "bg-blue-50 dark:bg-gray-900 border-blue-300"
                          : "dark:hover:bg-neutral-900 hover:bg-neutral-100 border-transparent"
                      }`}
                      onClick={() => handleSelectMember(member.id)}
                    >
                      <img
                        src={
                          member.user.imgUrl || "https://github.com/shadcn.png"
                        }
                        alt={member.user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {member.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{member.user.username}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-gray-500">No members found</p>
              )}
            </div>

            <DialogFooter className="gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || selectedMembers.length === 0}
              >
                {submitting ? "Adding..." : "Add Selected Members"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddMemberToTask;
