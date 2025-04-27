import { Button } from "@/components/ui/button";
import conf from "@/conf/conf";
import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

function ForgotPassword() {
    const [emailInput, setEmailInput] = useState('');
    const [isLoading, setIsLaoding] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    async function handleSubmit(e : FormEvent) {
        e.preventDefault();
        setIsLaoding(true);

        try {
            const res = await axios.post(`${conf.backendUrl}/auth/forgot-password`, 
                {
                    email : emailInput
                },
                {
                    withCredentials : true,
                    headers : {"Content-Type" : "application/json"},
                }
            )
    
            const data = res.data;
    
            console.log("Res in Forgot Password", data);
            toast.success(res.data.message);
            setIsEmailSent(true)
            console.log('working form ::', emailInput);
        } catch (error) {
            if(error instanceof AxiosError) {
                console.log("Err at Forgot Password ::", error);
                toast.error(error?.response?.data.message)   
            }
            
        } finally {
            setIsLaoding(false);
        }
    }

  return (
    <>
    <div className="flex items-center justify-center p-12 dark:bg-neutral-800 dark:text-white">
        <div className="">
            <h2 className="mb-4 text-center text-2xl font-bold dark:text-white">Forgot Password</h2>
            <form className="flex flex-col gap-4 border-2 border-neutral-400 p-8 rounded-md" onSubmit={(e) => handleSubmit(e)}>
                <p className=" ">Enter the Information below to recover the password</p>
                {
                    !isEmailSent ? 
                    (<>
                        <label className="font-semibold" htmlFor="email" >Email</label>
                        <input required={true} id="email" onChange={(e) => setEmailInput(e.target.value)} type="email" value={emailInput} className="border-2 rounded-md p-1" placeholder="Email"/>

                        <Button disabled={isLoading ? true : false} className="bg-blue-600 hover:bg-blue-700 duration-300" type="submit"> Recover </Button>
                    </>)
                    :
                    (
                        <div className="text-center">
                            <p className="font-semibold mb-2">Check your email for further steps.</p>
                            <span onClick={() => setIsEmailSent(false)} className="underline text-blue-600 hover:text-blue-800 duration-100 hover:cursor-pointer">Didn't receive Email?</span>
                        </div>
                    )
                }
                <Link to={'/auth'} className="text-center text-sm hover:underline text-blue-600 hover:text-blue-800 duration-150">Login Page</Link>
            </form>
        </div>
    </div>
    </>
  )
}

export default ForgotPassword