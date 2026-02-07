import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  user_email: string;
  message: string;
  timestamp: string;
  user_id?: number;
}

interface ChatPanelProps {
  asteroidId: string;
  asteroidName: string;
}

export function ChatPanel({ asteroidId, asteroidName }: ChatPanelProps) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [onlineCount, setOnlineCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:8000", {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    const handleConnect = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      
      // Join asteroid room
      newSocket.emit("join_asteroid_room", {
        asteroid_id: asteroidId,
        user_email: user?.email || "Anonymous",
      });
    };

    const handleDisconnect = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    const handleNewMessage = (data: ChatMessage) => {
      setMessages((prev) => [...prev, { ...data, timestamp: new Date().toISOString() }]);
    };

    const handleUserJoined = (data: any) => {
      console.log(`${data.user_email} joined the chat`);
    };

    const handleUserLeft = (data: any) => {
      console.log(`${data.user_email} left the chat`);
    };

    const handleOnlineUsers = (data: any) => {
      setOnlineCount(data.count);
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("new_message", handleNewMessage);
    newSocket.on("user_joined", handleUserJoined);
    newSocket.on("user_left", handleUserLeft);
    newSocket.on("online_users", handleOnlineUsers);

    setSocket(newSocket);

    // Get online users periodically
    const interval = setInterval(() => {
      if (newSocket.connected) {
        newSocket.emit("get_online_users", { asteroid_id: asteroidId });
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      
      // Remove all event listeners before disconnecting
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("new_message", handleNewMessage);
      newSocket.off("user_joined", handleUserJoined);
      newSocket.off("user_left", handleUserLeft);
      newSocket.off("online_users", handleOnlineUsers);
      
      if (newSocket.connected) {
        newSocket.emit("leave_asteroid_room", { asteroid_id: asteroidId });
        newSocket.disconnect();
      }
    };
  }, [asteroidId, user?.email]); // Use user?.email instead of user object to prevent unnecessary reconnections

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!socket || !messageInput.trim()) return;

    socket.emit("send_message", {
      asteroid_id: asteroidId,
      message: messageInput.trim(),
      user_id: user?.id,
    });

    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="glass-panel rounded-xl p-6 h-[500px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
        <div>
          <h3 className="text-lg font-bold text-foreground">Live Discussion</h3>
          <p className="text-sm text-muted-foreground">{asteroidName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "default" : "secondary"} className="gap-1">
            <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-gray-500"}`} />
            {isConnected ? "Connected" : "Disconnected"}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Users className="h-3 w-3" />
            {onlineCount}
          </Badge>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">
              No messages yet. Start the conversation!
            </p>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-primary">
                  {msg.user_email}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="bg-secondary/50 rounded-lg p-2 text-sm text-foreground">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={!isConnected}
          className="flex-1"
        />
        <Button
          onClick={sendMessage}
          disabled={!isConnected || !messageInput.trim()}
          size="icon"
          variant="cosmic"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
