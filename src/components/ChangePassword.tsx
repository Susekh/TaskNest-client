import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import conf from "@/conf/conf";
import { RootState } from "@/store/store";
import callApiPostChangePassword from "@/utils/profile/callApiPostChangePassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { z } from "zod";


const formSchema = z.object({
    password : z.string()
                .min(8, { message: "Password must be at least 8 characters long." })
                .max(50, { message: "Password must not exceed 50 characters." })
                .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
                .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
                .regex(/[0-9]/, { message: "Password must contain at least one number." })
                .regex(/[\W_]/, { message: "Password must contain at least one special character."}),
    newPassword : z.string()
                .min(8, { message: "Password must be at least 8 characters long." })
                .max(50, { message: "Password must not exceed 50 characters." })
                .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
                .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
                .regex(/[0-9]/, { message: "Password must contain at least one number." })
                .regex(/[\W_]/, { message: "Password must contain at least one special character."}),
    confirmPassword : z.string(),
    })

type fieldStrings = "password" | "newPassword" | "confirmPassword" | "root" | `root.${string}`

function ChangePassword() {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const user = useSelector((store : RootState) => store.user.userData)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          password: "",
        },
      })


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        if(values.newPassword !== values.confirmPassword){
            form.setError('confirmPassword', {
                type: 'manual',
                message: "Confirm Passowrd doesn't match password",
              })
        }

        const data = await callApiPostChangePassword(`${conf.backendUrl}/profile/edit-password`,
            {
                id : user.id,
                newPassword : values.newPassword,
                password : values.password
            }
        )

        const errArr = data?.errMsgs?.formErr;
        
        if(data?.status === "failed") {
          console.log("data after failing :: ", data);
          
          errArr?.map((idx : {field : fieldStrings, isErr : boolean, msg : string}) => {
            if(idx.isErr) {
              form.setError(idx.field, {
                type: 'manual',
                message: idx.msg,
              })
            };
          })
        }
    
        if(data?.status === "success") {
          toast.success(`${data.successMsg}`);
          navigate("/");
          window.location.reload();
        }

        setIsLoading(false);
    }

    

  return (
    <>
    <div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          name="newPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type={showNewPassword? "text" : "password"} placeholder="New Password" {...field} />
              </FormControl>
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="text-gray-500 absolute top-8 right-3">{showNewPassword ? <EyeOff/> : <Eye/>}</button>
              <FormMessage />
            </FormItem>
          )}
          />    

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type={showConfirmPassword? "text" : "password"} placeholder="confirm Password" {...field} />
              </FormControl>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-gray-500 absolute top-8 right-3">{showConfirmPassword ? <EyeOff/> : <Eye/>}</button>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full bg-blue-600 text-white hover:bg-blue-800 duration-200 dark:hover:bg-neutral-800 " disabled={isLoading} type="submit">Save</Button>
        </form>
        </Form>
    </div>
    </>
  )
}

export default ChangePassword