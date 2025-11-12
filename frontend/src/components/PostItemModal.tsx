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
import { Leaf, X, Image as ImageIcon, RefreshCw, Package, Calendar, Upload } from "lucide-react";
import { toast } from "sonner";

interface PostItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiBaseUrl: string;
  authToken: string;
  onItemPosted?: () => void;
}

export function PostItemModal({
  open,
  onOpenChange,
  apiBaseUrl,
  authToken,
  onItemPosted,
}: PostItemModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("ไฟล์ภาพต้องไม่เกิน 5MB");
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
    setTitle("");
    setCategory("");
    setCondition("");
    setLookingFor("");
    setExpiryDate("");
    setPickupLocation("");
    setDescription("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      toast.error("กรุณาเข้าสู่ระบบก่อนโพสต์ของ");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${apiBaseUrl}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title,
          category,
          condition,
          description,
          tags: lookingFor ? lookingFor.split(",").map((tag) => tag.trim()) : [],
          images: imagePreview ? [imagePreview] : [],
          status: "available",
        }),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body?.message ?? "โพสต์สินค้าล้มเหลว");
      }

      toast.success("🌱 โพสต์สำเร็จ", {
        description: "รายการของคุณถูกเพิ่มบน ShareCycle แล้ว",
      });
      resetForm();
      onOpenChange(false);
      onItemPosted?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast.error("โพสต์สินค้าไม่สำเร็จ", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            โพสต์ของเพื่อแลกเปลี่ยน
          </DialogTitle>
          <DialogDescription>แชร์ของที่คุณอยากแลกกับชาว CMU</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="image">อัปโหลดรูป *</Label>
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border-2 border-primary/20">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
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
                  กดเพื่ออัปโหลดหรือวางไฟล์ที่นี่
                </p>
                <p className="text-xs text-muted-foreground">PNG/JPG สูงสุด 5MB</p>
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

          <div className="space-y-2">
            <Label htmlFor="title">ชื่อสินค้า *</Label>
            <Input
              id="title"
              placeholder="เช่น โต๊ะอ่านหนังสือ"
              className="rounded-xl"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">หมวดหมู่ *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger id="category" className="rounded-xl">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Books & Textbooks">📚 Books & Textbooks</SelectItem>
                  <SelectItem value="Clothes">👕 Clothes</SelectItem>
                  <SelectItem value="Electronics">💻 Electronics</SelectItem>
                  <SelectItem value="Dorm Items">🛏️ Dorm Items</SelectItem>
                  <SelectItem value="Sports Equipment">⚽ Sports Equipment</SelectItem>
                  <SelectItem value="Kitchen">🍳 Kitchen Items</SelectItem>
                  <SelectItem value="Other">📦 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">สภาพสินค้า *</Label>
              <Select value={condition} onValueChange={setCondition} required>
                <SelectTrigger id="condition" className="rounded-xl">
                  <SelectValue placeholder="เลือกสภาพ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">⭐ Like New</SelectItem>
                  <SelectItem value="good">✅ Good</SelectItem>
                  <SelectItem value="fair">👍 Fair</SelectItem>
                  <SelectItem value="used">📦 Well Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

  <div className="space-y-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <Label htmlFor="lookingFor" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              ต้องการแลกกับ...
            </Label>
            <Input
              id="lookingFor"
              placeholder="เช่น Laptop stand, Kitchen utensils"
              className="rounded-xl"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              คั่นหลายรายการด้วยจุลภาค เช่น "Laptop stand, Lamp"
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-xl bg-accent/5 border border-accent/20">
            <Label htmlFor="expiryDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              วันหมดอายุของโพสต์ (ไม่บังคับ)
            </Label>
            <Input
              id="expiryDate"
              type="date"
              className="rounded-xl"
              min={new Date().toISOString().split("T")[0]}
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pickupLocation" className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              จุดนัดรับของ (แนะนำให้ระบุ)
            </Label>
            <Input
              id="pickupLocation"
              placeholder="เช่น Ang Kaew, ลานคณะวิศวะ"
              className="rounded-xl"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียดเพิ่มเติม *</Label>
            <Textarea
              id="description"
              placeholder="อธิบายสภาพสินค้า ขนาด จุดเด่น หรือข้อควรระวัง"
              className="rounded-xl min-h-32"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isSubmitting}
            >
              ยกเลิก
            </Button>
            <Button type="submit" className="rounded-xl gap-2" disabled={isSubmitting}>
              <Upload className="h-4 w-4" />
              {isSubmitting ? "กำลังโพสต์..." : "โพสต์ของฉัน"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
