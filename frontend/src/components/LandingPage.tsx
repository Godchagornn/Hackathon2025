import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ItemCard, type ItemCardProps } from "./ItemCard";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { PostItemModal } from "./PostItemModal";
import { ExchangeRequestModal } from "./ExchangeRequestModal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import {
  Upload,
  Search,
  Leaf,
  Users,
  Recycle,
  TrendingDown,
  BookOpen,
  Shirt,
  Sofa,
  UtensilsCrossed,
  Pen,
  Laptop,
  Sparkles,
  ArrowRight,
  Package,
  RefreshCw,
  Heart,
  TreePine,
  Sprout,
  Globe,
  Quote,
  CheckCircle2,
  Star,
  MessageCircle,
  Clock,
  Zap,
  Shield,
  Share2,
  Send,
  Image as ImageIcon,
  MapPin,
  MoreHorizontal,
  TrendingUp,
  Plus,
  Camera,
  SlidersHorizontal,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

interface ExchangeItem extends ItemCardProps {
  id: number | string;
  ownerId?: number;
}

interface LandingPageProps {
  onNavigate: (page: string) => void;
  activeProfileId: number;
  apiBaseUrl: string;
  availableItems?: ExchangeItem[];
}

const categories = [
  { name: "Books", icon: BookOpen, color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  { name: "Clothing", icon: Shirt, color: "text-pink-600", bgColor: "bg-pink-50", borderColor: "border-pink-200" },
  { name: "Furniture", icon: Sofa, color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-200" },
  { name: "Kitchen", icon: UtensilsCrossed, color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  { name: "Stationery", icon: Pen, color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  { name: "Electronics", icon: Laptop, color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
];

export function LandingPage({ onNavigate, activeProfileId, apiBaseUrl, availableItems = [] }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    owner: string;
    image: string;
    ownerId?: number;
    itemId?: number;
  } | null>(null);
  const items: ExchangeItem[] = availableItems;

  const handleExchangeClick = (item: ExchangeItem) => {
    const numericItemId = Number(item.id);
    setSelectedItem({
      title: item.title,
      owner: item.user,
      image: item.image,
      ownerId: item.ownerId,
      itemId: Number.isNaN(numericItemId) ? undefined : numericItemId,
    });
    setExchangeModalOpen(true);
  };

  return (
    <div className="w-full">
      {/* Hero Section - EXCHANGE as the HERO */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 opacity-5 animate-pulse">
            <Leaf className="h-40 w-40 text-primary" />
          </div>
          <div className="absolute bottom-10 left-10 opacity-5 animate-pulse delay-75">
            <RefreshCw className="h-32 w-32 text-accent" />
          </div>
          <div className="absolute top-1/2 left-1/2 opacity-5 animate-pulse delay-150">
            <TreePine className="h-32 w-32 text-primary" />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            {/* Left Column - Heading & Description */}
            <div className="order-1 lg:order-1">
              <h1 className="text-4xl md:text-5xl lg:text-6xl mb-3">
                Exchange
                <br />
                <span className="text-primary">What You Have</span>
                <br />
                <span className="text-accent">For What You Need</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                The smartest way for CMU students to exchange items. 
                <strong className="text-foreground"> No money, no waste, just community.</strong>
              </p>
            </div>

            {/* Right Column - Benefits */}
            <div className="flex flex-col gap-4 order-2 lg:order-2">
              {/* Key Benefits Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2 p-3 rounded-xl bg-white/60 backdrop-blur border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm">Fair Exchange</p>
                    <p className="text-xs text-muted-foreground">Trade value for value</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-xl bg-white/60 backdrop-blur border border-accent/10 hover:border-accent/30 transition-all hover:shadow-md">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <TreePine className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm">Zero Waste</p>
                    <p className="text-xs text-muted-foreground">Everything reused</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-xl bg-white/60 backdrop-blur border border-primary/10 hover:border-primary/30 transition-all hover:shadow-md">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm">Build Community</p>
                    <p className="text-xs text-muted-foreground">Meet fellow students</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 rounded-xl bg-white/60 backdrop-blur border border-accent/10 hover:border-accent/30 transition-all hover:shadow-md">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm">Save Money</p>
                    <p className="text-xs text-muted-foreground">No buying needed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Items Section */}
      <section id="available-items" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"  >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-3">
                  <Package className="h-4 w-4 text-accent" />
                  <span className="text-sm text-accent">Browse Items</span>
                </div>
                <h2 className="mb-2">Available for Exchange</h2>
                <p className="text-muted-foreground">
                  Discover items posted by fellow CMU students
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setPostModalOpen(true)}
                className="rounded-2xl gap-2 shadow-md"
              >
                <Plus className="h-5 w-5" />
                Post Item
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      toast.success(`ค้นหา: "${searchQuery}"`);
                    }
                  }}
                  className="pl-10 pr-4 rounded-xl border-2"
                />
              </div>
              <Button 
                variant="default" 
                className="rounded-xl gap-2 sm:w-auto"
                onClick={() => {
                  if (searchQuery.trim()) {
                    toast.success(`ค้นหา: "${searchQuery}"`);
                  }
                }}
              >
                <Search className="h-4 w-4" />
                ค้นหา
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-48 rounded-xl border-2">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="books">Books & Textbooks</SelectItem>
                  <SelectItem value="clothes">Clothes</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="dorm">Dorm Items</SelectItem>
                  <SelectItem value="sports">Sports Equipment</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-48 rounded-xl border-2">
                  <SelectValue placeholder="Condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Conditions</SelectItem>
                  <SelectItem value="new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Items Grid */}
          <div className="w-full">
            {items.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <ItemCard 
                    key={item.id} 
                    {...item} 
                    onExchangeClick={() => handleExchangeClick(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
                  <Package className="h-10 w-10 text-primary" />
                </div>
                <p className="text-muted-foreground mb-2">No items found</p>
                <Button
                  onClick={() => setPostModalOpen(true)}
                  variant="outline"
                  className="rounded-xl gap-2 mt-2"
                >
                  <Plus className="h-4 w-4" />
                  Be the first to post!
                </Button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Post Item Modal */}
      <PostItemModal
        open={postModalOpen}
        onOpenChange={setPostModalOpen}
      />

      {/* Exchange Request Modal */}
      <ExchangeRequestModal
        open={exchangeModalOpen}
        onOpenChange={setExchangeModalOpen}
        targetItem={selectedItem}
        requesterId={activeProfileId}
        apiBaseUrl={apiBaseUrl}
      />
    </div>
  );
}
