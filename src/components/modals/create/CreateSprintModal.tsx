import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../ui/dialog";
import { Label } from "@radix-ui/react-label";
import { FormEvent, useState } from "react";
import callApiPost from "@/utils/callApiPost";
import conf from "@/conf/conf";
import { useNavigate } from "react-router-dom";
import DatePicker from "@/components/ui/DatePicker";

type Props = {
  className: string;
  projectId: string;
  disabled: boolean;
};


function CreateSprintModal({ className, projectId, disabled }: Props) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const navigate = useNavigate();

  const createSprint = async (e: FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    try {
      const res = await callApiPost(`${conf.backendUrl}/create/sprint`, {
        name,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        projectId,
      });

      navigate(`sprints/${res?.data?.sprint?.id}`);

      setName("");
      setStartDate(null);
      setEndDate(null);
    } catch (error) {
      console.error("Error creating sprint:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`${className} font-semibold tracking-wide`}
          disabled={disabled}
          variant="outline"
        >
          Create Sprint
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100 shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mx-auto tracking-tight mb-1">
            Create Sprint
          </DialogTitle>
          <DialogDescription className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
            Fill out the details for your new sprint.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={createSprint} className="space-y-5">
          <div className="flex items-center justify-center gap-4">
            <Label
              htmlFor="name"
              className="text-right text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </Label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 text-center rounded-md border border-gray-300 px-3 py-2 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
              placeholder="Sprint Name"
              required
              type="text"
            />
          </div>

          <div className="flex items-center justify-center gap-4">
             <Label
              htmlFor="name"
              className="text-right text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </Label>
            <DatePicker
              id="startDate"
              date={startDate}
              onDateChange={setStartDate}
            />
          </div>

          <div className="flex items-center justify-center gap-4">
             <Label
              htmlFor="name"
              className="text-right text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </Label>
            <DatePicker
              id="endDate"
              date={endDate}
              onDateChange={setEndDate}
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="submit"
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-semibold"
            >
              Add Sprint
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateSprintModal;
