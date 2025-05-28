import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import conf from "@/conf/conf"
import callApiPostProfile from "@/utils/profile/callApiPostProfile"



type fieldStrings = "username" | "name" | "email" | "root" | `root.${string}`

const formSchema = z.object({
  username: z.string()
              .min(3, { message: "Username must be at least 3 characters long." })
              .max(20, { message: "Username must not exceed 20 characters." })
              .regex(/^[a-zA-Z0-9_.]+$/, {
                message: "Username can only contain letters, numbers, and underscores."}),
  name : z.string()
          .min(2, { message: "Name must be at least 2 characters long." })
          .max(50, { message: "Name must not exceed 50 characters." })
          .regex(/^[a-zA-Z\s]+$/, {
            message: "Name can only contain letters and spaces.",}),
  email : z.string().email({
          message : "please enter a valid email address."})
  })


function EditProfileForm() {

    const user = useSelector((store : RootState) => store.user.userData);

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      name : user.name,
      email : user.email
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    
    setIsLoading(true)
    const data = await callApiPostProfile(`${conf.backendUrl}/profile/edit`, {email : values.email, username : values.username, name : values.name, id : user.id}); 

    const errArr = data?.errMsgs?.formErr;
    
    if(data?.status === "failed") {
      console.log("data after failing :: ", data);
      
      errArr?.map((idx : {field : fieldStrings, isErr : boolean, msg : string}) => {
        if(idx.isErr) {
          form.setError(idx.field, {
            type: 'manual',
            message: idx.msg,
          })
        }
      })
    }

    if(data?.status === "success") {
      //Todo -> redirect && show toast
      toast.success(`${data.successMsg}`);
      navigate("/");
      window.location.reload();
    }

    setIsLoading(false);
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-black dark:text-white">
        <p className=" text-center font-thin">Please fill in the details to get started.</p>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>
                Enter your full name here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email ID</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full bg-teal-600 text-white hover:bg-teal-800 duration-200 dark:hover:bg-teal-800 " disabled={isLoading} type="submit">Save</Button>
  
      </form>
    </Form>
  )
}

export default EditProfileForm