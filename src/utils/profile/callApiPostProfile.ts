import axios from "axios"
import toast from "react-hot-toast"


type ApiPostType = {
    status : string,
    statusCode : number,
    errMsgs? :{ 
        formErr? : []
        otherErr : {isErr : boolean, msg : string}
    },
    successMsg : {
        msg : string
    }
}

type ProfileBody = {
    id : string,
    username : string,
    name : string,
    email : string
}


const callApiPostProfile = async (url : string, body : ProfileBody) => {
    try {
        const res = await axios.post<ApiPostType>(url, {body}, {
            withCredentials : true,
            headers : {'Content-Type' : 'application/json'},
        });
    
        return res.data
    } catch (error) {
        if(axios.isAxiosError(error)){
            return error.response?.data;
        } else {
            toast.error("An unkown error occured");
        }
    }
}

export default callApiPostProfile;