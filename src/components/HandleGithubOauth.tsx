import conf from "@/conf/conf";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthShimmer from "./loaders/shimmers/AuthShimmer";
import { useDispatch } from "react-redux";
import { login } from "@/store/userSlice";


function HandleGithubOauth() {

  const dispatch = useDispatch();

  const navigate = useNavigate();
    
    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const codeParam = urlParams.get("code");
        
        const handleGithubAuth = async () => {
          try {
            const response = await axios.post(
              `${conf.backendUrl}/auth/Oauth/github`,
              { code: codeParam },
              {
                withCredentials: true,
                headers: { "Content-Type": "application/json" },
              }
            );
            const res = response.data;

            if (res.statusCode === 201) {
              dispatch(login(res.user));
              navigate('/dashboard');
            }
          } catch (error) {
            console.error("Error during GitHub OAuth:", error);
            toast.error("Error while authenticating through GitHub")
            navigate('/auth');
          }
        };
    
        handleGithubAuth();

    }, [navigate, dispatch]);

  return (
    <AuthShimmer/>
  )
}

export default HandleGithubOauth