import conf from "@/conf/conf";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthShimmer from "./loaders/shimmers/AuthShimmer";



function HandleGoogleOauth() {

  const navigate = useNavigate();
    
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code");
        
        const handleGoogleAuth = async () => {
          try {
            const response = await axios.post(
              `${conf.backendUrl}/auth/Oauth/google`,
              { code: codeParam },
              {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
              }
            );
            const res = response.data;

            if (res.statusCode === 201) {
              navigate('/dashboard');
            }
          } catch (error) {
            console.error("Error during Google OAuth:", error);
            toast.error("Error while authenticating through Google")
            navigate('/auth');
          }
        };
    
        handleGoogleAuth();


    }, [navigate]);

  return (
    <AuthShimmer/>
  )
}

export default HandleGoogleOauth