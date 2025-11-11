import { useState } from "react";
import { Bell, Check, X, MessageCircle, RefreshCw, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";
import { ExchangeDetailsDialog } from "./ExchangeDetailsDialog";

export interface ExchangeNotification {
  id: string;
  type: "exchange_request";
  direction: "incoming" | "outgoing"; // incoming = คนอื่นขอแลกของเรา, outgoing = เราขอแลกของคนอื่น
  fromUser: {
    name: string;
    avatar: string;
    faculty: string;
  };
  offerItem: {
    title: string;
    image: string;
    category: string;
    condition: string;
  };
  targetItem: {
    title: string;
    image: string;
  };
  message: string;
  timestamp: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  bothPartiesAccepted?: boolean; // true = ทั้งสองฝ่ายยอมรับแล้ว, false/undefined = ฝ่ายเดียวยอมรับ
  exchangeCode?: string; // รหัสยืนยันที่สร้างเมื่อ accept
}

interface NotificationDropdownProps {
  notifications: ExchangeNotification[];
  onAccept: (notificationId: string) => void;
  onReject: (notificationId: string) => void;
  onStartChat: (notificationId: string) => void;
  onConfirmComplete: (notificationId: string, code: string) => void;
}

export function NotificationDropdown({
  notifications,
  onAccept,
  onReject,
  onStartChat,
  onConfirmComplete,
}: NotificationDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<ExchangeNotification | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const pendingCount = notifications.filter(n => n.status === "pending").length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full relative"
        >
          <Bell className="h-5 w-5" />
          {pendingCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full border-2 border-background">
              {pendingCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px] p-0 rounded-2xl max-h-[85vh] overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>การแจ้งเตือน</DialogTitle>
            {pendingCount > 0 && (
              <Badge className="bg-primary/10 text-primary rounded-full">
                {pendingCount} ใหม่
              </Badge>
            )}
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[500px]">{notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground">ยังไม่มีการแจ้งเตือน</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                // Status badge configuration
                const statusConfig = {
                  pending: {
                    label: "รอการตอบรับ",
                    bgColor: "bg-amber-100",
                    textColor: "text-amber-700",
                    borderColor: "border-amber-300"
                  },
                  accepted: {
                    label: "ยอมรับแล้ว",
                    bgColor: "bg-green-100",
                    textColor: "text-green-700",
                    borderColor: "border-green-300"
                  },
                  rejected: {
                    label: "ปฏิเสธแล้ว",
                    bgColor: "bg-red-100",
                    textColor: "text-red-700",
                    borderColor: "border-red-300"
                  },
                  completed: {
                    label: "เสร็จสิ้นแล้ว",
                    bgColor: "bg-gray-100",
                    textColor: "text-gray-700",
                    borderColor: "border-gray-300"
                  }
                };

                const currentStatus = statusConfig[notification.status];

                return (
                <div key={notification.id} className="p-4 hover:bg-muted/30 transition-colors">
                  {/* Header with Status Badge */}
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={notification.fromUser.avatar} />
                      <AvatarFallback>{notification.fromUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-medium text-sm">{notification.fromUser.name}</p>
                        <Badge variant="outline" className="text-xs rounded-full">
                          {notification.fromUser.faculty}
                        </Badge>
                        <Badge className={`text-xs rounded-full border ${currentStatus.bgColor} ${currentStatus.textColor} ${currentStatus.borderColor}`}>
                          {currentStatus.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                    </div>
                  </div>

                  {/* Exchange Info */}
                  <div className="bg-primary/5 rounded-xl p-3 mb-3 border border-primary/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-primary" />
                        <p className="text-xs font-medium text-primary">คำขอแลกเปลี่ยน</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        ID: {notification.id.slice(-6)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-2">
                      {/* Offer Item */}
                      <div className="flex-1 bg-white rounded-lg p-2 border">
                        <img
                          src={notification.offerItem.image}
                          alt={notification.offerItem.title}
                          className="w-full h-16 object-cover rounded mb-1"
                        />
                        <p className="text-xs font-medium truncate">{notification.offerItem.title}</p>
                        <div className="flex gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs px-1.5 py-0">{notification.offerItem.category}</Badge>
                          <Badge variant="outline" className="text-xs px-1.5 py-0">{notification.offerItem.condition}</Badge>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <RefreshCw className="h-5 w-5 text-primary" />
                      </div>

                      {/* Target Item */}
                      <div className="flex-1 bg-white rounded-lg p-2 border">
                        <img
                          src={notification.targetItem.image}
                          alt={notification.targetItem.title}
                          className="w-full h-16 object-cover rounded mb-1"
                        />
                        <p className="text-xs font-medium truncate">{notification.targetItem.title}</p>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0 mt-1">Your Item</Badge>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="bg-white rounded-lg p-2 border">
                      <p className="text-xs text-muted-foreground italic">"{notification.message}"</p>
                    </div>
                  </div>

                  {/* Actions - แสดงเฉพาะเมื่อเป็น incoming request */}
                  {notification.direction === "incoming" && notification.status === "pending" && (
                    <div className="space-y-2">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-2">
                        <p className="text-xs text-amber-700 flex items-center gap-1">
                          <RefreshCw className="h-3 w-3" />
                          <strong>{notification.fromUser.name}</strong> ต้องการแลกของกับคุณ
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            onAccept(notification.id);
                            toast.success("✅ ยอมรับคำขอแลกเปลี่ยนแล้ว!", {
                              description: "คุณสามารถเริ่มแชทเพื่อนัดหมายได้แล้ว"
                            });
                          }}
                          className="flex-1 rounded-xl gap-2 bg-[#21834A] hover:bg-[#21834A]/90"
                        >
                          <Check className="h-4 w-4" />
                          ยอมรับ
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            onReject(notification.id);
                            toast.info("❌ ปฏิเสธคำขอแลกเปลี่ยนแล้ว");
                          }}
                          className="flex-1 rounded-xl gap-2"
                        >
                          <X className="h-4 w-4" />
                          ปฏิเสธ
                        </Button>
                      </div>
                    </div>
                  )}

                  {notification.direction === "incoming" && notification.status === "accepted" && (
                    <div className="space-y-2">
                      {!notification.bothPartiesAccepted ? (
                        // ยอมรับแล้วแต่รอผู้รับยืนยัน
                        <div className="flex items-center gap-2 text-sm text-amber-600 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>คุณยอมรับแล้ว - รอผู้รับยืนยัน</span>
                        </div>
                      ) : (
                        // ทั้งสองฝ่ายยอมรับแล้ว
                        <>
                          <div className="flex items-center gap-2 text-sm text-green-600 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <Check className="h-4 w-4" />
                            <span>ทั้งสองฝ่ายยอมรับแล้ว - พร้อมแชท!</span>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => {
                              onStartChat(notification.id);
                              setOpen(false);
                            }}
                            className="w-full rounded-xl gap-2"
                          >
                            <MessageCircle className="h-4 w-4" />
                            เริ่มแชท
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {notification.direction === "incoming" && notification.status === "rejected" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <X className="h-4 w-4" />
                      <span>คุณได้ปฏิเสธคำขอแล้ว</span>
                    </div>
                  )}

                  {/* Outgoing request - แสดงเฉพาะ status และปุ่มแชท (ถ้ายอมรับ) */}
                  {notification.direction === "outgoing" && notification.status === "pending" && (
                    <div className="flex items-center gap-2 text-sm text-amber-600">
                      <RefreshCw className="h-4 w-4" />
                      <span>รอเจ้าของของตอบรับ...</span>
                    </div>
                  )}

                  {notification.direction === "outgoing" && notification.status === "accepted" && (
                    <div className="space-y-2">
                      {!notification.bothPartiesAccepted ? (
                        // อีกฝ่ายยอมรับแล้วแต่รอเรายืนยัน
                        <div className="flex items-center gap-2 text-sm text-amber-600 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>อีกฝ่ายยอมรับแล้ว - รอคุณยืนยัน</span>
                        </div>
                      ) : (
                        // ทั้งสองฝ่ายยอมรับแล้ว
                        <>
                          <div className="flex items-center gap-2 text-sm text-green-600 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <Check className="h-4 w-4" />
                            <span>ทั้งสองฝ่ายยอมรับแล้ว - พร้อมแชท!</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                onStartChat(notification.id);
                                setOpen(false);
                              }}
                              className="flex-1 rounded-xl gap-2"
                            >
                              <MessageCircle className="h-4 w-4" />
                              เริ่มแชท
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedNotification(notification);
                                setDetailsOpen(true);
                              }}
                              className="flex-1 rounded-xl gap-2"
                            >
                              <Check className="h-4 w-4" />
                              ยืนยันได้รับของ
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {notification.direction === "outgoing" && notification.status === "rejected" && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <X className="h-4 w-4" />
                      <span>เจ้าของของได้ปฏิเสธคำขอแล้ว</span>
                    </div>
                  )}
                </div>
              );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
      
      {/* Exchange Details Dialog */}
      <ExchangeDetailsDialog
        notification={selectedNotification}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onConfirmComplete={onConfirmComplete}
      />
    </Dialog>
  );
}