import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

// Define the structure of the response data using a generic `T`
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
        // Specify the generic type `T` for the response
        const res = await axios.get(url, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setData(res.data);  // TypeScript infers that `res.data` is of type `T`
      } catch (err) {
        if (err instanceof AxiosError) {
          // Handle the Axios error type specifically
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
