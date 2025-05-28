import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

type UseApiGetReturn = {
  data: null;
  isLoading: boolean;
  error: string | null;
};

function useApiGet(url: string): UseApiGetReturn {
  const [data, setData] = useState<null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await axios.get(url, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
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

    fetchData();
  }, [url]);

  return { data, isLoading, error };
}

export default useApiGet;
