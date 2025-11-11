import {
  User,
  Mail,
  MapPin,
  Edit,
  Settings,
  ArrowRightLeft,
  Calendar,
  Package,
  History,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type ExchangeHistory = {
  completedDate: string;
  exchangedWith: string;
  receivedItem: {
    title: string;
    image?: string;
  };
  co2Saved: string;
};

export type ProfilePost = {
  id: number | string;
  title: string;
  category: string;
  type: string;
  status: string;
  image?: string;
  views?: number;
  exchangeHistory?: ExchangeHistory | null;
};

export type ProfileInfo = {
  name: string;
  faculty: string;
  email: string;
  location: string;
  role: string;
  avatar?: string;
  stats?: {
    itemsShared?: number | string;
    co2Reduced?: string;
  };
};

interface ProfilePageProps {
  profile?: ProfileInfo;
  posts?: ProfilePost[];
}

export function ProfilePage({ profile, posts }: ProfilePageProps) {
  const userProfile = profile ?? null;
  const userPosts = posts ?? [];
  const activePosts = userPosts.filter((post) => !post.exchangeHistory);
  const historyPosts = userPosts.filter((post) => post.exchangeHistory);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card className="rounded-2xl mb-6 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-accent" />
        <CardContent className="p-6 -mt-16 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            <Avatar className="h-32 w-32 border-4 border-card">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {userProfile?.avatar ?? "??"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {userProfile ? (
                  <div>
                    <h2 className="mb-2">{userProfile.name}</h2>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>
                          {userProfile.faculty} - {userProfile.role}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{userProfile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{userProfile.location}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="h-6 w-48 bg-muted rounded" />
                    <div className="space-y-2">
                      <div className="h-4 w-64 bg-muted rounded" />
                      <div className="h-4 w-72 bg-muted rounded" />
                      <div className="h-4 w-56 bg-muted rounded" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ข้อมูลโปรไฟล์ไจะขึ้นถ้าเชื่อม backend 
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-xl gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl">
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <h3 className="text-accent">{userProfile?.stats?.itemsShared ?? "--"}</h3>
              <p className="text-sm text-muted-foreground">Items Shared</p>
            </div>
            <div className="text-center">
              <h3 className="text-primary">{userProfile?.stats?.co2Reduced ?? "--"}</h3>
              <p className="text-sm text-muted-foreground">CO₂ Reduced</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Posts and History */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="active" className="gap-2">
            <Package className="h-4 w-4" />
            โพสต์ของฉัน
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            ประวัติการแลกเปลี่ยน
          </TabsTrigger>
        </TabsList>

        {/* Active Posts Tab */}
        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePosts.map((post) => (
                <Card key={post.id} className="rounded-2xl overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={post.image ?? "https://placehold.co/600x400?text=No+Image"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 rounded-full">
                      {post.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="mb-2">{post.title}</h4>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <Badge variant="outline" className="rounded-full text-xs">
                        {post.category}
                      </Badge>
                      <span>{post.views} views</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 rounded-xl">
                        จัดการ
                      </Button>
                      <Button variant="outline" className="flex-1 rounded-xl">
                        แก้ไข
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {activePosts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h4 className="mb-2 text-muted-foreground">ยังไม่มีโพสต์</h4>
              <p className="text-sm text-muted-foreground">
                เริ่มแลกเปลี่ยนของเพื่อลดขยะและช่วยสิ่งแวดล้อม
              </p>
            </div>
          )}
        </TabsContent>

        {/* Exchange History Tab */}
        <TabsContent value="history">
          <div className="space-y-6">
            {historyPosts.map((post) => (
                <Card key={post.id} className="rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="rounded-full bg-accent/20 text-accent border-accent/30">
                        แลกเปลี่ยนสำเร็จ
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{post.exchangeHistory.completedDate}</span>
                      </div>
                    </div>

                    {/* Exchange Visual - Horizontal */}
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* My Item */}
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border-2 border-primary/20">
                          <img
                            src={post.image ?? "https://placehold.co/600x400?text=No+Image"}
                            alt={post.title}
                            className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1">
                            <p className="text-xs text-primary mb-1">ของของฉัน</p>
                            <h4 className="mb-2">{post.title}</h4>
                            <Badge variant="outline" className="rounded-full text-xs">
                              {post.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Exchange Arrow */}
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-accent rounded-full">
                          <ArrowRightLeft className="h-6 w-6 text-white md:rotate-0 rotate-90" />
                        </div>
                      </div>

                      {/* Received Item */}
                      <div className="flex-1 w-full">
                        <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-xl border-2 border-accent/20">
                          <img
                            src={
                              post.exchangeHistory?.receivedItem.image ??
                              "https://placehold.co/600x400?text=No+Image"
                            }
                            alt={post.exchangeHistory?.receivedItem.title}
                            className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1">
                            <p className="text-xs text-accent mb-1">ที่ได้รับ</p>
                            <h4 className="mb-2">
                              {post.exchangeHistory?.receivedItem.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              จาก {post.exchangeHistory?.exchangedWith ?? "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CO2 Saved */}
                    <div className="text-center mt-4">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        ประหยัด CO₂ {post.exchangeHistory?.co2Saved ?? "--"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {historyPosts.length === 0 && (
            <div className="text-center py-12">
              <History className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h4 className="mb-2 text-muted-foreground">ยังไม่มีประวัติการแลกเปลี่ยน</h4>
              <p className="text-sm text-muted-foreground">
                เมื่อคุณแลกเปลี่ยนของสำเร็จ ประวัติจะแสดงที่นี่
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
