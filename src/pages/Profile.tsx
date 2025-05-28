import { useState, useRef, ChangeEvent } from "react";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Camera, Edit, User, Mail, Calendar, AtSign } from "lucide-react";
import toast from "react-hot-toast";
import callApiPost from "@/utils/callApiPost";
import conf from "@/conf/conf";
import { login } from "@/store/userSlice";
import { AxiosResponse } from "axios";


type UploadResponse = {
  imgUrl: string;
};

function Profile() {
  const { userData: user } = useSelector((store: RootState) => store.user);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const profileList = [
    {
      id: 1,
      title: "Username",
      content: user.username,
      icon: <AtSign className="w-5 h-5" />,
    },
    {
      id: 2,
      title: "Full Name",
      content: user.name,
      icon: <User className="w-5 h-5" />,
    },
    {
      id: 3,
      title: "Email",
      content: user.email,
      icon: <Mail className="w-5 h-5" />,
    },
    {
      id: 4,
      title: "Date Joined",
      content: new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      icon: <Calendar className="w-5 h-5" />,
    },
  ];

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profileImage", file);

      const response = (await callApiPost(
        `${conf.backendUrl}/upload/profile-picture`,
        formData
      )) as AxiosResponse<UploadResponse> | null;

      if (response?.status !== 200) {
        toast.error("Failed to update profile image");
        console.log("response for file upload ::", response);
        return;
      }

      const { imgUrl: uploadedImageUrl } = response.data;
      setPreviewImage(uploadedImageUrl);
      toast.success("Successfully updated profile image");

      const updatedUser = {
        ...user,
        imgUrl: uploadedImageUrl,
        email: user.email ?? "", 
      };

      dispatch(login(updatedUser));
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
      setPreviewImage("");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col">
      {/* Header background */}
      <div className="w-full h-32 md:h-40 bg-gradient-to-r from-teal-500 to-emerald-200"></div>

      {/* Main content */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 mb-8 flex flex-col md:flex-row gap-6">
        {/* Left: Profile image + button */}
        <div className="w-full md:w-1/4 flex flex-col items-center">
          <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border-3 border-white dark:border-neutral-800 overflow-hidden shadow-md group mb-4">
            <img
              src={previewImage || user.imgUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={handleImageClick}
            >
              <Camera className="w-6 h-6 text-white" />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                  <div className="w-6 h-6 border-3 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-center bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 w-full">
            <h1 className="text-lg font-bold text-neutral-800 dark:text-white mb-1">
              {user.name}
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
              @{user.username}
            </p>
            <button
              onClick={() => navigate("/profile/edit")}
              className="w-full flex items-center justify-center gap-1 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300 dark:bg-blue-500 dark:hover:bg-blue-600 font-medium"
            >
              <Edit className="w-3 h-3" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right: Details */}
        <div className="w-full md:w-3/4">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-base font-semibold text-neutral-800 dark:text-white">
                Profile Information
              </h2>
            </div>
            <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {profileList.map((item) => (
                <li key={item.id} className="flex items-start px-4 py-3">
                  <div className="flex-shrink-0 pt-1 text-neutral-500 dark:text-neutral-400">
                    {item.icon}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      {item.title}
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200">
                      {item.content}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
