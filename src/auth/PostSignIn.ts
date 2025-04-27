import conf from "@/conf/conf";
import axios from "axios";
import toast from "react-hot-toast";

type props = {
    username : string,
    password : string,
    email? : string,
}


type userType = {
    id : number,
    createdAt : Date,
    username : string,
    password : string,
    name : string,
    email? : string,
}

type SignInResponse = {
    status : string,
    statusCode : number,
    errMsgs? :{ 
        formErr : [
        {field : "username",isErr : boolean, msg : string},
        {field : "name",isErr : boolean, msg : string},
        {field : "dateOfCreation", isErr : boolean, msg : string},
        {field : "email",isErr : boolean, msg : string},],
        otherErr : {isErr : boolean, msg : string}
    },
    user? : userType | null,
    successMsg? : {
        msg : string
    }
}

export default async function PostSignIn( formData : props) {
    try {
        const res = await axios.post<SignInResponse>(`${conf.backendUrl}/auth/sign-in-user`,
            {
                username: formData.username,
                password : formData.password,
            },
            {   
                withCredentials : true,
                headers: { 'Content-Type': 'application/json' }
            }
        );
        return res
    
    } catch (error) {
        console.error(error);
        if(axios.isAxiosError(error)){
            return {
                data : {
                    status : "failed",
                    statusCode : error.status,
                    errMsgs : {formErr : error.response?.data.errMsgs.formErr, otherErr : {}},
                    successMsg : '',
                    user : null,
                    otherErr : 'Err caught at postSignIn',
                }
            };
        } else {
            toast.error("An unkown error occured");
        }
    }
}