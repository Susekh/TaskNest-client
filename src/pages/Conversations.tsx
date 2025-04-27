import { useEffect, useRef, useState, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { createSocketConnection } from "@/utils/socket";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";
import callApiPost from "@/utils/callApiPost";
import { Message } from "@/types/types";
import conf from "@/conf/conf";
import ChatBubble from "@/components/ui/ChatBubble";
import toast from "react-hot-toast";
import { AxiosResponse } from "axios";


type ApifetchConversationRes = {
  directMessages: Message[];
}

const Conversations = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const user = useSelector((state: RootState) => state.user.userData);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

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
        const res = await callApiPost(`${conf.backendUrl}/fetch/conversations`, {
          conversationId: roomId,
        }) as AxiosResponse<ApifetchConversationRes> | null;
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
    });

    socket.on("error", (error) => {
      toast.error(error.message || "Socket error occurred");
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, member],);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !member || !roomId) return;

    const receiverId = getReceiverId();

    socketRef.current?.emit("sendChatMessage", {
      conversationId: roomId,
      memberId: member.id,
      receiverId,
      name: user.name,
      message,
    });

    setMessage("");
  };

  return (
    <div className=" mx-auto px-4 py-6 text-neutral-800 dark:text-neutral-200 dark:bg-neutral-900">
      <div className="bg-white max-w-5xl mx-auto dark:bg-neutral-800 rounded-lg shadow p-5 flex flex-col h-[600px]">
      <h2 className="text-lg font-semibold  mb-4">💬 Direct Conversation</h2>
        <div className="flex-1 overflow-y-auto flex flex-col-reverse gap-4 pr-2">
          {loading ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">Loading messages...</p>
          ) : messages.length > 0 ? (
            [...messages].reverse().map((msg, idx) => (
              <ChatBubble
                key={msg.id}
                role={member?.role}
                align={msg.memberId === member?.id ? "end" : "start"}
                name={msg.member.user.name}
                avatar={msg.member.user.imgUrl || "https://github.com/shadcn.png"}
                time={new Date(msg.createdAt)}
                content={msg.content}
                status={idx === 0 && msg.memberId === member?.id ? "Sent" : undefined}
              />
            ))
          ) : (
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-2">
              No messages yet. Start the conversation!
            </p>
          )}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="pt-4 flex border-t mt-4 dark:border-neutral-700"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 border rounded-l text-sm text-neutral-700 dark:text-white bg-neutral-100 dark:bg-neutral-700"
            disabled={!member || loading}
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-r transition-colors"
            disabled={!message.trim() || !member || loading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Conversations;
