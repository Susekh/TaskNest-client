import { useState, FormEvent, ChangeEvent, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "../../ui/dialog";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { RootState } from "@/store/store";
import { login } from "@/store/userSlice";
import toast from "react-hot-toast";
import axios from "axios";
import conf from "@/conf/conf";
import { X, Loader2 } from "lucide-react";

type Props = {
  className: string;
};

function CreateProjectModal({ className }: Props) {
  const user = useSelector((store: RootState) => store.user.userData);
  const [name, setName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024)
      return toast.error("Image too large (max 5MB)");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        `${conf.backendUrl}/upload/single`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const url = res.data.data.fileUrl;
      setImgUrl(url);
      toast.success("Image uploaded");
    } catch (err) {
      console.error("Upload error", err);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!imgUrl) return;
    const key = imgUrl.split("amazonaws.com/")[1];
    try {
      await axios.post(
        `${conf.backendUrl}/delete/file/${key}`,
        { url: imgUrl },
        { withCredentials: true }
      );
      toast.success("Image removed");
    } catch (err) {
      toast.error("Failed to delete image");
      console.error("failed to delete image ::", err);
    } finally {
      setImgUrl("");
    }
  };

  const createProject = async (e: FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await axios.post(
        `${conf.backendUrl}/create/project/newProject`,
        { name, imgUrl, userId: user.id },
        { withCredentials: true }
      );
      dispatch(login(res?.data?.user));
      navigate(`/projects/${res?.data.projectId}`);
      setName("");
      setImgUrl("");
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className} variant="outline">
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Fill up details for your new project
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="thumbnail" className="text-right">
              Thumbnail
            </Label>
            <div className="col-span-3 flex flex-col gap-2">
              {imgUrl && (
                <div className="relative w-full max-w-[120px]">
                  <img
                    src={imgUrl}
                    alt="thumbnail"
                    className="rounded shadow border w-full"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-white rounded-full p-1"
                    onClick={handleRemoveImage}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              {!imgUrl && (
                <Button
                  type="button"
                  variant="outline"
                  className="text-xs"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    "Upload Thumbnail"
                  )}
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={uploading || !name || creating}>
              {creating ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                "Add Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProjectModal;
