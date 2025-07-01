import { useEffect, useRef, useState, FormEvent, ChangeEvent } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createSocketConnection } from "@/utils/socket";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import callApiPost from "@/utils/callApiPost";
import { MemberRole, Message } from "@/types/types";
import conf from "@/conf/conf";
import ChatBubble from "@/components/ui/ChatBubble";
import toast from "react-hot-toast";
import axios, { AxiosResponse } from "axios";
import { Paperclip, X, Loader2 } from "lucide-react";

type ApifetchConversationRes = {
  directMessages: Message[];
};

const Conversations = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const user = useSelector((state: RootState) => state.user.userData);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>(" ");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const msgEndRef = useRef<HTMLDivElement>(null);

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const member = user?.members?.find((m) => roomId?.includes(m.id));

  const getReceiverId = (): string => {
    if (!roomId || !member?.id) return "";
    return roomId.replace(member.id, "");
  };

  useEffect(() => {
    if (!roomId || !member) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    const receiverId = getReceiverId();
    socket.emit("joinChat", { senderId: member.id, receiverId });

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = (await callApiPost(
          `${conf.backendUrl}/fetch/conversations`,
          { conversationId: roomId }
        )) as AxiosResponse<ApifetchConversationRes> | null;
        setMessages(res?.data?.directMessages || []);
      } catch (err) {
        toast.error("Failed to load messages");
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    socket.on("receiveDirectMessage", (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
      setIsSending(false);
      msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    socket.on("error", (error) => {
      toast.error(error.message || "Socket error occurred");
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, member]);

  function deletMessage(id: string) {
    const deletePromise = axios.delete(`${conf.backendUrl}/delete/chat/${id}`, {
      withCredentials: true,
    });

    toast.promise(deletePromise, {
      loading: "Deleting message...",
      success: () => {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== id)
        );
        return "Message deleted";
      },
      error: (err) => {
        console.error("Error deleting message:", err);
        return "Unable to delete message";
      },
    });
  }


  function updateMessage(content: string, id: string) {
    const updatePromise = axios.put(
      `${conf.backendUrl}/update/chat/${id}`,
      { content },
      { withCredentials: true }
    );

    toast.promise(updatePromise, {
      loading: "Updating message...",
      success: () => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg.id === id ? { ...msg, content } : msg))
        );
        return "Message updated";
      },
      error: (err) => {
        console.error("Error updating message:", err);
        return "Error updating message";
      },
    });
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }

      setFile(selectedFile);
      setUploadingFile(true);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("conversationId", roomId!);

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
        setUploadedFileUrl(url);
        setMessage(res.data.data.key);
      } catch (error) {
        toast.error("File upload failed");
        console.error("error in uploading file", error);
        setFile(null);
      } finally {
        setUploadingFile(false);
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
    setUploadedFileUrl(null);
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !uploadedFileUrl) return;
    if (!member || !roomId) return;

    const receiverId = getReceiverId();
    setIsSending(true);

    try {
      socketRef.current?.emit("sendChatMessage", {
        conversationId: roomId,
        memberId: member.id,
        receiverId,
        name: user.name,
        message,
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

  return (
    <div className="mx-auto px-4 py-6 text-neutral-800 dark:text-neutral-200 dark:bg-neutral-900">
      <div className="bg-white max-w-5xl mx-auto dark:bg-neutral-800 rounded-lg shadow p-5 flex flex-col h-[600px]">
        <h2 className="text-lg font-semibold mb-4">💬 Direct Conversation</h2>
        <div className="flex-1 overflow-y-auto flex flex-col-reverse gap-4 pr-2">
          {loading ? (
            <p className="text-sm text-neutral-500 text-center">
              Loading messages...
            </p>
          ) : messages.length > 0 ? (
            <div>
              
              {messages.map((msg, idx) => (
                <ChatBubble
                  key={msg.id}
                  id={msg.id}
                  role={member?.role as MemberRole}
                  chatMemberId={member?.id}
                  align={msg.memberId === member?.id ? "end" : "start"}
                  name={msg.member.user.name}
                  avatar={
                    msg.member.user.imgUrl || "https://github.com/shadcn.png"
                  }
                  time={new Date(msg.createdAt)}
                  onDelete={deletMessage}
                  fileUrl={msg?.fileUrl}
                  onUpdate={updateMessage}
                  content={msg.content}
                  status={
                    idx === 0 && msg.memberId === member?.id
                      ? "Sent"
                      : undefined
                  }
                />
              ))}
              
              <div ref={msgEndRef} />
            </div>
          ) : (
            <p className="text-sm text-neutral-500 text-center mt-2">
              No messages yet. Start the conversation!
            </p>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="pt-4 flex flex-col border-t mt-4 dark:border-neutral-700"
        >
          {file && (
            <div className="flex items-center justify-between mb-2 bg-neutral-100 dark:bg-neutral-700 p-2 rounded">
              <div className="flex items-center gap-2">
                <Paperclip size={16} className="text-teal-500" />
                <span className="text-sm truncate max-w-xs">{file.name}</span>
                {uploadingFile && (
                  <Loader2 size={16} className="animate-spin ml-2" />
                )}
              </div>
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-teal-500 hover:text-teal-700"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"
              title="Attach file"
              disabled={isSending}
            >
              <Paperclip size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              disabled={isSending}
            />
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
              className="bg-teal-500 hover:bg-teal-600 text-white px-4 rounded flex items-center justify-center min-w-[80px]"
              disabled={isSending || (!message.trim() && !file)}
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
      </div>
    </div>
  );
};

export default Conversations;
