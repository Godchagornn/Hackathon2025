import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "../config";
import type { AuthSessionPayload } from "../types/auth";

interface LoginPageProps {
  onLoginSuccess: (session: AuthSessionPayload) => void;
  onNavigateToRegister: () => void;
}

export function LoginPage({ onLoginSuccess, onNavigateToRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body?.message ?? "เข้าสู่ระบบไม่สำเร็จ");
      }

      toast.success("เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับสู่ CMU ShareCycle");
      onLoginSuccess(body);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast.error("เข้าสู่ระบบไม่สำเร็จ", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center space-y-6 p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
              <Leaf className="h-9 w-9 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-primary">CMU ShareCycle</h1>
              <p className="text-muted-foreground">Green Sharing Platform</p>
            </div>
          </div>
          
          <div className="relative w-full max-w-md h-80 rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1532622785990-d2c36a76f5a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMGNhbXB1cyUyMGdyZWVufGVufDF8fHx8MTc2MjIzODQxM3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Students sharing"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
              <div className="text-white">
                <h3 className="text-white mb-2">แชร์ของ ลดขยะ สร้างอนาคตที่ยั่งยืน</h3>
                <p className="text-white/90 text-sm">
                  ร่วมเป็นส่วนหนึ่งของการเปลี่ยนแปลงในมหาวิทยาลัยเชียงใหม่
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full max-w-md">
            <div className="text-center p-4 rounded-2xl bg-primary/10">
              <div className="text-2xl text-primary mb-1">4.5K+</div>
              <div className="text-xs text-muted-foreground">สิ่งของที่แชร์</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-accent/10">
              <div className="text-2xl text-accent mb-1">1.2K+</div>
              <div className="text-xs text-muted-foreground">สมาชิก</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-primary/10">
              <div className="text-2xl text-primary mb-1">15K+</div>
              <div className="text-xs text-muted-foreground">คะแนนสะสม</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md border-2 border-primary/20 rounded-3xl shadow-2xl">
            <CardHeader className="space-y-3 pb-6">
              {/* Mobile Logo */}
              <div className="flex lg:hidden items-center justify-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center">
                  <Leaf className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <h2 className="text-primary">CMU ShareCycle</h2>
                  <p className="text-sm text-muted-foreground">Green Sharing Platform</p>
                </div>
              </div>

              <CardTitle className="text-center">เข้าสู่ระบบ</CardTitle>
              <CardDescription className="text-center">
                กรอกอีเมลและรหัสผ่านเพื่อเข้าใช้งาน
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล CMU</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@cmu.ac.th"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-primary" />
                    <span className="text-muted-foreground">จดจำฉันไว้</span>
                  </label>
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => toast.info("กรุณาติดต่อแอดมินเพื่อรีเซ็ตรหัสผ่าน")}
                  >
                    ลืมรหัสผ่าน?
                  </button>
                </div>

                <Button type="submit" className="w-full rounded-xl" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">หรือ</span>
                  </div>
                </div>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">ยังไม่มีบัญชี? </span>
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={onNavigateToRegister}
                  >
                    สมัครสมาชิก
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
