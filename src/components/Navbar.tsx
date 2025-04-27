import { CloudLightning } from "lucide-react";
import ThemeToggler from "./ThemeToggler";
import UserBtn from "./UserBtn";
import { Link } from "react-router-dom";

type props = {
  isDark : boolean,
  setIsDark : (dark : boolean) => void; 
}

function Navbar({isDark , setIsDark} : props) {
  return (
    <div className=" text-red-600 dark:bg-neutral-800 bg-gray-100 dark:text-white p-2 pl-4 pr-4 flex justify-between items-center duration-500 border-b-2 border-red-300">
      <Link to={'/'}>
        <CloudLightning/>
      </Link>
      <div className="flex gap-8">
        <ThemeToggler isDark={isDark} setIsDark={setIsDark}/>
        <UserBtn/>
      </div>
      
    </div>
  )
}

export default Navbar