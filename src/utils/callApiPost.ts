import axios from "axios"


type ApiPostType = {
    status : string,
    statusCode : number,
    errMsgs? :{ 
        formErr? : []
        otherErr : {isErr : boolean, msg : string}
    },
    successMsg? : {
        msg : string;
    }
    projectId? : string;
    user? : any;
    sprint? : any;
}


const callApiPost = async (url : string, body : any) => {
    try {
        const res = await axios.post<ApiPostType>(url, body, {
            withCredentials : true,
            headers : {'Content-Type' : 'application/json'},
        });
    
        return res
    } catch (error) {
        console.error("Error at callApiPost ::", error);
        return null;
    }
}

export default callApiPost;