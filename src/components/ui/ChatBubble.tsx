import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Pencil, Trash2, Check, FileText, X } from "lucide-react";
import { MemberRole } from "@/types/types";

const ChatBubble = ({
  align = "start",
  name,
  time,
  id,
  content,
  status,
  avatar,
  fileUrl,
  onDelete,
  onUpdate,
}: {
  align?: "start" | "end";
  id: string;
  name: string;
  time: Date;
  role?: MemberRole;
  content: string;
  fileUrl?: string;
  status?: string;
  avatar?: string;
  chatMemberId?: string;
  onDelete: (id: string) => void;
  onUpdate: (content: string, id: string) => void;
}) => {
  const isStart = align === "start";
  const [hover, setHover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);

  const isOwner = align === "end";

  const handleEdit = () => setIsEditing(!isEditing);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editedContent.trim()) {
      onUpdate(editedContent, id);
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    if (editedContent.trim()) {
      onUpdate(editedContent, id);
      setIsEditing(false);
    }
  };

  const getFileType = (url: string): "image" | "video" | "other" => {
    const ext = url.split(".").pop()?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["mp4", "webm", "ogg"].includes(ext)) return "video";
    return "other";
  };

  return (
    <div
      className={cn(
        "flex gap-3 mb-4",
        isStart ? "flex-row" : "flex-row-reverse"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatar || ""} alt={name} />
        <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex flex-col max-w-[80%] relative",
          isStart ? "items-start" : "items-end"
        )}
      >
        {/* Header */}
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            {name}
          </span>
          <span className="ml-2 text-xs text-neutral-400">
            {format(new Date(time), "MMM d, h:mm a")}
          </span>
        </div>

        {/* Chat Bubble */}
        <div
          className={cn(
            "mt-1 px-4 py-2 rounded-lg text-sm relative break-words",
            isStart
              ? "bg-muted text-left rounded-bl-none bg-gray-900 text-white"
              : "bg-blue-500 text-white text-right rounded-br-none"
          )}
        >
          {isEditing ? (
            <div>
              <input
                type="text"
                className="bg-transparent border-b outline-none w-full text-white"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="text-xs text-gray-900 mt-2 bg-white rounded-md hover:bg-green-500 hover:text-white duration-300 px-2 hover:underline flex items-center gap-1"
                >
                  <Check size={14} /> Save
                </button>
                <button
                  onClick={handleEdit}
                  className="text-xs text-gray-900 mt-2 bg-red-200 hover:bg-red-500 hover:text-white duration-300 rounded-md px-2 hover:underline flex items-center gap-1"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>{editedContent}</div>
          )}

          {/* File Preview */}
          {fileUrl && (
            <div className="mt-2">
              {getFileType(fileUrl) === "image" && (
                <img
                  src={fileUrl}
                  alt="attachment"
                  className="max-w-full rounded-lg border mt-1"
                />
              )}

              {getFileType(fileUrl) === "video" && (
                <video controls className="max-w-full rounded-lg border mt-1">
                  <source src={fileUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}

              {getFileType(fileUrl) === "other" && (
                <a
                  href={fileUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 underline mt-1"
                >
                  <FileText size={16} /> Download file
                </a>
              )}
            </div>
          )}

          {/* Hover actions */}
          {isOwner && hover && !isEditing && (
            <div className={`absolute -top-10 right-0 left-0`}>
              <button
                onClick={handleEdit}
                className="text-xs text-neutral-400 hover:underline mr-2"
                title="Edit"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => onDelete(id)}
                className="text-xs text-neutral-400 hover:underline hover:text-blue-800 duration-300"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {status && <div className="text-xs text-gray-400 mt-1">{status}</div>}
      </div>
    </div>
  );
};

export default ChatBubble;
