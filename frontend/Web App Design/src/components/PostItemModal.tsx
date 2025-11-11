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
import { Upload, Leaf, X, Image as ImageIcon, RefreshCw, Package, Calendar } from "lucide-react";
import { toast } from "sonner@2.0.3";

interface PostItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostItemModal({ open, onOpenChange }: PostItemModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    toast.success("🌱 Item posted successfully!", {
      description: "Your item has been added to ShareCycle.",
    });
    // Reset form
    setImagePreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            โพสต์ของเพื่อแลกเปลี่ยน
          </DialogTitle>
          <DialogDescription>
            โพสต์ของที่คุณต้องการแลกเปลี่ยนกับชาว CMU
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Upload - First for better UX */}
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image *</Label>
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

          {/* Item Name */}
          <div className="space-y-2">
            <Label htmlFor="title">Item Name *</Label>
            <Input
              id="title"
              placeholder="e.g., Calculus Textbook"
              className="rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select required>
                <SelectTrigger id="category" className="rounded-xl">
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

            {/* Condition */}
            <div className="space-y-2">
              <Label htmlFor="condition">Condition *</Label>
              <Select required>
                <SelectTrigger id="condition" className="rounded-xl">
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
          </div>

          {/* Looking For */}
          <div className="space-y-2 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <Label htmlFor="lookingFor" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-primary" />
              Looking to Exchange For *
            </Label>
            <Input
              id="lookingFor"
              placeholder="e.g., Laptop stand, Kitchen utensils, Study desk"
              className="rounded-xl"
              required
            />
            <p className="text-xs text-muted-foreground">
              Let others know what you're looking for in exchange
            </p>
          </div>

          {/* Expiry Date - NEW */}
          <div className="space-y-2 p-4 rounded-xl bg-accent/5 border border-accent/20">
            <Label htmlFor="expiryDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              วันหมดอายุของโพสต์ *
            </Label>
            <Input
              id="expiryDate"
              type="date"
              className="rounded-xl"
              min={new Date().toISOString().split('T')[0]}
              required
            />
            <p className="text-xs text-muted-foreground">
              กำหนดวันที่ต้องการให้โพสต์นี้หมดอายุ (เมื่อครบกำหนด ระบบจะเก็บไว้ในประวัติอัตโนมัติ)
            </p>
          </div>

          {/* Pickup Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Pickup Location *</Label>
            <Input
              id="location"
              placeholder="e.g., Engineering Building, Library 1st floor"
              className="rounded-xl"
              required
            />
            <p className="text-xs text-muted-foreground">
              Specify where people can meet you to exchange/pick up the item
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your item, its features, why you're sharing it..."
              className="rounded-xl min-h-28"
              required
            />
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
              <Leaf className="h-4 w-4" />
              Post Item
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}