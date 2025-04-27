import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../ui/input";
import { FormEvent, useState } from "react";
import callApiPost from "@/utils/callApiPost";
import conf from "@/conf/conf";
import { useNavigate } from "react-router-dom";

type Props = {
  className: string;
  projectId: string;
};

function CreateSprintModal({ className, projectId }: Props) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();


  const createSprint = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const res = await callApiPost(`${conf.backendUrl}/create/sprint`, {
        name,
        startDate,
        endDate,
        projectId,
      });

      console.log("Response from backend:", res);

      navigate(`sprints/${res?.data?.sprint?.id}`);

      setName("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className} variant="outline">
          Create Sprint
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Sprint</DialogTitle>
          <DialogDescription>Fill up details for your new sprint</DialogDescription>
        </DialogHeader>
        <form onSubmit={createSprint} className="grid gap-4 py-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              End Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add Sprint</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSprintModal;
