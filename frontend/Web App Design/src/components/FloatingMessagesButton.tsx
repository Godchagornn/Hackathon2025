import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface FloatingMessagesButtonProps {
  unreadCount: number;
  onClick: () => void;
}

export function FloatingMessagesButton({ unreadCount, onClick }: FloatingMessagesButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 sm:right-8 md:right-10">
      <Button
        onClick={onClick}
        size="lg"
        className="relative h-14 w-14 rounded-full shadow-2xl hover:shadow-xl transition-all"
      >
        <MessageCircle className="h-6 w-6" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-red-500 h-6 w-6 flex items-center justify-center p-0 text-xs rounded-full border-2 border-background">
            {unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
}
