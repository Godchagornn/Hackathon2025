import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Leaf, Mail, Lock, Eye, EyeOff, User, Building2, ArrowLeft } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface RegisterPageProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

export function RegisterPage({ onRegisterSuccess, onBackToLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    faculty: "",
    studentId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const faculties = [
    "คณะวิศวกรรมศาสตร์",
    "คณะแพทยศาสตร์",
    "คณะวิทยาศาสตร์",
    "คณะเกษตรศาสตร์",
    "คณะบริหารธุรกิจ",
    "คณะมนุษยศาสตร์",
    "คณะสังคมศาสตร์",
    "คณะศึกษาศาสตร์",
    "คณะเศรษฐศาสตร์",
    "คณะสถาปัตยกรรมศาสตร์",
    "คณะนิติศาสตร์",
    "คณะศิลปกรรมศาสตร์",
  ];

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.faculty || !formData.studentId) {
      toast.error("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (!formData.email.endsWith("@cmu.ac.th")) {
      toast.error("กรุณาใช้อีเมล CMU (@cmu.ac.th) เท่านั้น");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    toast.success("สมัครสมาชิกสำเร็จ! ยินดีต้อนรับสู่ CMU ShareCycle");
    onRegisterSuccess();
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
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwc3R1ZGVudHMlMjBoYXBweXxlbnwxfHx8fDE3NjIyNDE2Njd8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Students community"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
              <div className="text-white">
                <h3 className="text-white mb-2">เข้าร่วมชุมชนนักศึกษา CMU</h3>
                <p className="text-white/90 text-sm">
                  แชร์ของ สร้างความยั่งยืน และรับคะแนนสิ่งแวดล้อม
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 w-full max-w-md">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/10">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm">ลดขยะและปกป้องสิ่งแวดล้อม</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-accent/10">
              <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm">เชื่อมต่อกับนักศึกษาคนอื่นๆ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
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

              <CardTitle className="text-center">สมัครสมาชิก</CardTitle>
              <CardDescription className="text-center">
                เริ่มต้นการเดินทางสู่ความยั่งยืนกับเรา
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">ชื่อ</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="ชื่อจริง"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="pl-10 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">นามสกุล</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="นามสกุล"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">รหัสนักศึกษา</Label>
                  <Input
                    id="studentId"
                    type="text"
                    placeholder="630xxxxx"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="faculty">คณะ</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                    <Select value={formData.faculty} onValueChange={(value) => setFormData({ ...formData, faculty: value })}>
                      <SelectTrigger className="pl-10 rounded-xl">
                        <SelectValue placeholder="เลือกคณะ" />
                      </SelectTrigger>
                      <SelectContent>
                        {faculties.map((faculty) => (
                          <SelectItem key={faculty} value={faculty}>
                            {faculty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล CMU</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="student@cmu.ac.th"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      placeholder="อย่างน้อย 6 ตัวอักษร"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="กรอกรหัสผ่านอีกครั้ง"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10 pr-10 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  size="lg"
                >
                  สมัครสมาชิก
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">หรือ</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={onBackToLogin}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  กลับไปหน้าเข้าสู่ระบบ
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
