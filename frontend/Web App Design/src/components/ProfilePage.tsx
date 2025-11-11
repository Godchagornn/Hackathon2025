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
  Leaf,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function ProfilePage() {
  const userProfile = {
    name: "Your Name",
    faculty: "Medicine",
    email: "your.email@cmu.ac.th",
    location: "Faculty of Medicine",
    role: "Student",
    avatar: "YO",
  };

  const myPosts = [
    {
      id: 1,
      title: "Physics Textbook",
      category: "Books",
      type: "Exchange",
      status: "Active",
      image: "https://images.unsplash.com/photo-1737205788369-77514fcab7b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWNvbmQlMjBoYW5kJTIwYm9va3N8ZW58MXx8fHwxNzYyMjM2MTIxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      views: 42,
      exchangeHistory: null,
    },
    {
      id: 2,
      title: "Study Lamp",
      category: "Dorm Items",
      type: "Exchange",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1593793837604-ae4ba38bd5c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBzdXN0YWluYWJpbGl0eSUyMGdyZWVufGVufDF8fHx8MTc2MjIzNjEyMXww&ixlib=rb-4.1.0&q=80&w=1080",
      views: 28,
      exchangeHistory: {
        completedDate: "15 ต.ค. 2567",
        exchangedWith: "ปรียา สุขใจ",
        receivedItem: {
          title: "Portable Speaker",
          image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400",
        },
        co2Saved: "2.5kg",
      },
    },
    {
      id: 3,
      title: "Reusable Bottles Set",
      category: "Eco Items",
      type: "Exchange",
      status: "Active",
      image: "https://images.unsplash.com/photo-1695268987834-4610233bb00c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMGl0ZW1zfGVufDF8fHx8MTc2MjIzNjEyMXww&ixlib=rb-4.1.0&q=80&w=1080",
      views: 56,
      exchangeHistory: null,
    },
    {
      id: 4,
      title: "Chemistry Lab Manual",
      category: "Books",
      type: "Exchange",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
      views: 38,
      exchangeHistory: {
        completedDate: "28 ก.ย. 2567",
        exchangedWith: "สมชาย วงศ์ใหญ่",
        receivedItem: {
          title: "Biology Textbook 2nd Edition",
          image: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400",
        },
        co2Saved: "3.2kg",
      },
    },
    {
      id: 5,
      title: "Desk Organizer Set",
      category: "Dorm Items",
      type: "Exchange",
      status: "Completed",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400",
      views: 45,
      exchangeHistory: {
        completedDate: "10 ก.ย. 2567",
        exchangedWith: "มานี ใจดี",
        receivedItem: {
          title: "Plant Pots Collection",
          image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400",
        },
        co2Saved: "1.8kg",
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card className="rounded-2xl mb-6 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-accent" />
        <CardContent className="p-6 -mt-16 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            <Avatar className="h-32 w-32 border-4 border-card">
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {userProfile.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="mb-2">{userProfile.name}</h2>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{userProfile.faculty} - {userProfile.role}</span>
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
              <h3 className="text-accent">23</h3>
              <p className="text-sm text-muted-foreground">Items Shared</p>
            </div>
            <div className="text-center">
              <h3 className="text-primary">127.5kg</h3>
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
            {myPosts
              .filter((post) => !post.exchangeHistory)
              .map((post) => (
                <Card key={post.id} className="rounded-2xl overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={post.image}
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
          {myPosts.filter((post) => !post.exchangeHistory).length === 0 && (
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
            {myPosts
              .filter((post) => post.exchangeHistory)
              .map((post) => (
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
                            src={post.image}
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
                            src={post.exchangeHistory.receivedItem.image}
                            alt={post.exchangeHistory.receivedItem.title}
                            className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1">
                            <p className="text-xs text-accent mb-1">ที่ได้รับ</p>
                            <h4 className="mb-2">
                              {post.exchangeHistory.receivedItem.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              จาก {post.exchangeHistory.exchangedWith}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CO2 Saved */}
                    <div className="text-center mt-4">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        ประหยัด CO₂ {post.exchangeHistory.co2Saved}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
          {myPosts.filter((post) => post.exchangeHistory).length === 0 && (
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
