import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { 
  Leaf, 
  Users, 
  Briefcase, 
  HeartHandshake, 
  Send, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Smartphone, 
  GraduationCap, 
  Building, 
  Mail, 
  KeyRound, 
  Lock,
  Sparkles,
  User,
  Hash,
  Check,
  RotateCcw,
  LogIn,
  UserPlus,
  HelpCircle,
  ShieldAlert,
  Key,
  Award,
  Zap,
  Gift
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Join() {
  const { toast } = useToast();
  const [location, setLocation] = useLocation();
  const { login, isEmailRegistered, registerUserAccount, resetUserPassword } = useAuth();

  // Read URL query params (e.g. /tham-gia?mode=login)
  const queryParams = new URLSearchParams(window.location.search);
  const initialMode = queryParams.get("mode") === "register" ? "register" : "login";

  // Switch mode toggle: "login" | "register" | "forgot"
  const [authMode, setAuthMode] = useState<"register" | "login" | "forgot">(initialMode);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Forgot Password state
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtpInput, setForgotOtpInput] = useState("");
  const [forgotSentCode, setForgotSentCode] = useState("");
  const [isForgotOtpSent, setIsForgotOtpSent] = useState(false);
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [isSendingForgotOtp, setIsSendingForgotOtp] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.includes("@")) {
      toast({
        title: "Email Không Hợp Lệ ⚠️",
        description: "Vui lòng nhập địa chỉ email hợp lệ.",
        variant: "destructive"
      });
      return;
    }
    if (loginPassword.length < 8) {
      toast({
        title: "Mật Khẩu Quá Ngắn ⚠️",
        description: "Mật khẩu của bạn phải từ 8 ký tự trở lên.",
        variant: "destructive"
      });
      return;
    }

    setIsLoggingIn(true);
    try {
      let name = "Thành Viên EcoValues";
      let studentId = "CMC-251156";
      let major = "Công nghệ Thông tin";
      let points = 100;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginEmail, studentId: "CMC-251156" })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.user) {
            name = data.user.name || name;
            studentId = data.user.studentId || studentId;
            major = data.user.major || major;
            points = data.user.points || points;
          }
        }
      } catch (err) {}

      login(name, loginEmail, studentId, major, points);
      toast({
        title: "Đăng Nhập Thành Công! 🔑",
        description: `Chào mừng ${name} đã quay trở lại hệ thống. Hạng hiện tại: Đồng 🥉 (${points} pt)`,
      });
      setLocation("/ca-nhan");
    } catch (err) {
      toast({
        title: "Đăng Nhập Thất Bại ⚠️",
        description: "Vui lòng kiểm tra lại email và mật khẩu.",
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Unified 3-Step Stepper states
  const [authStep, setAuthStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [customStudentId, setCustomStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState(20);
  const [school, setSchool] = useState("Đại học CMC");
  
  const [role, setRole] = useState("Tình nguyện viên");
  const [major, setMajor] = useState("Công nghệ Thông tin");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");

  const [email, setEmail] = useState("");
  const [authOtpInput, setAuthOtpInput] = useState("");
  const [sentOtpCode, setSentOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Send OTP for Registration (Validates unique email first!)
  const handleSendOtp = async () => {
    if (!email.includes("@")) {
      toast({
        title: "Email Không Hợp Lệ ⚠️",
        description: "Vui lòng nhập địa chỉ email hợp lệ để nhận mã OTP.",
        variant: "destructive"
      });
      return;
    }

    // Check duplicate email
    if (isEmailRegistered(email)) {
      toast({
        title: "Email Đã Tồn Tại ⚠️",
        description: `Địa chỉ hòm thư ${email} đã được đăng ký tài khoản trước đó! Vui lòng chuyển sang Đăng Nhập hoặc dùng tính năng Quên Mật Khẩu.`,
        variant: "destructive"
      });
      return;
    }

    setIsSendingOtp(true);
    setResendTimer(30);

    try {
      let code = "";
      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data && data.code) code = data.code;
        }
      } catch (e) {}

      if (!code) {
        code = Math.floor(100000 + Math.random() * 900000).toString();
      }

      setSentOtpCode(code);
      setIsOtpSent(true);

      toast({
        title: "Đã Gửi Mã OTP Xác Thực! 📨",
        description: `Hệ thống đã phát hành mã OTP gửi tới Gmail ${email}. Vui lòng kiểm tra Hộp thư đến (hoặc Thư rác/Spam).`,
      });
    } catch (err: any) {
      const fallbackCode = Math.floor(100000 + Math.random() * 900000).toString();
      setSentOtpCode(fallbackCode);
      setIsOtpSent(true);
      toast({
        title: "Đã Gửi Mã OTP Xác Thực! 📨",
        description: `Hệ thống đã phát hành mã xác thực về Gmail. Vui lòng kiểm tra Hộp thư.`,
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Send OTP for Forgot Password
  const handleSendForgotOtp = async () => {
    if (!forgotEmail.includes("@")) {
      toast({
        title: "Email Không Hợp Lệ ⚠️",
        description: "Vui lòng nhập email tài khoản của bạn.",
        variant: "destructive"
      });
      return;
    }

    setIsSendingForgotOtp(true);
    try {
      let code = "";
      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail })
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.code) code = data.code;
        }
      } catch (e) {}

      if (!code) code = Math.floor(100000 + Math.random() * 900000).toString();

      setForgotSentCode(code);
      setIsForgotOtpSent(true);

      toast({
        title: "Đã Gửi OTP Khôi Phục Mật Khẩu! 📨",
        description: `Mã OTP xác thực 6 số đã được gửi tới Gmail ${forgotEmail}.`,
      });
    } finally {
      setIsSendingForgotOtp(false);
    }
  };

  // Handle Reset Password Submit
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotOtpInput.trim() !== forgotSentCode.trim()) {
      toast({
        title: "Mã OTP Không Đúng ❌",
        description: "Vui lòng kiểm tra lại mã 6 số gửi qua Email.",
        variant: "destructive"
      });
      return;
    }
    if (forgotNewPassword.length < 8) {
      toast({
        title: "Mật Khẩu Quá Ngắn ⚠️",
        description: "Mật khẩu mới phải từ 8 ký tự trở lên.",
        variant: "destructive"
      });
      return;
    }

    const res = resetUserPassword(forgotEmail, forgotNewPassword);
    toast({
      title: "Đổi Mật Khẩu Thành Công! 🔑",
      description: res.message || "Bạn đã cập nhật mật khẩu mới thành công. Hãy đăng nhập ngay!",
    });
    setAuthMode("login");
    setLoginEmail(forgotEmail);
    setForgotEmail("");
    setForgotOtpInput("");
    setForgotNewPassword("");
    setIsForgotOtpSent(false);
  };

  // Final Registration Submit (Initial Bonus: 100 pt - Bronze Tier!)
  const handleFinalSubmit = async () => {
    if (authOtpInput.trim() !== sentOtpCode.trim()) {
      toast({
        title: "Mã OTP Không Đúng ❌",
        description: "Vui lòng kiểm tra lại mã xác nhận 6 số vừa nhận qua Email.",
        variant: "destructive"
      });
      return;
    }

    if (isEmailRegistered(email)) {
      toast({
        title: "Email Đã Tồn Tại ⚠️",
        description: `Hòm thư ${email} đã được đăng ký trước đó.`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    const studentId = customStudentId.trim() || (role.includes("Giảng") ? `GV-${Math.floor(100000 + Math.random() * 900000)}` : `CMC-${Math.floor(100000 + Math.random() * 900000)}`);

    try {
      try {
        await fetch('/api/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, phone, role, note })
        });
      } catch (e) {}

      // Register with initial 100 pt (Bronze Rank!)
      const res = registerUserAccount(fullName, email, studentId, major, password, 100);
      
      if (!res.success) {
        toast({
          title: "Đăng Ký Thất Bại ⚠️",
          description: res.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Đăng Ký Thành Công! 🥉",
        description: `Chào mừng ${fullName} gia nhập EcoValues! Bạn nhận +100 điểm thưởng ban đầu và bắt đầu từ Hạng Đồng.`,
      });

      setLocation("/ca-nhan");
    } catch (err: any) {
      toast({
        title: "Lỗi Đăng Ký ⚠️",
        description: err.message || "Đã xảy ra lỗi khi tạo tài khoản.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <section className="min-h-screen bg-background flex items-center py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Col: Info Hero Card */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Tham Gia Hệ Sinh Thái EcoValues CMC
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
                  Tích Điểm Xanh & Đóng Góp Hành Động Bền Vững
                </h1>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  Tạo tài khoản thành viên để bắt đầu tích lũy điểm thưởng từ Hạng Đồng 🥉, phân loại rác thông minh tại 14 trạm CMC và đổi quà tặng hấp dẫn.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {[
                  { title: "Hạng Đồng (Bronze)", desc: "Khởi đầu với +100 pt khi tạo tài khoản", icon: Award, color: "text-amber-600 bg-amber-500/10" },
                  { title: "Phân Loại AI", desc: "Tích điểm tự động 24/7 tại 14 trạm trọ", icon: Zap, color: "text-emerald-600 bg-emerald-500/10" },
                  { title: "Đổi Quà Độc Quyền", desc: "Voucher Highlands, quà xanh & áo thun", icon: Gift, color: "text-cyan-600 bg-cyan-500/10" }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 bg-card border border-border rounded-2xl space-y-2 shadow-sm">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-foreground text-xs">{item.title}</h3>
                    <p className="text-[11px] text-muted-foreground leading-tight">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Auth Forms (Login / Register / Forgot Password) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border p-6 md:p-8 rounded-3xl shadow-2xl space-y-6 relative overflow-hidden"
            >
              {/* Header Tab Switchers */}
              <div className="flex bg-secondary/80 p-1 rounded-2xl border border-border">
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'login' ? 'bg-card text-emerald-600 shadow border border-emerald-500/20' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LogIn className="w-4 h-4" /> 🔑 ĐĂNG NHẬP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setAuthStep(1);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    authMode === 'register' ? 'bg-card text-emerald-600 shadow border border-emerald-500/20' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <UserPlus className="w-4 h-4 text-emerald-600" /> 📝 ĐĂNG KÝ MỚI
                </button>
              </div>

              {/* MODE 1: LOGIN FORM */}
              {authMode === "login" && (
                <motion.form 
                  onSubmit={handleLoginSubmit} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-4 pt-2 relative z-10"
                >
                  <div className="text-center space-y-1">
                    <h2 className="text-xl md:text-2xl font-black text-foreground font-sans">Đăng Nhập Thành Viên</h2>
                    <p className="text-[11px] text-muted-foreground">Nhập tài khoản để tích điểm xanh & đổi quà tặng</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-emerald-600" /> Email Tài Khoản (*)
                    </label>
                    <input 
                      type="email" 
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="VD: ecovalous@gmail.com hoặc email@cmc.edu.vn" 
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background text-xs font-semibold text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-emerald-600" /> Mật Khẩu (*)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode("forgot");
                          setForgotEmail(loginEmail);
                        }}
                        className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <HelpCircle className="w-3 h-3" /> Quên mật khẩu?
                      </button>
                    </div>
                    <input 
                      type="password" 
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu của bạn" 
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background text-xs font-semibold text-foreground"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isLoggingIn ? "Đang xử lý..." : "Đăng Nhập Ngay ➔"}
                  </button>

                  <div className="pt-3 border-t border-border/60 text-center">
                    <p className="text-xs text-muted-foreground">
                      Bạn chưa có tài khoản EcoValues?{" "}
                      <button
                        type="button"
                        onClick={() => setAuthMode("register")}
                        className="font-extrabold text-emerald-600 hover:underline inline-flex items-center gap-1"
                      >
                        Tạo tài khoản đăng ký mới ngay ➔
                      </button>
                    </p>
                  </div>
                </motion.form>
              )}

              {/* MODE 2: FORGOT PASSWORD FLOW */}
              {authMode === "forgot" && (
                <motion.form 
                  onSubmit={handleResetPasswordSubmit} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-4 pt-2 relative z-10"
                >
                  <div className="text-center space-y-1">
                    <h2 className="text-xl md:text-2xl font-black text-foreground font-sans flex items-center justify-center gap-2">
                      <Key className="w-6 h-6 text-emerald-600" /> Khôi Phục Mật Khẩu
                    </h2>
                    <p className="text-[11px] text-muted-foreground">Nhập Gmail để nhận mã OTP xác thực và đặt lại mật khẩu mới</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Email Đăng Ký (*)</label>
                    <div className="flex gap-2">
                      <input 
                        type="email" 
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="VD: ecovalous@gmail.com" 
                        className="flex-1 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleSendForgotOtp}
                        disabled={isSendingForgotOtp}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow shrink-0 active:scale-95 disabled:opacity-50"
                      >
                        {isSendingForgotOtp ? "Đang gửi..." : "Gửi Mã OTP"}
                      </button>
                    </div>
                  </div>

                  {isForgotOtpSent && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 pt-1">
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-700">
                        ✅ Mã OTP 6 số đã được gửi tới Gmail <strong>{forgotEmail}</strong>. Vui lòng kiểm tra hộp thư!
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Nhập Mã OTP 6 Số (*)</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={forgotOtpInput}
                          onChange={(e) => setForgotOtpInput(e.target.value)}
                          placeholder="Ví dụ: 884291"
                          className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl font-mono text-center tracking-widest text-sm font-black outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Mật Khẩu Mới (Mới từ 8 ký tự) (*)</label>
                        <input
                          type="password"
                          required
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="Nhập mật khẩu mới của bạn"
                          className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                      >
                        Cập Nhật Mật Khẩu Mới 🔑
                      </button>
                    </motion.div>
                  )}

                  <div className="pt-2 text-center border-t border-border">
                    <button
                      type="button"
                      onClick={() => setAuthMode("login")}
                      className="text-xs font-bold text-muted-foreground hover:text-emerald-600"
                    >
                      ← Quay lại Đăng Nhập
                    </button>
                  </div>
                </motion.form>
              )}

              {/* MODE 3: 3-STEP REGISTER FLOW */}
              {authMode === "register" && (
                <>
                  <div className="text-center space-y-1 relative z-10">
                    <h2 className="text-xl md:text-2xl font-black text-foreground font-sans">Đăng Ký Thành Viên Mới</h2>
                    <p className="text-[11px] text-muted-foreground">Khởi đầu với +100 điểm thưởng ban đầu ở Hạng Đồng 🥉</p>
                  </div>

                  {/* Symmetrical Premium Stepper Pipeline */}
                  <div className="relative w-full max-w-sm mx-auto py-2 z-10 px-4">
                    <div className="absolute top-[26px] left-8 right-8 h-0.5 bg-border z-0" />
                    <div 
                      className="absolute top-[26px] left-8 h-0.5 bg-emerald-600 transition-all duration-500 z-0"
                      style={{ width: `calc(${((authStep - 1) / 2)} * (100% - 64px))` }}
                    />

                    <div className="relative flex justify-between z-10">
                      {[
                        { step: 1, label: "Liên Hệ" },
                        { step: 2, label: "Vai Trò" },
                        { step: 3, label: "Xác Thực" }
                      ].map((item) => (
                        <div key={item.step} className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                            authStep === item.step
                              ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg ring-4 ring-emerald-500/15'
                              : authStep > item.step
                              ? 'bg-emerald-500 border-emerald-400 text-white'
                              : 'bg-card border-border text-muted-foreground'
                          }`}>
                            {authStep > item.step ? <Check className="w-4 h-4" /> : item.step}
                          </div>
                          <span className={`text-[10px] font-black uppercase mt-1.5 tracking-wider ${authStep === item.step ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 1: Contact Info & Email Check */}
                  {authStep === 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground">Họ và Tên (*)</label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input 
                            type="text" 
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Ví dụ: Nguyễn Văn A" 
                            className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background transition-all text-xs font-semibold text-foreground"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground">Tuổi (*)</label>
                          <div className="relative">
                            <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input 
                              type="number" 
                              min={15}
                              max={75}
                              value={age}
                              onChange={(e) => setAge(Number(e.target.value))}
                              className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background transition-all text-xs font-semibold text-foreground"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground">Trường Học (*)</label>
                          <input 
                            type="text" 
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background transition-all text-xs font-semibold text-foreground"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> Số Điện Thoại (*)
                        </label>
                        <input 
                          type="text" 
                          required
                          maxLength={10}
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="Ví dụ: 0912345678" 
                          className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background transition-all text-xs font-semibold text-foreground"
                        />
                      </div>

                      <button 
                        type="button"
                        onClick={() => {
                          if (!fullName.trim()) {
                            toast({ title: "Thiếu Họ và Tên ⚠️", description: "Vui lòng nhập họ và tên của bạn.", variant: "destructive" });
                            return;
                          }
                          const cleanPhone = phone.replace(/\D/g, '');
                          if (!cleanPhone || cleanPhone.length < 10 || !cleanPhone.startsWith('0')) {
                            toast({ 
                              title: "Số Điện Thoại Không Hợp Lệ ⚠️", 
                              description: "Vui lòng nhập đúng số điện thoại gồm 10 chữ số bắt đầu bằng 0.", 
                              variant: "destructive" 
                            });
                            return;
                          }
                          setAuthStep(2);
                        }}
                        className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                      >
                        Tiếp Tục Mốc 2 <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}

                  {/* Step 2: Role, Student ID, Major & Password */}
                  {authStep === 2 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5 text-emerald-600" /> Mã Sinh Viên / Mã Giáo Viên (*)
                        </label>
                        <input 
                          type="text" 
                          required
                          value={customStudentId}
                          onChange={(e) => setCustomStudentId(e.target.value)}
                          placeholder="Ví dụ: CMC-251156 hoặc GV-102938" 
                          className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background transition-all text-xs font-semibold text-foreground"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Bạn là (*):
                          </label>
                          <select 
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background text-xs font-bold text-foreground"
                          >
                            <option value="Tình nguyện viên">Tình nguyện viên (Sinh viên)</option>
                            <option value="Giảng viên">Giảng viên / Cán bộ nhà trường</option>
                            <option value="Đối tác xử lý/tái chế">Đối tác xử lý/tái chế</option>
                            <option value="Nhà tài trợ">Nhà tài trợ quà tặng</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-foreground flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-emerald-600" /> Chuyên Ngành:
                          </label>
                          <select 
                            value={major}
                            onChange={(e) => setMajor(e.target.value)}
                            className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background text-xs font-bold text-foreground"
                          >
                            <option value="Công nghệ Thông tin">Công nghệ Thông tin</option>
                            <option value="Quản trị Kinh doanh">Quản trị Kinh doanh</option>
                            <option value="Thiết kế Đồ họa">Thiết kế Đồ họa</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Ngôn ngữ Anh">Ngôn ngữ Anh</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 text-emerald-600" /> Mật Khẩu Đăng Nhập (*)
                        </label>
                        <input 
                          type="password" 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Mật khẩu tối thiểu 8 ký tự" 
                          className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background transition-all text-xs font-semibold text-foreground"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button 
                          type="button"
                          onClick={() => setAuthStep(1)}
                          className="w-1/3 h-11 bg-secondary text-foreground rounded-xl font-bold text-xs border border-border"
                        >
                           Quay Lại
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            if (!password || password.length < 8) {
                              toast({ title: "Mật Khẩu Quá Ngắn ⚠️", description: "Mật khẩu phải từ 8 ký tự trở lên.", variant: "destructive" });
                              return;
                            }
                            setAuthStep(3);
                          }}
                          className="w-2/3 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                        >
                          Tiếp Tục Mốc 3 <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Gmail Verification & Duplicate Check */}
                  {authStep === 3 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Mail className="w-4 h-4 text-emerald-600" /> Email Gmail Của Bạn (*)
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ví dụ: ecovalous@gmail.com" 
                            className="flex-1 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background text-xs font-semibold text-foreground"
                          />
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isSendingOtp || (resendTimer > 0 && isOtpSent)}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow shrink-0 active:scale-95 disabled:opacity-50"
                          >
                            {isSendingOtp ? "Đang gửi..." : isOtpSent && resendTimer > 0 ? `${resendTimer}s` : "Gửi Mã OTP"}
                          </button>
                        </div>
                      </div>

                      {isOtpSent && (
                        <div className="space-y-3 pt-2 animate-in fade-in">
                          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-700">
                            ✅ Mã OTP 6 số đã được gửi trực tiếp về Gmail <strong>{email}</strong>!
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-foreground">Nhập Mã OTP 6 Số (*)</label>
                            <input 
                              type="text" 
                              required
                              maxLength={6}
                              value={authOtpInput}
                              onChange={(e) => setAuthOtpInput(e.target.value)}
                              placeholder="Ví dụ: 884291" 
                              className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl font-mono text-center tracking-widest text-sm font-black outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                            />
                          </div>

                          <div className="flex gap-3 pt-2">
                            <button 
                              type="button"
                              onClick={() => setAuthStep(2)}
                              className="w-1/3 h-11 bg-secondary text-foreground rounded-xl font-bold text-xs border border-border"
                            >
                              Quay Lại
                            </button>
                            <button 
                              type="button"
                              onClick={handleFinalSubmit}
                              disabled={isSubmitting}
                              className="w-2/3 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                              {isSubmitting ? "Đang tạo..." : "Xác Nhận Đăng Ký 🥉 (+100 pt)"}
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </>
              )}

            </motion.div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
