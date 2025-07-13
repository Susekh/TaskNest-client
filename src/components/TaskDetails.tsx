import { format } from "date-fns";
import ChatBubble from "./ui/ChatBubble";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createSocketConnection } from "@/utils/socket";
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import conf from "@/conf/conf";
import callApiPost from "@/utils/callApiPost";
import AddMemberToTask from "./modals/addProfiles/AddMemberToTask";
import { useNavigate } from "react-router-dom";
import "@uiw/react-markdown-preview/markdown.css";
import { X, MessageCircle, Paperclip, Loader2, Users } from "lucide-react";
import { Member, Message, Task } from "@/types/types";
import axios, { AxiosResponse } from "axios";
import MDEditor from "@uiw/react-md-editor";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface TaskDetailsProps {
  task: Task;
}

interface ApiFetchMessagesRes {
  chatMessages: Message[];
}

const TaskDetails = ({ task }: TaskDetailsProps) => {
  const user = useSelector((store: RootState) => store.user.userData);
  const mem = user.members?.find((m) => m.projectId === task.projectId);
  const member = mem as Member | undefined;
  const [taskMembers, setTaskMembers] = useState<Member[]>(task.members || []);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const navigate = useNavigate();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    const observer = new MutationObserver(() => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = (await callApiPost(`${conf.backendUrl}/fetch/messages`, {
          taskId: task.id,
        })) as AxiosResponse<ApiFetchMessagesRes> | null;
        setMessages((res?.data.chatMessages ?? []).reverse());
      } catch (error) {
        toast.error("Error occurred while fetching messages.");
        console.error("Error in fetching messages ::", error);
      }
    };

    fetchMessages();
  }, [task.id]);

  useEffect(() => {
    if (socketRef.current) return;
    const socket = createSocketConnection();
    socketRef.current = socket;
    socket.emit("joinGroupChat", task.id);

    socket.on("receiveGroupMessage", ({ message }) => {
      setMessages((prev) => [...prev, message]);
      setIsSending(false);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [task.id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeout);
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !uploadedFileUrl) return;
    if (!member || !task?.id) return;

    setIsSending(true);

    try {
      socketRef.current?.emit("sendGroupMessage", {
        groupId: task.id,
        message,
        senderId: member.id,
        name: user.name,
        fileUrl: uploadedFileUrl,
      });

      setMessage("");
      setFile(null);
      setUploadedFileUrl(null);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }

      setFile(selectedFile);
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("conversationId", task.id!);

        const res = await axios.post(
          `${conf.backendUrl}/upload/single`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        toast.success("File uploaded");
        const url = res.data.data.fileUrl;
        console.log("URL ::", url);

        setUploadedFileUrl(url);
        setMessage(res.data.data.key);
      } catch (error) {
        toast.error("File upload failed");
        console.error("error in uploading file", error);
        setFile(null);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleRemoveFile = async () => {
    if (uploadedFileUrl) {
      const key = uploadedFileUrl.split("amazonaws.com/")[1];
      try {
        await axios.post(
          `${conf.backendUrl}/delete/file/${key}`,
          { url: uploadedFileUrl },
          {
            withCredentials: true,
          }
        );
        toast.success("File removed");
      } catch (error) {
        toast.error("Failed to delete file");
        console.error("File delete error:", error);
      }
    }
    setFile(null);
    setMessage("");
    setUploadedFileUrl(null);
  };

  const handleGoToConversation = (targetMemberId: string) => {
    if (!member) return;
    const roomId = [member.id, targetMemberId].sort().join("");
    navigate(`/conversations/${roomId}`);
  };

  function deleteMessage(id: string) {
    const deletePromise = axios.delete(
      `${conf.backendUrl}/delete/message/${id}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    toast
      .promise(deletePromise, {
        loading: "Deleting message...",
        success: "Message deleted successfully!",
        error: (err) =>
          err?.response?.data?.message || "Failed to delete message",
      })
      .then(() => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== id)
        );
      });
  }

  function updateMessage(content: string, id: string) {
    const updatePromise = axios.put(
      `${conf.backendUrl}/update/message/${id}`,
      { content },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    toast.promise(updatePromise, {
      loading: "Updating message...",
      success: () => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === id ? { ...msg, content } : msg))
        );
        return "Message updated successfully";
      },
      error: (error) => {
        console.log(
          "Error updating message:",
          error.response?.data || error.message
        );
        return "Error updating message";
      },
    });
  }

  const handleRemoveMember = async (memberId: string) => {
    if (removingMemberId) return;
    setRemovingMemberId(memberId);
    try {
      const res = await callApiPost(
        `${conf.backendUrl}/delete/task/remove-member`,
        {
          taskId: task.id,
          memberId,
        }
      );
      if (res?.status === 200) {
        setTaskMembers((curr) => curr.filter((m) => m.id !== memberId));
        toast.success("Member removed successfully");
      } else {
        toast.error("Failed to remove member");
      }
    } catch (err) {
      toast.error("Error removing member");
      console.error("Error in removing member ::", err);
    } finally {
      setRemovingMemberId(null);
    }
  };

  if (!task)
    return (
      <p className="text-center mt-10 text-neutral-500 dark:text-neutral-400">
        No task data available
      </p>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 text-neutral-800 dark:text-neutral-200">
      <div className="flex flex-col gap-6">
        {/* Left Panel: Task Details */}
        <aside className="md:col-span-1 bg-white dark:bg-neutral-900 border-t-4 border-slate-500 p-5 rounded-lg shadow space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{task.name}</h1>

            <section className="mb-6">
              <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                📝 <span>Description</span>
              </h2>
              <div className="mt-2  rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div
                  className="prose md:min-h-28 prose-sm dark:prose-invert max-w-none"
                  data-color-mode={theme === "dark" ? "dark" : "light"}
                >
                  <MDEditor.Markdown  style={{ minHeight: "200px", padding: "1rem", borderRadius : "12px"}} source={task.content} />
                </div>
              </div>
            </section>

            <section className="space-y-2 text-sm">
              <p>
                <strong className="text-slate-600">Deadline:</strong>{" "}
                {format(new Date(task.deadline), "PPPp")}
              </p>
              <p>
                <strong className="text-slate-600">Created:</strong>{" "}
                {format(new Date(task.createdAt), "PPPp")}
              </p>
              <p>
                <strong className="text-slate-600">Updated:</strong>{" "}
                {format(new Date(task.updatedAt), "PPPp")}
              </p>
            </section>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start gap-2">
                    <Users size={16} />
                    <span>Members ({taskMembers.length})</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 max-h-96 p-2 space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-semibold">👥 Task Members</h2>
                    {member?.role !== "CONTRIBUTER" && (
                      <AddMemberToTask
                        taskMembers={taskMembers}
                        setTaskMembers={setTaskMembers}
                        taskId={task.id}
                        projectId={task.projectId}
                        className="bg-slate-600 text-white hover:bg-slate-700 text-xs px-2 py-1 rounded"
                      />
                    )}
                  </div>
                  {taskMembers.length > 0 ? (
                    <ScrollArea className="h-72 pr-2">
                      <div className="space-y-2">
                        {taskMembers.map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between bg-white dark:bg-neutral-800 border dark:border-neutral-700 rounded-lg p-2 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700"
                          >
                            <div
                              className="flex items-center gap-3 flex-1 cursor-pointer"
                              onClick={() => handleGoToConversation(m.id)}
                            >
                              <div className="relative">
                                <img
                                  src={
                                    m.user?.imgUrl ||
                                    "https://github.com/shadcn.png"
                                  }
                                  alt={m.user?.name || "User"}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-600"
                                />
                                <MessageCircle
                                  size={14}
                                  className="absolute bottom-0 right-0 bg-white dark:bg-neutral-900 rounded-full p-1 text-slate-500"
                                />
                              </div>
                              <div>
                                <p className="font-medium">
                                  {m.user?.name || "Unnamed"}
                                </p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                  Click to message
                                </p>
                              </div>
                            </div>
                            {m.id !== member?.id &&
                              (member?.role === "ADMIN" ||
                                member?.role === "MODERATOR") && (
                                <button
                                  onClick={() => handleRemoveMember(m.id)}
                                  disabled={removingMemberId === m.id}
                                  className={`ml-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors ${
                                    removingMemberId === m.id
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                  title="Remove member"
                                >
                                  {removingMemberId === m.id ? (
                                    <Loader2 className="animate-spin" />
                                  ) : (
                                    <X
                                      size={16}
                                      className="text-gray-600 hover:text-red-700"
                                    />
                                  )}
                                </button>
                              )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                      No members assigned to this task.
                    </p>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </section>
        </aside>

        {/* Right Panel: Conversations */}
        <section className="md:col-span-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow p-5 flex flex-col h-[600px]">
          <h2 className="text-lg font-semibold mb-2">💬 Conversations</h2>
          <div className="flex flex-col overflow-y-auto gap-4 flex-1 pr-1 mt-2">
            {(messages?.length ?? 0) > 0 ? (
              <>
                {messages?.map((msg, idx) => (
                  <ChatBubble
                    key={msg.id}
                    id={msg.id}
                    align={msg.memberId === member?.id ? "end" : "start"}
                    name={msg.name}
                    role={member?.role}
                    avatar={
                      msg?.member?.user?.imgUrl ||
                      "https://github.com/shadcn.png"
                    }
                    time={msg.createdAt}
                    content={msg.content}
                    fileUrl={msg?.fileUrl}
                    onDelete={deleteMessage}
                    onUpdate={updateMessage}
                    // status={idx % 2 === 0 ? "Delivered" : "Seen"}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No messages yet. Start the conversation!
                </p>
              </div>
            )}
          </div>
          <form
            onSubmit={handleSendMessage}
            className="pt-4 flex flex-col border-t mt-4 dark:border-neutral-700"
          >
            {file && (
              <div className="flex items-center justify-between mb-2 bg-neutral-100 dark:bg-neutral-700 p-2 rounded">
                <div className="flex items-center gap-2">
                  <Paperclip size={16} className="text-slate-500" />
                  <span className="text-sm truncate max-w-xs">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-slate-500 hover:text-slate-700"
                >
                  {" "}
                  {isUploading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <X size={16} />
                  )}
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition-colors"
                title="Attach file"
                disabled={isSending}
              >
                <Paperclip size={20} />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.mp3,.mp4"
                  disabled={isSending}
                />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded text-sm text-neutral-700 bg-neutral-100 dark:bg-neutral-700 dark:text-white"
                disabled={isSending}
              />
              <button
                type="submit"
                className="bg-slate-500 hover:bg-slate-600 text-white px-4 rounded flex items-center justify-center min-w-[80px]"
              >
                {isSending ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  "Send"
                )}
              </button>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Supports images, PDFs, and documents
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};

export default TaskDetails;
