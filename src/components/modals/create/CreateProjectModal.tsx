import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "../../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../../ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "../../ui/input";
import { FormEvent, useState } from "react";
import callApiPost from "@/utils/callApiPost";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import conf from "@/conf/conf";
import { useNavigate } from "react-router-dom";
import { login } from "@/store/userSlice";

type Props = {
    className : string;
}

function CreateProjectModal({ className } : Props) {

    const user = useSelector((store : RootState) => store.user.userData);
    const [name, setName] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const createProject = async (e : FormEvent) => {
        e.preventDefault(); // Prevent default form submission
        // Handle project creation here
    const res = await callApiPost(`${conf.backendUrl}/create/project/newProject`, {name, imgUrl, userId : user.id});
    console.log("res from backend ::", res);
    
    dispatch(login(res?.data?.user));

    navigate(`/projects/${res?.data.projectId}`);

    // Reset the form fields after submission
    setName("");
    setImgUrl("");
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className={className} variant="outline">Create Project</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Fill up details for your new project</DialogDescription>
          </DialogHeader>
          <form onSubmit={createProject} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name} // controlled input
                onChange={(e) => setName(e.target.value)} // handle change
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                value={imgUrl} // controlled input
                onChange={(e) => setImgUrl(e.target.value)} // handle change
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Add Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CreateProjectModal;
