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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RefreshCw, X, Image as ImageIcon, Send } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ExchangeRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetItem: {
    title: string;
    owner: string;
    image: string;
  } | null;
  onRequestSent?: (data: {
    offerTitle: string;
    offerImage: string;
    offerCategory: string;
    offerCondition: string;
    message: string;
  }) => void;
}

export function ExchangeRequestModal({ open, onOpenChange, targetItem, onRequestSent }: ExchangeRequestModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerCategory, setOfferCategory] = useState("");
  const [offerCondition, setOfferCondition] = useState("");
  const [message, setMessage] = useState("");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send request data to parent
    if (onRequestSent && imagePreview) {
      onRequestSent({
        offerTitle,
        offerImage: imagePreview,
        offerCategory,
        offerCondition,
        message,
      });
    }
    
    toast.success("🔄 Exchange request sent!", {
      description: `คำขอแลกเปลี่ยนของคุณถูกส่งไปยัง ${targetItem?.owner} แล้ว รอการตอบกลับใน Notifications`,
    });
    
    // Reset form
    setImagePreview(null);
    setOfferTitle("");
    setOfferCategory("");
    setOfferCondition("");
    setMessage("");
    onOpenChange(false);
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
          {/* Your Item Image */}
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
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Item Name */}
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

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="offerCategory">Category *</Label>
              <Select value={offerCategory} onValueChange={setOfferCategory} required>
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
            {/* Condition */}
            <div className="space-y-2">
              <Label htmlFor="offerCondition">Condition *</Label>
              <Select value={offerCondition} onValueChange={setOfferCondition} required>
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

            {/* Pickup Location */}
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

          {/* Description of Your Item */}
          <div className="space-y-2">
            <Label htmlFor="offerDescription">Describe Your Item *</Label>
            <Textarea
              id="offerDescription"
              placeholder="Tell them about your item and why it's a good exchange..."
              className="rounded-xl min-h-24"
              required
            />
          </div>

          {/* Message to Owner */}
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
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-xl gap-2">
              <Send className="h-4 w-4" />
              Send Exchange Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}