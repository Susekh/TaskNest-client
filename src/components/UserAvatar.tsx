import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound, Loader2 } from "lucide-react";
import clsx from "clsx";

interface UserAvatarProps {
  src: string;
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-14 h-14",
};

const UserAvatar = ({ src, isLoading = false, size = "md" }: UserAvatarProps) => {
  const avatarSize = sizeClasses[size];

  return (
    <div className={clsx("relative inline-block", avatarSize)}>
      <Avatar className={clsx(avatarSize, isLoading && "opacity-60 pointer-events-none")}>
        <AvatarImage src={src} alt="User avatar" referrerPolicy="no-referrer" />
        <AvatarFallback>
          <UserRound className="w-5 h-5 text-gray-500" />
        </AvatarFallback>
      </Avatar>

      {isLoading && (
        <div className={clsx("absolute inset-0 flex items-center justify-center", avatarSize)}>
          <Loader2 className="animate-spin w-5 h-5 text-gray-600" />
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
