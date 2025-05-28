import { CloudLightning } from "lucide-react";
import UserBtn from "./UserBtn";
import { Link } from "react-router-dom";
import { ModeToggle } from "./ModeToggle";


function Navbar() {
  return (
    <div className=" text-neutral-600 dark:bg-neutral-800 bg-gray-100 dark:text-white p-2 pl-4 pr-4 flex justify-between items-center duration-500 border-b-2 border-neutral-300">
      <Link to={'/'}>
        <CloudLightning/>
      </Link>
      <div className="flex gap-8">
        <ModeToggle />
        <UserBtn/>
      </div>
      
    </div>
  )
}

export default Navbar