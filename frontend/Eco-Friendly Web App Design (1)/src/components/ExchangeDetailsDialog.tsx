import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { ExchangeNotification } from "./NotificationDropdown";

interface ExchangeDetailsDialogProps {
  notification: ExchangeNotification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmComplete: (notificationId: string, code: string) => void;
}

export function ExchangeDetailsDialog({
  notification,
  open,
  onOpenChange,
  onConfirmComplete,
}: ExchangeDetailsDialogProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  if (!notification) return null;

  const handleConfirmReceived = () => {
    setIsVerifying(true);
    onConfirmComplete(notification.id, "");
    toast.success("✅ ยืนยันการแลกเปลี่ยนสำเร็จ!");
    onOpenChange(false);
    setIsVerifying(false);
  };

  const isOwner = notification.direction === "incoming"; // เจ้าของของ (คนที่ถูกขอแลก)
  const isRequester = notification.direction === "outgoing"; // ผู้ขอแลก (คนที่ส่งคำขอแลก)
  const canComplete = notification.status === "accepted" && notification.status !== "completed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[450px] rounded-2xl">
        <DialogHeader>
          <DialogTitle>รายละเอียดการแลกเปลี่ยน</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Exchange Items Info */}
          <div className="space-y-2">
            <Label className="text-sm">รายการแลกเปลี่ยน</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">จาก: {notification.fromUser.name}</p>
                <img
                  src={notification.offerItem.image}
                  alt={notification.offerItem.title}
                  className="w-full h-20 object-cover rounded mb-2"
                />
                <p className="font-medium text-sm truncate">{notification.offerItem.title}</p>
                <Badge variant="outline" className="text-xs mt-1">{notification.offerItem.condition}</Badge>
              </div>
              
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">ของคุณ</p>
                <img
                  src={notification.targetItem.image}
                  alt={notification.targetItem.title}
                  className="w-full h-20 object-cover rounded mb-2"
                />
                <p className="font-medium text-sm truncate">{notification.targetItem.title}</p>
              </div>
            </div>
          </div>

          {/* Confirmation Section (Only for requester/ผู้ขอแลก) */}
          {isRequester && canComplete && (
            <div className="space-y-3 pt-3 border-t">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-800">
                    <p>
                      <strong>คำแนะนำ:</strong> เมื่อพบกันและได้รับของจากเจ้าของแล้ว กดปุ่มด้านล่างเพื่อยืนยันว่าได้รับของเรียบร้อยแล้ว
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleConfirmReceived}
                disabled={isVerifying}
                className="w-full rounded-xl gap-2"
              >
                <Check className="h-4 w-4" />
                {isVerifying ? "กำลังยืนยัน..." : "ยืนยันว่าได้รับของแล้ว"}
              </Button>
            </div>
          )}

          {/* Owner Message (Only for owner/เจ้าของของ) */}
          {isOwner && canComplete && (
            <div className="space-y-2 pt-3 border-t">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <p className="font-medium text-green-800">รอผู้รับยืนยันการแลกเปลี่ยน</p>
                </div>
                <p className="text-xs text-green-700">
                  เมื่อส่งมอบของแล้ว ให้รอผู้รับกดยืนยันว่าได้รับของแล้ว
                </p>
              </div>
            </div>
          )}

          {/* Completed Status */}
          {notification.status === "completed" && (
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <Check className="h-5 w-5" />
                <p className="font-medium">การแลกเปลี่ยนเสร็จสมบูรณ์แล้ว!</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
