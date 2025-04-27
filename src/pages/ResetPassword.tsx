import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import conf from "@/conf/conf";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom"
import { z } from "zod";


const formSchema = z.object({
    
    password : z.string()
                .min(8, { message: "Password must be at least 8 characters long." })
                .max(50, { message: "Password must not exceed 50 characters." })
                .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
                .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
                .regex(/[0-9]/, { message: "Password must contain at least one number." })
                .regex(/[\W_]/, { message: "Password must contain at least one special character."}),
    confirmPassword : z.string(),
    })

function ResetPassword() {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          password: "",
        },
      })


    const {token} = useParams();


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        if(values.password !== values.confirmPassword){
            form.setError('confirmPassword', {
                type: 'manual',
                message: "Confirm Passowrd doesn't match password",
              })
        }

        const res = await axios.post(`${conf.backendUrl}/auth/reset-password`,
            {
                token : token,
                newPassword : values.password
            },
            {
                withCredentials : true,
                headers : {'Content-Type' : 'application/json'}
            }
        )

        const data = res.data;

        console.log("Data at reset Password ::", data);
        
        

        if(data.message === "Password reset successful") {
            toast.success("Password changed, You'll be redirected to login page now.");
            setIsLoading(false);
            setTimeout(() => {
                navigate('/auth');
            }, 1500);
        }
    }

    

  return (
    <>
    <div className="flex items-center justify-center p-12">
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 lg:w-1/3 p-8 border-2 rounded-md">
            <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>New Password</FormLabel>
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
        <Button className="w-full bg-gray-800 text-white dark:hover:bg-neutral-800 " disabled={isLoading} type="submit">Reset</Button>
        </form>
        </Form>
    </div>
    </>
  )
}

export default ResetPassword