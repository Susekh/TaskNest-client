import axios, { isAxiosError } from "axios";
import toast from "react-hot-toast";

type HttpMethodType = "get" | "post" | "put" | "delete";

const callApi = async <T>(
  method: HttpMethodType,
  url: string,
  body: any = null
): Promise<T | null> => {
  try {
    const isFormData = body instanceof FormData;
    const config = {
      method,
      url,
      data: body,
      withCredentials: true,
      headers: isFormData ? {} : { "Content-Type": "application/json" },
    };

    const res = await axios(config);

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      toast.error(error?.response?.data?.errMsgs?.otherErr?.msg);
    }
    console.error(`Error at callApi :: ${method.toUpperCase()}`, error);
    return null;
  }
};

// GET Request
const callApiGet = async <T>(url: string): Promise<T | null> => {
  return callApi<T>("get", url);
};

// POST Request
const callApiPost = async <T>(url: string, body: any): Promise<T | null> => {
  return callApi<T>("post", url, body);
};

// PUT Request
const callApiPut = async <T>(url: string, body: any): Promise<T | null> => {
  return callApi<T>("put", url, body);
};

// DELETE Request
const callApiDelete = async <T>(url: string, body: any = null): Promise<T | null> => {
  return callApi<T>("delete", url, body);
};

export { callApi, callApiGet, callApiPost, callApiPut, callApiDelete };
