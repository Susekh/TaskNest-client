import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";


type UseApiPostReturn = {
  data: any;  
  isLoading: boolean;
  error: string | null;
};

function useApiPost(url: string, body: object): UseApiPostReturn {
  const [data, setData] = useState(null); 
  const [isLoading, setIsLoading] = useState<boolean>(false);  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const postData = async () => {
      setIsLoading(true);  
      setError(null);     

      try {
        const res = await axios.post(url, body, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });

        console.log("Fetched Project ::", res.data);
        

        setData(res.data);  
      } catch (err) {
        if (err instanceof AxiosError) {
          console.error("Axios Error:", err.response?.data);
          setError(err.response?.data?.message || "Something went wrong");
        } else {
          console.error("Unexpected Error:", err);
          setError("Unexpected error occurred");
        }
      } finally {
        setIsLoading(false); 
      }
    };

    postData();

  }, [url]);  

  return { data, isLoading, error }; 
}

export default useApiPost;
