import { format } from "date-fns";
import ChatBubble from "./ui/ChatBubble";
import { FormEvent, useEffect, useRef, useState } from "react";
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
import { X, MessageCircle } from "lucide-react";
import { Member, Message, Task } from "@/types/types";
import { AxiosResponse } from "axios";

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
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = (await callApiPost(`${conf.backendUrl}/fetch/messages`, {
          taskId: task.id,
        })) as AxiosResponse<ApiFetchMessagesRes> | null;
        setMessages(res?.data.chatMessages ?? []);
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
      setMessages((prev) => [message, ...prev]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [task.id]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    socketRef.current?.emit("sendGroupMessage", {
      groupId: task.id,
      message,
      senderId: member?.id,
      name: user.name,
    });

    setMessage("");
  };

  const handleGoToConversation = (targetMemberId: string) => {
    if (!member) return;
    const roomId = [member.id, targetMemberId].sort().join("");
    navigate(`/conversations/${roomId}`);
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel: Task Details */}
        <aside className="md:col-span-1 bg-white dark:bg-neutral-900 border-t-4 border-red-500 p-5 rounded-lg shadow space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{task.name}</h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Task ID: <span className="text-red-600">{task.id}</span>
            </p>
            <section>
              <h2 className="text-sm font-semibold mb-1">📝 Description</h2>
              <p className="text-sm bg-neutral-50 dark:bg-neutral-800 dark:border-neutral-700 border p-3 rounded">
                {task.content}
              </p>
            </section>
            <section className="space-y-2 text-sm">
              <p>
                <strong className="text-red-600">Project ID:</strong>{" "}
                {task.projectId}
              </p>
              <p>
                <strong className="text-red-600">Column ID:</strong>{" "}
                {task.columnId}
              </p>
              <p>
                <strong className="text-red-600">Deadline:</strong>{" "}
                {format(new Date(task.deadline), "PPPp")}
              </p>
              <p>
                <strong className="text-red-600">Created:</strong>{" "}
                {format(new Date(task.createdAt), "PPPp")}
              </p>
              <p>
                <strong className="text-red-600">Updated:</strong>{" "}
                {format(new Date(task.updatedAt), "PPPp")}
              </p>
            </section>
          </div>

          <section className="space-y-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold">👥 Members</h2>
              {member?.role === "CONTRIBUTER" ? (
                <></>
              ) : (
                <AddMemberToTask
                  setTaskMembers={setTaskMembers}
                  taskId={task.id}
                  projectId={task.projectId}
                  className="bg-red-600 text-white hover:bg-red-700 text-xs px-2 py-1 rounded"
                />
              )}
            </div>
            {taskMembers.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
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
                            m.user?.imgUrl || "https://github.com/shadcn.png"
                          }
                          alt={m.user?.name || "User"}
                          className="w-10 h-10 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-600"
                        />
                        <MessageCircle
                          size={14}
                          className="absolute bottom-0 right-0 bg-white dark:bg-neutral-900 rounded-full p-1 text-red-500"
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
                          className={`ml-2 p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition-colors ${
                            removingMemberId === m.id
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          title="Remove member"
                        >
                          <X size={16} className="text-red-600" />
                        </button>
                      )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-800 p-4 rounded text-center">
                No members assigned to this task.
              </p>
            )}
          </section>
        </aside>

        {/* Right Panel: Conversations */}
        <section className="md:col-span-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg shadow p-5 flex flex-col h-[600px]">
          <h2 className="text-lg font-semibold mb-2">💬 Conversations</h2>
          <div className="flex flex-col-reverse overflow-y-auto gap-4 flex-1 pr-1 mt-2">
            {(messages?.length ?? 0) > 0 ? (
              messages?.map((msg, idx) => (
                <ChatBubble
                  key={idx}
                  align={msg.memberId === member?.id ? "end" : "start"}
                  name={msg.name}
                  role={member?.role}
                  avatar={
                    msg?.member?.user?.imgUrl || "https://github.com/shadcn.png"
                  }
                  time={msg.createdAt}
                  content={msg.content}
                  status={idx % 2 === 0 ? "Delivered" : "Seen"}
                />
              ))
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                No messages yet.
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
              className="w-full p-2 border rounded text-sm text-neutral-700 bg-neutral-100 dark:bg-neutral-700 dark:text-white"
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-4 rounded-r"
            >
              send
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default TaskDetails;
