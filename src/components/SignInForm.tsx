import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import PostSignIn from "@/auth/PostSignIn"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "@/store/userSlice"
import OauthOptions from "./OauthOptions"

type props = {
  setIsSignIn : (isSignIn : boolean) => void,
}

type fieldStrings = `root.${string}` | "username" | "password" | "root"

const formSchema = z.object({
  username: z.string()
              .min(3, { message: "Username must be at least 3 characters long." })
              .max(20, { message: "Username must not exceed 20 characters." })
              .regex(/^[a-zA-Z0-9_.]+$/, {
                message: "Username can only contain letters, numbers, and underscores.",
  }),
  password : z.string()
              .min(8, { message: "Password must be at least 8 characters long." })
              .max(50, { message: "Password must not exceed 50 characters." })
              .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
              .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
              .regex(/[0-9]/, { message: "Password must contain at least one number." })
              .regex(/[\W_]/, { message: "Password must contain at least one special character."
  }),
})


function SignInForm({setIsSignIn} : props) {
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setIsLoading(true);

    const result = await PostSignIn(values);
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
      
      if(data.user) {
        dispatch(login(data.user));
      } else {
        toast.error('can not get user');
      }
      
      toast.success(`${data.successMsg}`);
      navigate("/dashboard");
    }

    setIsLoading(false);
    
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <p className=" text-center font-thin">Please Sign in to continue</p>
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
              <button type="button" onClick={() => navigate('/auth/forgot-password')} className="hover:underline text-sm block ml-auto text-gray-600 hover:text-blue-800 duration-100">Forgot Password?</button>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 absolute top-8 right-3">{showPassword ? <EyeOff/> : <Eye/>}</button>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full bg-gray-800 text-white dark:hover:bg-gray-900" disabled={isLoading} type="submit">Login</Button>
        <div className="flex gap-2 justify-center font-light text-sm border-t-2 border-gray-300 p-4">
          <p>Don’t have an account?</p>
          <button type="button" className="font-semibold text-gray-500 hover:underline" onClick={() => setIsSignIn(false)}>Sign up</button>
        </div>
      </form>
    </Form>
  )
}

export default SignInForm