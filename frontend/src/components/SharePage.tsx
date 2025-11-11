import { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ItemCard, type ItemCardProps } from "./ItemCard";
import { PostItemModal } from "./PostItemModal";
import { ExchangeRequestModal } from "./ExchangeRequestModal";
import { Search, Plus, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

interface ExchangeItem extends ItemCardProps {
  id: number | string;
  description?: string;
}

interface SharePageProps {
  onNavigate?: (page: string) => void;
  items?: ExchangeItem[];
}

export function SharePage({ onNavigate, items = [] }: SharePageProps) {
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ title: string; owner: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [conditionFilter, setConditionFilter] = useState("all");

  const handleExchangeClick = (itemTitle: string, userName: string) => {
    setSelectedItem({ title: itemTitle, owner: userName });
    setExchangeModalOpen(true);
  };

  const filterItems = (itemsToFilter: ExchangeItem[]) => {
    let filtered = itemsToFilter;

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.category.toLowerCase().includes(searchLower) ||
          item.location.toLowerCase().includes(searchLower)
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      const categoryMap: Record<string, string> = {
        books: "Books & Textbooks",
        clothes: "Clothes",
        electronics: "Electronics",
        dorm: "Dorm Items",
        sports: "Sports Equipment",
        eco: "Eco Items",
      };
      const targetCategory = categoryMap[categoryFilter];
      filtered = filtered.filter((item) => item.category === targetCategory);
    }

    // Filter by condition
    if (conditionFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.condition.toLowerCase() === conditionFilter.toLowerCase()
      );
    }

    return filtered;
  };

  const handleSearch = () => {
    // This function is called when the search button is clicked
    // The filtering happens automatically through the filterItems function
    if (searchTerm.trim()) {
      toast.success(`ค้นหา: "${searchTerm}"`);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setConditionFilter("all");
    toast.info("ล้างตัวกรองทั้งหมด");
  };

  const filteredItems = filterItems(items);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="mb-2">แลกเปลี่ยนของ</h1>
            <p className="text-muted-foreground">
              เลือกดูของหรือโพสต์ของที่ต้องการแลกเปลี่ยน
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setPostModalOpen(true)}
            className="rounded-xl gap-2"
          >
            <Plus className="h-5 w-5" />
            โพสต์ของ
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="ค้นหาสินค้า..."
              className="pl-10 pr-4 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          <Button 
            variant="default" 
            className="rounded-xl gap-2 sm:w-auto"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
            ค้นหา
          </Button>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl">
              <SelectValue placeholder="หมวดหมู่" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
              <SelectItem value="books">Books & Textbooks</SelectItem>
              <SelectItem value="clothes">Clothes</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="dorm">Dorm Items</SelectItem>
              <SelectItem value="sports">Sports Equipment</SelectItem>
              <SelectItem value="eco">Eco Items</SelectItem>
            </SelectContent>
          </Select>
          <Select value={conditionFilter} onValueChange={setConditionFilter}>
            <SelectTrigger className="w-full sm:w-48 rounded-xl">
              <SelectValue placeholder="สภาพสินค้า" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทุกสภาพ</SelectItem>
              <SelectItem value="like new">Like New</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="any">Any</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-xl"
            onClick={handleClearFilters}
            title="ล้างตัวกรอง"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Items List */}
      <div className="w-full">
        {filteredItems.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-muted-foreground">
                พบ {filteredItems.length} รายการ
              </p>
              {(searchTerm || categoryFilter !== "all" || conditionFilter !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="rounded-lg"
                >
                  ล้างตัวกรองทั้งหมด
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard 
                  key={item.id} 
                  {...item} 
                  onExchangeClick={() => handleExchangeClick(item.title, item.user)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-2">ไม่พบรายการที่ตรงกับการค้นหา</p>
            <Button
              variant="link"
              onClick={handleClearFilters}
              className="text-primary"
            >
              ล้างตัวกรอง
            </Button>
          </div>
        )}
      </div>

      <PostItemModal open={postModalOpen} onOpenChange={setPostModalOpen} />
      
      <ExchangeRequestModal
        open={exchangeModalOpen}
        onOpenChange={setExchangeModalOpen}
        targetItem={selectedItem}
      />
    </div>
  );
}
