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
import PostSignUp from "@/auth/PostSignUp"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import OauthOptions from "./OauthOptions"

type props = {
  setIsSignIn : (isSignIn : boolean) => void,
}

type fieldStrings = "username" | "password" | "name" | "email" | "root" | `root.${string}`

const formSchema = z.object({
  username: z.string()
              .min(3, { message: "Username must be at least 3 characters long." })
              .max(20, { message: "Username must not exceed 20 characters." })
              .regex(/^[a-zA-Z0-9_.]+$/, {
                message: "Username can only contain letters, numbers, and underscores."}),
  password : z.string()
              .min(8, { message: "Password must be at least 8 characters long." })
              .max(50, { message: "Password must not exceed 50 characters." })
              .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
              .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
              .regex(/[0-9]/, { message: "Password must contain at least one number." })
              .regex(/[\W_]/, { message: "Password must contain at least one special character."}),
  confirmPassword : z.string(),
  name : z.string()
          .min(2, { message: "Name must be at least 2 characters long." })
          .max(50, { message: "Name must not exceed 50 characters." })
          .regex(/^[a-zA-Z\s]+$/, {
            message: "Name can only contain letters and spaces.",}),
  email : z.string().email({
          message : "please enter a valid email address."})
  }).refine((data) => data.password === data.confirmPassword, {
    message : "Passwords do not match",
    path: ['confirmPassword'],
  })


function SignUpForm({setIsSignIn} : props) {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      name : "",
      email : ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setIsLoading(true);

    const result = await PostSignUp(values);
    const data = result?.data;

    console.log("result from backend : ", data);
    const errArr = data?.errMsgs?.formErr;

    if(!result) {
      toast.error("Met an unexpected Error.");
    }


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
    }

    setIsLoading(false);
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <p className=" text-center font-thin">Please fill in the details to get started.</p>
        <OauthOptions/>
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
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type={showPassword? "text" : "password"} placeholder="password" {...field} />
              </FormControl>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 absolute top-8 right-3">{showPassword ? <EyeOff/> : <Eye/>}</button>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Confrim Password</FormLabel>
              <FormControl>
                <Input type={showConfirmPassword? "text" : "password"} placeholder="confirm Password" {...field} />
              </FormControl>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-500 absolute top-8 right-3">{showConfirmPassword ? <EyeOff/> : <Eye/>}</button>
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

        <Button className="w-full bg-teal-800 text-white dark:hover:bg-teal-900 " disabled={isLoading} type="submit">Sign Up</Button>
        <div className="flex gap-2 justify-center font-light text-sm border-t-2 border-gray-300 p-4">
          <p>Already have an account?</p>
          <button type="button" className="font-semibold text-gray-500 hover:underline" onClick={() => setIsSignIn(true)}>Sign in</button>
        </div>
      </form>
    </Form>
  )
}

export default SignUpForm