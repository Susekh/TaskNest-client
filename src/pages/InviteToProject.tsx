import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import conf from "@/conf/conf";
import callApiPost from "@/utils/callApiPost";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { AxiosResponse } from "axios";

interface ApiAddProjectRes {
  message: string;
}

const InviteToProject = () => {
  const { inviteCode, projectId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((store: RootState) => store.user.userData);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const inviteUserToProject = async () => {
      try {
        const response = (await callApiPost(
          `${conf.backendUrl}/add-profiles/projects/add-to-project`,
          {
            inviteCode,
            userId: user.id,
          }
        )) as AxiosResponse<ApiAddProjectRes> | null;

        if (response?.status === 200) {
          toast.success(response.data.message);
          navigate(`/projects/${projectId}`);
        }
      } catch (error) {
        console.error("Error inviting user:", error);
        setError("Something went wrong while inviting the user.");
        toast.error("Something went wrong while inviting to the project");
      } finally {
        setLoading(false);
      }
    };

    if (inviteCode && projectId) {
      inviteUserToProject();
    } else {
      setLoading(false);
      setError("Invalid invite or project ID.");
    }
  }, [inviteCode, projectId, navigate, user.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-black">
        <div className="space-y-4 w-full max-w-md p-6">
          {/* Shimmer Text */}
          <div className="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-700 shimmer" />
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 shimmer mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center bg-red-100 text-red-600 p-4 rounded-lg shadow-lg max-w-md">
          <p className="text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default InviteToProject;
