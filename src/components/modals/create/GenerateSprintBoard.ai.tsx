import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import callApiPost from "@/utils/callApiPost";
import conf from "@/conf/conf";
import { Sprint } from "@/types/types";

interface GenerateBoardModalProps {
  sprintId?: string;
  setSprint: Dispatch<SetStateAction<Sprint | undefined>>;
}

export function GenerateBoardModal({
  sprintId,
  setSprint,
}: GenerateBoardModalProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await axios.post(
        `${conf.backendUrl}/genai/gemini/generate/sprint/${sprintId}`,
        {
          prompt,
        },
        { withCredentials: true }
      );
      setMessage(
        response.data.message || "Sprint board generated successfully."
      );

      const res = await callApiPost(`${conf.backendUrl}/fetch/sprint`, {
        sprintId,
      });

      console.log("Res in genai  ::", res);

      setSprint(res?.data.sprint);

      setPrompt("");
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.message ||
          "Failed to generate sprint board."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
  variant="default"
  className="
    relative
    rounded-lg
    border-2
    border-transparent
    bg-gradient-to-r
    from-blue-900
    to-blue-600
    bg-origin-border
    p-[2px]
    dark:text-white
    font-semibold
    transition
    duration-300
    ease-in-out
    hover:text-white
    hover:scale-105
    focus:outline-none
    focus:ring-4
    focus:ring-blue-600
    focus:ring-opacity-50
  "
>
  <span className="block rounded-md dark:bg-neutral-800 px-4 py-2 hover:bg-transparent hover:bg-gradient-to-r hover:from-blue-900 hover:to-blue-600 transition duration-300 ease-in-out">
    Generate Sprint Board
  </span>
</Button>

      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Sprint Board</DialogTitle>
          <DialogDescription>
            Enter a prompt describing the sprint board you want to generate.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          <Label htmlFor="prompt">Prompt</Label>
          <Input
            id="prompt"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g. Tasks for sprint 1 with login and auth"
            disabled={loading}
          />
        </div>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <DialogFooter>
          <Button
            onClick={handleGenerate}
            disabled={loading || prompt.trim() === ""}
          >
            {loading ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
