import ChangePassword from "@/components/ChangePassword";
import EditProfileForm from "@/components/EditProfileForm"
import { Button } from "@/components/ui/button";
import { useState } from "react";

function EditProfile() {
  const [isChangePassword, setIsChangePassword] = useState(false);

  return (
    <>  
    <div className='flex items-center justify-center lg:p-12 p-4 dark:bg-neutral-800'>
    <div className='border-2 dark:border-none shadow-lg rounded-lg pt-8 pb-8 pl-12 pr-12 lg:w-96 md:w-3/5 w-10/12 bg-white'>
        {isChangePassword ? <ChangePassword /> : <EditProfileForm/>}
        <div className=" border-t-2 pt-4 mt-4">
            <Button onClick={() => setIsChangePassword(!isChangePassword)} className="w-full bg-gray-800 text-white dark:hover:bg-neutral-800 " type="button">{isChangePassword ? 'Edit details' : 'Change password'}</Button>
        </div>
    </div>
    </div>
    </>
  )
}

export default EditProfile