import { Sprint, User } from "@/types/types";
import axios, { isAxiosError } from "axios";
import toast from "react-hot-toast";

type ApiPostType = {
  status: string;
  statusCode: number;
  errMsgs?: {
    formErr?: [];
    otherErr: { isErr: boolean; msg: string };
  };
  successMsg?: {
    msg: string;
  };
  projectId?: string;
  user?: User;
  sprint?: Sprint;
  msg? : string;
};

const callApiPost = async (url: string, body: any) => {
  try {
    const isFormData = body instanceof FormData;

    const res = await axios.post<ApiPostType>(url, body, {
      withCredentials: true,
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    });

    return res;
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(error?.response?.data?.errMsgs?.otherErr?.msg);
    }
    console.error("Error at callApiPost ::", error);

    return null;
  }
};

export default callApiPost;
