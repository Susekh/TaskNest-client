import conf from "@/conf/conf"
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import getGoogleOauthUrl from "@/utils/getGoogleOauthUrl";

function OauthOptions() {

  return (
    <div className="flex flex-col gap-4 border-b pb-8">
        <a href={`https://github.com/login/oauth/authorize?client_id=${conf.clientIdGithub}`} className="p-2 border hidden justify-center items-center gap-8 w-full rounded-md hover:bg-gray-100 dark:hover:bg-neutral-950 shadow-md"><FaGithub/>Github</a>
        <a href={getGoogleOauthUrl()} className="p-2 border flex justify-center items-center gap-8 w-full rounded-md hover:bg-gray-100 dark:hover:bg-neutral-950 shadow-md"><FcGoogle/>Google</a>
    </div>
  )
}

export default OauthOptions