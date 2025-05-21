import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const ChatBubble = ({
  align = "start",
  name,
  time,
  content,
  status,
  avatar,
}: {
  align?: "start" | "end"
  name: string
  time: Date
  content: string
  role?: string | undefined
  status?: string
  avatar?: string
}) => {
  const isStart = align === "start"

  return (
    <div className={cn("flex gap-3 mb-4", isStart ? "flex-row" : "flex-row-reverse")}>
      {/* Avatar */}
      <Avatar className="w-10 h-10">
        <AvatarImage src={avatar || ""} alt={name} />
        <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className={cn("flex flex-col max-w-[80%]", isStart ? "items-start" : "items-end")}>
        {/* Header */}
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-neutral-800 dark:text-neutral-200">{name}</span>
          <span className="ml-2 text-xs text-neutral-400">{format(new Date(time), "MMM d, h:mm a")}</span>
        </div>

        {/* Chat bubble */}
        <div
          className={cn(
            "mt-1 px-4 py-2 rounded-lg text-sm",
            isStart
              ? "bg-muted text-left rounded-bl-none"
              : "bg-red-500 text-white text-right rounded-br-none"
          )}
        >
          {content}
        </div>

        {/* Footer */}
        {status && (
          <div className="text-xs text-gray-400 mt-1">
            {status}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatBubble