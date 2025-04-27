import { RootState } from "@/store/store";
import { LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom";
import UserAvatar from "./UserAvatar";
import axios from "axios";
import toast from "react-hot-toast";
import GetLogOut from "@/auth/GetLogOut";
import { logout } from "@/store/userSlice";
import { User as UserType } from "@/types/types";


function UserBtn() {
    const res = useSelector((store : RootState) => store.user);
    const userStatus : boolean = res.status;
    const user : UserType = res.userData;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const [isVisible, setIsVisible] = useState(false);


    console.log("user ::",user);

    const dropdownRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleDropdown = () => setIsVisible(prev => !prev);

    const handleLogout = () => {

        setIsLoading(true);

        (async () => {
            try {
            const res = await GetLogOut();

            if (res?.status === "success") {
                toast.success("User Logged Out");
                navigate("/auth");
                dispatch(logout());
            }

            } catch (error) {
                if(axios.isAxiosError(error)){
                    toast.error(error.response?.data.errMsgs.otherErr);
                } else {
                    toast.error("Couldn't logout User");
                }
            } finally {
                setIsLoading(false);
            }
        })()
        
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsVisible(false);
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    

  return (
    <>
    <div>
            {userStatus ? (
                <button 
                ref={buttonRef}
                onClick={toggleDropdown} 
                className="realtive"> 
                    {user.imgUrl ? 
                            (<UserAvatar src={user.imgUrl} isLoading={isLoading} />) 
                            : 
                            (<UserAvatar src="https://github.com/shadcn.png" isLoading={isLoading} />
                        )}
                    <ul 
                        ref={dropdownRef}
                        className={`${isVisible ? "opacity-100 visible" : "opacity-0 invisible"} transition-opacity duration-150 ease-linear absolute right-4 border-2 dark:border-0 p-2 rounded-lg text-left font-thin leading-8 bg-white dark:bg-neutral-600`}>
                        <li><button onClick={() => navigate("/profile")} className="flex w-full items-center gap-2 pl-2 pr-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-500"><User className="w-4"/> Profile </button></li>
                        <li><button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 pl-2 pr-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-500"><User className="w-4"/> Dashboard </button></li>
                        <li><button className="flex w-full items-center pl-2 pr-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-500 gap-2" onClick={handleLogout}><LogOut className="w-4"/>Logout</button></li>
                    </ul>
                </button>
            ) : (
                <Link className="p-2 block hover:underline" to={"/auth"}>Login</Link>
            )}
        </div>
    </>
  )
}

export default UserBtn