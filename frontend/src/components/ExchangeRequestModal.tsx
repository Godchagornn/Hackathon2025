import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RefreshCw, X, Image as ImageIcon, Send } from "lucide-react";
import { toast } from "sonner";

interface ExchangeRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetItem: {
    title: string;
    owner: string;
    image: string;
    ownerId?: number;
    itemId?: number;
  } | null;
  requesterId: number;
  apiBaseUrl: string;
}

export function ExchangeRequestModal({
  open,
  onOpenChange,
  targetItem,
  requesterId,
  apiBaseUrl,
}: ExchangeRequestModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerCategory, setOfferCategory] = useState("");
  const [offerCondition, setOfferCondition] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setImagePreview(null);
    setOfferTitle("");
    setOfferCategory("");
    setOfferCondition("");
    setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetItem?.ownerId || !targetItem?.itemId) {
      toast.error("ไม่พบข้อมูลเจ้าของหรือไอเท็มที่จะแลก");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${apiBaseUrl}/profiles/${targetItem.ownerId}/notifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requesterId,
            itemId: targetItem.itemId,
            message,
            offer: {
              title: offerTitle,
              category: offerCategory,
              condition: offerCondition,
            },
          }),
        }
      );

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body?.message ?? "ไม่สามารถส่งคำขอได้");
      }

      toast.success("🔄 Exchange request sent!", {
        description: `แจ้งเตือนถูกส่งไปยัง ${targetItem.owner} แล้ว`,
      });
      resetForm();
      onOpenChange(false);
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Unexpected error";
      toast.error("ส่งคำขอไม่สำเร็จ", { description });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-primary" />
            ขอแลกเปลี่ยน
          </DialogTitle>
          <DialogDescription>
            ส่งคำขอแลกเปลี่ยน "{targetItem?.title}" กับ {targetItem?.owner}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image of Your Item *</Label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-primary/20">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full h-8 w-8"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer bg-muted/30"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="offerTitle">Your Item Name *</Label>
              <Input
                id="offerTitle"
                placeholder="e.g., Study Desk"
                className="rounded-xl"
                value={offerTitle}
                onChange={(e) => setOfferTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerCategory">Category *</Label>
              <Select
                value={offerCategory}
                onValueChange={setOfferCategory}
                required
              >
                <SelectTrigger id="offerCategory" className="rounded-xl">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="books">📚 Books & Textbooks</SelectItem>
                  <SelectItem value="clothes">👕 Clothes</SelectItem>
                  <SelectItem value="electronics">💻 Electronics</SelectItem>
                  <SelectItem value="dorm">🛏️ Dorm Items</SelectItem>
                  <SelectItem value="sports">⚽ Sports Equipment</SelectItem>
                  <SelectItem value="kitchen">🍳 Kitchen Items</SelectItem>
                  <SelectItem value="other">📦 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="offerCondition">Condition *</Label>
              <Select
                value={offerCondition}
                onValueChange={setOfferCondition}
                required
              >
                <SelectTrigger id="offerCondition" className="rounded-xl">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">⭐ Like New</SelectItem>
                  <SelectItem value="good">✅ Good</SelectItem>
                  <SelectItem value="fair">👍 Fair</SelectItem>
                  <SelectItem value="used">📦 Well Used</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="offerLocation">Your Pickup Location *</Label>
              <Input
                id="offerLocation"
                placeholder="e.g., Engineering Building"
                className="rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="offerDescription">Describe Your Item *</Label>
            <Textarea
              id="offerDescription"
              placeholder="Tell them about your item and why it's a good exchange..."
              className="rounded-xl min-h-24"
              required
            />
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <Label htmlFor="message" className="flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Message to {targetItem?.owner}
            </Label>
            <Textarea
              id="message"
              placeholder={`Hi ${targetItem?.owner}, I'd like to exchange my item for your ${targetItem?.title}...`}
              className="rounded-xl min-h-24"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Introduce yourself and explain why this would be a good exchange
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl gap-2"
              disabled={isSubmitting}
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Sending..." : "Send Exchange Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
