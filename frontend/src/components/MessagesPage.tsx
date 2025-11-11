import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import {
  MessageCircle,
  Search,
  Send,
  ArrowLeft,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Info,
  CheckCircle2,
  AlertCircle,
  Check,
  X,
  QrCode,
  Camera,
  Keyboard,
  ScanLine,
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import QRCode from "react-qr-code";

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  isRead: boolean;
}

interface ChatConversation {
  id: number;
  userId: number;
  userName: string;
  userFaculty: string;
  userAvatar: string;
  itemName: string;
  itemImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
  isActiveExchange: boolean; // true = คนที่กำลังจะแลกจริงๆ, false = คนอื่นที่สนใจแต่ไม่ได้แลก
  exchangeType: "incoming" | "outgoing"; // incoming = คนอื่นขอแลกของเรา, outgoing = เราขอแลกของคนอื่น
}

interface MessagesPageProps {
  conversations?: ChatConversation[];
}

export function MessagesPage({ conversations = [] }: MessagesPageProps) {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [exchangeCode, setExchangeCode] = useState("");
  const [scanMode, setScanMode] = useState<"camera" | "manual">("camera");
  const [manualCode, setManualCode] = useState("");
  const [completedExchanges, setCompletedExchanges] = useState<number[]>([]); // เก็บ ID ของแชทที่แลกเสร็จแล้ว

  

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.itemName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageInput.trim() || selectedChat === null) return;
    
    toast.info("ระบบแชทยังไม่ได้เชื่อมต่อกับแบ็กเอนด์");
    setMessageInput("");
  };

  const selectedConversation = conversations.find((c) => c.id === selectedChat);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">Messages</span>
          </div>
          <h1 className="mb-2 text-primary">ข้อความ</h1>
          <p className="text-muted-foreground">
            แชทคุยกับผู้ใช้งานและนัดรับของได้ที่นี่
          </p>
        </div>

        {/* Chat Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <Card className="lg:col-span-1 rounded-2xl border-2 border-primary/20">
            <CardContent className="p-4">
              {/* Info Banner */}
              <div className="mb-4 p-3 bg-accent/10 border border-accent/20 rounded-xl">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    ของหนึ่งชิ้นแลกได้แค่คนเดียว แชทที่มีเครื่องหมาย ✓ คือผู้รับที่ยืนยันแล้ว
                  </p>
                </div>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาข้อความ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl"
                />
              </div>

              {/* Conversation List */}
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-2">
                  {filteredConversations.map((conversation) => {
                    const isCompleted = completedExchanges.includes(conversation.id);
                    return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`w-full p-3 rounded-xl text-left transition-all relative ${
                        selectedChat === conversation.id
                          ? "bg-primary/10 border-2 border-primary/30"
                          : "bg-background hover:bg-muted border-2 border-transparent"
                      } ${!conversation.isActiveExchange || isCompleted ? "opacity-40" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className={`h-12 w-12 border-2 ${conversation.isActiveExchange ? "border-primary/30" : "border-muted"}`}>
                          <AvatarImage src={conversation.userAvatar} />
                          <AvatarFallback>{conversation.userName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex items-center gap-1">
                              <p className="font-medium text-sm truncate">
                                {conversation.userName}
                              </p>
                              {conversation.isActiveExchange && !isCompleted && (
                                <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0" />
                              )}
                              {isCompleted && (
                                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                              )}
                            </div>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-primary rounded-full h-5 w-5 flex items-center justify-center p-0 text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {conversation.userFaculty}
                          </p>
                          <p className="text-xs text-muted-foreground truncate mb-1">
                            {conversation.itemName}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground truncate flex-1">
                              {conversation.lastMessage}
                            </p>
                            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                              {conversation.lastMessageTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      {conversation.isActiveExchange && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="default" className={`rounded-full text-xs px-2 py-0 h-5 ${isCompleted ? "bg-green-600" : "bg-accent"}`}>
                            {isCompleted ? "แลกสำเร็จแล้ว" : "ยืนยันแล้ว"}
                          </Badge>
                        </div>
                      )}
                    </button>
                  );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat Window */}
          <Card className="lg:col-span-2 rounded-2xl border-2 border-primary/20">
            {selectedConversation ? (
              <CardContent className="p-0 h-[680px] flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b bg-gradient-to-r from-primary/5 to-accent/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden rounded-full"
                        onClick={() => setSelectedChat(null)}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <Avatar className="h-12 w-12 border-2 border-primary/30">
                        <AvatarImage src={selectedConversation.userAvatar} />
                        <AvatarFallback>
                          {selectedConversation.userName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{selectedConversation.userName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.userFaculty}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Info className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className={`mt-3 rounded-xl border ${
                    completedExchanges.includes(selectedConversation.id)
                      ? "bg-green-50 border-green-200"
                      : selectedConversation.isActiveExchange
                      ? "bg-accent/10 border-accent/30"
                      : "bg-white border-primary/20"
                  }`}>
                    <div className="p-3 flex items-center gap-3">
                      <img
                        src={selectedConversation.itemImage}
                        alt={selectedConversation.itemName}
                        className="h-12 w-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">กำลังคุยเรื่อง:</p>
                          {selectedConversation.isActiveExchange && !completedExchanges.includes(selectedConversation.id) && (
                            <Badge variant="default" className="rounded-full text-xs bg-accent">
                              ผู้รับที่ยืนยัน
                            </Badge>
                          )}
                          {completedExchanges.includes(selectedConversation.id) && (
                            <Badge variant="default" className="rounded-full text-xs bg-green-600">
                              แลกสำเร็จแล้ว
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.itemName}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons - แสดงเฉพาะเมื่อเป็นผู้รับที่ยืนยันและยังไม่แลกสำเร็จ */}
                    {selectedConversation.isActiveExchange && !completedExchanges.includes(selectedConversation.id) && (
                      <div className="px-3 pb-3 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 rounded-xl gap-2"
                          onClick={() => {
                            toast.info("ปฏิเสธคำขอแลกเปลี่ยน");
                            // Navigate back to home
                            window.location.href = "/";
                          }}
                        >
                          <X className="h-4 w-4" />
                          ปฏิเสธ
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1 rounded-xl gap-2"
                          onClick={() => {
                            // Generate random exchange code
                            const code = `EX${Date.now().toString().slice(-8)}`;
                            setExchangeCode(code);
                            setShowQRCode(true);
                          }}
                        >
                          <Check className="h-4 w-4" />
                          ยอมรับ
                        </Button>
                      </div>
                    )}

                    {/* แสดงสถานะเมื่อแลกสำเร็จแล้ว */}
                    {completedExchanges.includes(selectedConversation.id) && (
                      <div className="px-3 pb-3">
                        <div className="flex items-center justify-center gap-2 text-sm text-green-600 p-3 bg-green-100 border border-green-200 rounded-xl">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-medium">การแลกเปลี่ยนเสร็จสมบูรณ์แล้ว</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {selectedConversation.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === 0 ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            message.senderId === 0
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === 0
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t bg-background">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
                      <ImageIcon className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="พิมพ์ข้อความ..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 rounded-full"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      className="rounded-full flex-shrink-0"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="h-[680px] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="mb-2">เลือกแชทเพื่อเริ่มการสนทนา</h3>
                  <p className="text-muted-foreground text-sm">
                    คลิกที่รายการแชททางซ้ายเพื่อดูข้อความ
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* QR Scanner Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="max-w-md rounded-2xl">
          {selectedConversation?.exchangeType === "outgoing" ? (
            /* Outgoing: สแกน QR Code จากอีกฝ่าย (สมชาย) */
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ScanLine className="h-5 w-5 text-primary" />
                  สแกน QR Code เพื่อยืนยัน
                </DialogTitle>
                <DialogDescription>
                  สแกน QR Code ที่{selectedConversation?.userName}แสดงให้คุณ หรือป้อนรหัสการแลกเปลี่ยนที่ได้รับ
                </DialogDescription>
              </DialogHeader>

              {/* Mode Toggle */}
              <div className="flex gap-2 p-1 bg-muted rounded-xl">
                <Button
                  variant={scanMode === "camera" ? "default" : "ghost"}
                  className="flex-1 rounded-lg gap-2"
                  onClick={() => setScanMode("camera")}
                >
                  <Camera className="h-4 w-4" />
                  สแกนกล้อง
                </Button>
                <Button
                  variant={scanMode === "manual" ? "default" : "ghost"}
                  className="flex-1 rounded-lg gap-2"
                  onClick={() => setScanMode("manual")}
                >
                  <Keyboard className="h-4 w-4" />
                  ใส่รหัส
                </Button>
              </div>

              <div className="py-4">
                {scanMode === "camera" ? (
                  /* Camera Scanner Mode */
                  <div className="flex flex-col items-center gap-4">
                    {/* Camera View Placeholder */}
                    <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                      {/* Scanning overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent animate-pulse" />
                      
                      {/* Camera Icon */}
                      <div className="relative z-10 text-white text-center">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-sm opacity-70">กรุณาอนุญาตการใช้งานกล้อง</p>
                        <p className="text-xs mt-2 opacity-50">วาง QR Code ที่ได้รับให้อยู่ในกรอบ</p>
                      </div>

                      {/* Scanning Frame */}
                      <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="relative w-full aspect-square max-w-[280px]">
                          {/* Corner decorations */}
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-2xl" />
                        </div>
                      </div>
                    </div>

                    {/* Camera Instructions */}
                    <div className="w-full bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
                      <p className="text-sm font-medium text-primary">วิธีสแกน:</p>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>อนุญาตให้เข้าถึงกล้องของคุณ</li>
                        <li>วาง QR Code ที่{selectedConversation?.userName}แสดงให้อยู่ในกรอบ</li>
                        <li>ระบบจะสแกนอัตโนมัติเมื่อพบ QR Code</li>
                      </ol>
                    </div>

                    {/* Demo Scan Button */}
                    <Button
                      onClick={() => {
                        toast.success("✅ สแกน QR Code สำเร็จ!");
                        if (selectedChat !== null) {
                          setCompletedExchanges(prev => [...prev, selectedChat]);
                        }
                        setShowQRCode(false);
                        toast.success("✅ การแลกเปลี่ยนเสร็จสมบูรณ์!", {
                          description: "ของจะถูกลบออกจากหน้า Home"
                        });
                      }}
                      className="w-full rounded-xl gap-2"
                      variant="outline"
                    >
                      <Check className="h-4 w-4" />
                      [Demo] จำลองการสแกนสำเร็จ
                    </Button>
                  </div>
                ) : (
                  /* Manual Code Input Mode */
                  <div className="flex flex-col gap-4">
                    <div className="space-y-3">
                      <label className="text-sm font-medium">ป้อนรหัสการแลกเปลี่ยนที่ได้รับ</label>
                      <Input
                        placeholder="เช่น EX12345678"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                        className="text-center text-lg font-mono tracking-wider rounded-xl"
                        maxLength={12}
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        ใส่รหัสที่{selectedConversation?.userName}ให้คุณ (EX + 8 หลัก)
                      </p>
                    </div>

                    <div className="bg-muted rounded-xl p-4 space-y-2">
                      <p className="text-sm font-medium">ตัวอย่างรหัส:</p>
                      <p className="text-lg font-mono text-center bg-background px-4 py-2 rounded-lg">
                        EX12345678
                      </p>
                    </div>

                    <Button
                      onClick={() => {
                        if (!manualCode.trim()) {
                          toast.error("กรุณาป้อนรหัสการแลกเปลี่ยน");
                          return;
                        }
                        if (!/^EX\d{8}$/.test(manualCode)) {
                          toast.error("รหัสไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง");
                          return;
                        }
                        
                        toast.success("✅ ยืนยันรหัสสำเร็จ!");
                        if (selectedChat !== null) {
                          setCompletedExchanges(prev => [...prev, selectedChat]);
                        }
                        setShowQRCode(false);
                        setManualCode("");
                        toast.success("✅ การแลกเปลี่ยนเสร็จสมบูรณ์!", {
                          description: "ของจะถูกลบออกจากหน้า Home"
                        });
                      }}
                      disabled={!manualCode.trim()}
                      className="w-full rounded-xl gap-2"
                    >
                      <Check className="h-4 w-4" />
                      ยืนยันรหัส
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Incoming: แสดง QR Code ให้อีกฝ่ายสแกน (วรรณา) */
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-primary" />
                  แสดง QR Code
                </DialogTitle>
                <DialogDescription>
                  แสดง QR Code หรือรหัสนี้ให้{selectedConversation?.userName}สแกนเพื่อยืนยันการแลกเปลี่ยน
                </DialogDescription>
              </DialogHeader>

              <div className="py-4 space-y-4">
                {/* QR Code Display */}
                <div className="flex flex-col items-center gap-4">
                  <div className="p-6 bg-white rounded-2xl border-4 border-primary/20">
                    <QRCode
                      value={exchangeCode}
                      size={220}
                      level="H"
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>

                  {/* Exchange Code */}
                  <div className="w-full space-y-2">
                    <p className="text-sm font-medium text-center">รหัสการแลกเปลี่ยน</p>
                    <div className="bg-muted rounded-xl p-4">
                      <p className="text-2xl font-mono text-center tracking-wider font-bold">
                        {exchangeCode}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      ให้{selectedConversation?.userName}สแกน QR Code หรือใส่รหัสนี้
                    </p>
                  </div>

                  {/* Instructions */}
                  <div className="w-full bg-accent/10 border border-accent/20 rounded-xl p-4 space-y-2">
                    <p className="text-sm font-medium text-accent">คำแนะนำ:</p>
                    <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>แสดง QR Code ให้{selectedConversation?.userName}สแกน</li>
                      <li>หรือบอกรหัสด้านบนให้อีกฝ่ายใส่</li>
                      <li>เมื่ออีกฝ่ายยืนยันแล้ว การแลกเปลี่ยนจะเสร็จสมบูรณ์</li>
                    </ol>
                  </div>

                  {/* Demo Complete Button */}
                  <Button
                    onClick={() => {
                      toast.success("✅ อีกฝ่ายยืนยันแล้ว!");
                      if (selectedChat !== null) {
                        setCompletedExchanges(prev => [...prev, selectedChat]);
                      }
                      setShowQRCode(false);
                      toast.success("✅ การแลกเปลี่ยนเสร็จสมบูรณ์!", {
                        description: "ของจะถูกลบออกจากหน้า Home"
                      });
                    }}
                    className="w-full rounded-xl gap-2"
                    variant="outline"
                  >
                    <Check className="h-4 w-4" />
                    [Demo] จำลองอีกฝ่ายยืนยันแล้ว
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
