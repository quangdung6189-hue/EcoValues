import { useState, useRef, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  User, 
  Award, 
  Calendar, 
  Wallet, 
  Gift, 
  Ticket, 
  Zap, 
  ShieldCheck, 
  KeyRound, 
  MapPin, 
  Bell, 
  HelpCircle, 
  Edit3, 
  CheckCircle2, 
  Copy, 
  ChevronRight, 
  Lock, 
  LogOut,
  Sparkles,
  Flame,
  Check,
  RotateCcw,
  Clock,
  ArrowUpRight,
  Upload,
  Camera,
  Crown,
  Trophy,
  Shield,
  Star,
  CheckCircle
} from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { user, isLoggedIn, updatePoints, logout, login } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    logout();
    toast({
      title: "Đã Đăng Xuất Thành Công! 🚪",
      description: "Tài khoản của bạn đã được đăng xuất an toàn.",
    });
    setLocation("/tham-gia?mode=login");
  };

  // Preset Avatar list
  const PRESET_AVATARS = [
    { id: 'av-1', name: '🌿 Mầm Xanh', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    { id: 'av-2', name: '🦊 Cáo Eco', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
    { id: 'av-3', name: '🦉 Cú Trí Tuệ', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
    { id: 'av-4', name: '🐼 Gấu Trúc', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
    { id: 'av-5', name: '🐬 Cá Heo', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' }
  ];

  // Custom Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string>(
    localStorage.getItem("user_avatar_custom") || PRESET_AVATARS[0].url
  );

  // Avatar & Profile edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || "Đặng Quang Dũng");
  const [editStudentId, setEditStudentId] = useState(user?.studentId || "CMC-251156");

  // Keep form in sync when logged in user changes
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditStudentId(user.studentId);
    }
  }, [user]);

  // Rank Progress Roadmap Modal
  const [showRankModal, setShowRankModal] = useState(false);

  // Daily Check-in state
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [checkInStreak, setCheckInStreak] = useState(4);

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<"wallet" | "vouchers" | "privileges" | "security">("wallet");

  // History modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Security Change Password state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Address State
  const [address, setAddress] = useState("Ký túc xá CMC, Số 84 Duy Tân, Cầu Giấy, Hà Nội");
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  // Notification Toggles
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);

  // Require Login Guard Screen
  if (!isLoggedIn || !user) {
    return (
      <MainLayout>
        <div className="min-h-[85vh] flex items-center justify-center p-4 bg-background">
          <div className="bg-card border border-border p-8 rounded-3xl max-w-md w-full text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
              <Lock className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground">Yêu Cầu Đăng Nhập</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bạn chưa đăng nhập tài khoản EcoValues. Vui lòng đăng nhập hoặc tạo tài khoản mới để xem trang cá nhân, ví điểm thưởng và bảng tiến trình thăng cấp.
              </p>
            </div>
            <Link
              href="/tham-gia?mode=login"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg inline-block transition-all active:scale-95"
            >
              🔑 Đăng Nhập / Đăng Ký Ngay ➔
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const currentUser = user;

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Quá Lớn ⚠️",
          description: "Vui lòng chọn ảnh dung lượng dưới 5MB.",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarUrl(result);
        localStorage.setItem("user_avatar_custom", result);
        toast({
          title: "Đã Tải Ảnh Đại Diện Mới! 📸",
          description: "Ảnh của bạn đã được cập nhật thành công.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Preset Avatar
  const handleSelectPresetAvatar = (url: string) => {
    setAvatarUrl(url);
    localStorage.setItem("user_avatar_custom", url);
    toast({
      title: "Đã Đổi Avatar Mới! ✨",
      description: "Ảnh đại diện Eco-Avatar đã được cập nhật.",
    });
  };

  // Daily Check-in Action
  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) {
      toast({
        title: "Đã Điểm Danh Hôm Nay 📅",
        description: "Bạn đã nhận phần thưởng điểm danh hôm nay rồi. Hãy quay lại vào ngày mai nhé!",
      });
      return;
    }
    setHasCheckedInToday(true);
    setCheckInStreak(prev => prev + 1);
    updatePoints(currentUser.points + 50);
    toast({
      title: "Điểm Danh Thành Công! 🎉",
      description: "Bạn vừa nhận +50 điểm xanh hôm nay. Chuỗi điểm danh: 5 ngày liên tiếp 🔥",
    });
  };

  // Copy voucher code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Đã Sao Chép Mã! 📋",
      description: `Mã ${code} đã được lưu vào khay nhớ tạm.`,
    });
  };

  // Handle Change Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      toast({ title: "Thiếu mật khẩu cũ", description: "Vui lòng nhập mật khẩu hiện tại.", variant: "destructive" });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: "Mật khẩu mới quá ngắn", description: "Mật khẩu mới phải từ 8 ký tự trở lên.", variant: "destructive" });
      return;
    }
    setShowChangePasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    toast({
      title: "Đổi Mật Khẩu Thành Công! 🔑",
      description: "Mật khẩu tài khoản của bạn đã được cập nhật an toàn.",
    });
  };

  // Saved Vouchers List
  const myVouchers = [
    { id: 1, title: "Voucher Căng tin CMC 50.000đ", code: "ECO-CMC-8832", expiry: "30/08/2026", points: 300, icon: Gift },
    { id: 2, title: "Bình Giữ Nhiệt EcoValues Stainless", code: "ECO-CMC-1092", expiry: "15/09/2026", points: 500, icon: Sparkles },
    { id: 3, title: "Voucher Highlands Coffee 30.000đ", code: "ECO-CMC-5541", expiry: "20/08/2026", points: 250, icon: Ticket }
  ];

  // Point Transactions History
  const pointTransactions = [
    { id: 1, type: "plus", title: "Điểm danh hàng ngày", date: "Hôm nay, 08:30", points: "+50 pt" },
    { id: 2, type: "plus", title: "Thu gom 5 Chai nhựa PET", date: "28/07/2026", points: "+250 pt" },
    { id: 3, type: "minus", title: "Đổi Voucher Căng tin CMC 50k", date: "25/07/2026", points: "-300 pt" },
    { id: 4, type: "plus", title: "Thưởng chuỗi 7 ngày xanh", date: "20/07/2026", points: "+150 pt" },
  ];

  // Membership Tiers Roadmap Data
  const TIERS = [
    {
      name: "Đồng (Bronze)",
      minPoints: 0,
      maxPoints: 499,
      icon: "🥉",
      color: "from-amber-700 to-amber-900",
      perks: ["Tích điểm chuẩn 1X", "Đổi voucher quà tặng cơ bản"]
    },
    {
      name: "Bạc (Silver)",
      minPoints: 500,
      maxPoints: 999,
      icon: "🥈",
      color: "from-slate-400 to-slate-600",
      perks: ["Tích điểm +10%", "Giảm 5% giá đổi quà tặng", "Huy hiệu Bạc sinh thái"]
    },
    {
      name: "Vàng (Gold)",
      minPoints: 1000,
      maxPoints: 1499,
      icon: "🥇",
      color: "from-amber-400 to-yellow-600",
      isCurrent: true,
      perks: ["Tích điểm +20%", "Nhận Giấy chứng nhận Tình nguyện viên", "Đổi bình nước tre Eco cao cấp"]
    },
    {
      name: "Kim Cương (Diamond)",
      minPoints: 1500,
      maxPoints: 2999,
      icon: "💎",
      color: "from-cyan-400 to-emerald-600",
      isNext: true,
      perks: ["X2 Điểm thưởng thu gom", "Miễn phí ship quà tặng tận nơi", "Thiệp & quà sinh nhật Đại sứ"]
    },
    {
      name: "Huyền Thoại (Legend)",
      minPoints: 3000,
      maxPoints: 99999,
      icon: "👑",
      color: "from-purple-500 to-indigo-700",
      perks: ["Huy hiệu Vàng vĩnh viễn", "Vé mời VIP Gala Đại sứ Xanh", "Vinh danh Top 10 Campus CMC"]
    }
  ];

  return (
    <MainLayout>
      <div className="bg-background min-h-screen pb-24">
        
        {/* Hidden File Input for Avatar Upload */}
        <input 
          type="file" 
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />

        {/* Header Profile Hero Banner */}
        <section className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-background pt-28 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
          
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="bg-card/90 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              
              {/* Profile Main Info Bar */}
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                
                {/* Left: Avatar & Name */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 p-1 shadow-xl relative overflow-hidden">
                      <img 
                        src={avatarUrl} 
                        alt="User Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEditModal(true);
                      }}
                      title="Đổi Avatar hoặc Chỉnh sửa hồ sơ"
                      className="absolute bottom-0 right-0 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg border-2 border-card transition-all active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-2xl md:text-3xl font-black text-foreground">{currentUser.name}</h1>
                      <button 
                        onClick={() => setShowRankModal(true)}
                        className="px-3 py-1 rounded-full text-xs font-black bg-amber-400/20 hover:bg-amber-400/30 text-amber-600 border border-amber-400/30 flex items-center gap-1 transition-all shadow-sm active:scale-95"
                      >
                        <Award className="w-3.5 h-3.5 text-amber-500" /> Hội Viên Hạng Vàng 🥇
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground font-semibold">
                      Mã SV: <strong className="text-foreground">{currentUser.studentId}</strong> | Chuyên ngành: <strong className="text-foreground">{currentUser.major}</strong>
                    </p>
                    <p className="text-xs text-emerald-600 font-bold flex items-center justify-center sm:justify-start gap-1 pt-0.5">
                      ♻️ Đã đóng góp: <span className="underline">45.2 kg rác AI</span> (142 chai nhựa & carton)
                    </p>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold rounded-2xl border border-border flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-600" /> Chỉnh Sửa Hồ Sơ
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-bold rounded-2xl border border-rose-500/20 flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <LogOut className="w-4 h-4" /> Đăng Xuất
                  </button>
                </div>
              </div>

              {/* Dynamic Rank Progress Bar (Clickable to view detailed roadmap) */}
              {(() => {
                const pts = currentUser.points;
                let currentRankName = "Đồng 🥉";
                let nextRankName = "Bạc 🥈";
                let targetPts = 500;
                let progress = Math.min(100, Math.round((pts / 500) * 100));
                let needed = Math.max(0, 500 - pts);

                if (pts >= 3000) {
                  currentRankName = "Huyền Thoại 👑";
                  nextRankName = "Cấp Tối Đa ✨";
                  targetPts = pts;
                  progress = 100;
                  needed = 0;
                } else if (pts >= 1500) {
                  currentRankName = "Kim Cương 💎";
                  nextRankName = "Huyền Thoại 👑";
                  targetPts = 3000;
                  progress = Math.min(100, Math.round(((pts - 1500) / 1500) * 100));
                  needed = 3000 - pts;
                } else if (pts >= 1000) {
                  currentRankName = "Vàng 🥇";
                  nextRankName = "Kim Cương 💎";
                  targetPts = 1500;
                  progress = Math.min(100, Math.round(((pts - 1000) / 500) * 100));
                  needed = 1500 - pts;
                } else if (pts >= 500) {
                  currentRankName = "Bạc 🥈";
                  nextRankName = "Vàng 🥇";
                  targetPts = 1000;
                  progress = Math.min(100, Math.round(((pts - 500) / 500) * 100));
                  needed = 1000 - pts;
                }

                return (
                  <div 
                    onClick={() => setShowRankModal(true)}
                    className="pt-4 border-t border-border/60 space-y-2 cursor-pointer group hover:bg-secondary/30 p-2.5 rounded-2xl transition-all"
                    title="Nhấp để xem lộ trình thăng cấp chi tiết"
                  >
                    <div className="flex justify-between items-center text-xs font-extrabold">
                      <span className="text-foreground flex items-center gap-1.5 group-hover:text-emerald-600 transition-colors">
                        <Zap className="w-4 h-4 text-amber-500 animate-pulse" /> Hạng Hiện Tại: <strong className="text-emerald-600 text-sm font-black">{currentRankName}</strong> ({progress}%)
                      </span>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
                        {pts.toLocaleString()} / {targetPts.toLocaleString()} pt ➔ <strong className="text-cyan-600 font-bold">{nextRankName}</strong>
                        <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                    <div className="h-3 w-full bg-secondary rounded-full overflow-hidden p-0.5 border border-border">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1 }}
                        className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full shadow-md"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        👆 Nhấp vào thanh để xem bảng đặc quyền 5 cấp độ
                      </span>
                      <p className="text-muted-foreground font-medium">
                        {needed > 0 ? (
                          <>💡 Tích thêm <strong className="text-emerald-600">+{needed.toLocaleString()} pt</strong> nữa để lên Hạng {nextRankName}!</>
                        ) : (
                          <>🎉 Bạn đã đạt cấp độ thăng hạng tối đa!</>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })()}

            </div>
          </div>
        </section>

        {/* Main Content Sections */}
        <section className="py-10 container mx-auto px-4 max-w-5xl space-y-8">
          
          {/* 📅 SECTION 1: ĐIỂM DANH HÀNG NGÀY */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-600" /> Điểm Danh Hàng Ngày Nhận Quà 📅
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Điểm danh mỗi ngày để tích điểm thưởng và duy trì chuỗi điểm danh xanh
                </p>
              </div>

              <button
                onClick={handleDailyCheckIn}
                disabled={hasCheckedInToday}
                className={`px-6 py-3 rounded-2xl font-black text-xs transition-all shadow-lg flex items-center gap-2 ${
                  hasCheckedInToday 
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30' 
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                }`}
              >
                {hasCheckedInToday ? (
                  <> <CheckCircle2 className="w-4 h-4" /> Đã Điểm Danh Hôm Nay (+50 pt) </>
                ) : (
                  <> <Flame className="w-4 h-4 text-amber-300 animate-bounce" /> Nhận +50 Điểm Hôm Nay! </>
                )}
              </button>
            </div>

            {/* 7 Days Streak Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 md:gap-4 pt-2">
              {[
                { day: "T2", pts: "+50", done: true },
                { day: "T3", pts: "+50", done: true },
                { day: "T4", pts: "+50", done: true },
                { day: "T5", pts: "+50", done: true },
                { day: "T6 (Hôm nay)", pts: "+50", current: true, done: hasCheckedInToday },
                { day: "T7", pts: "+50", done: false },
                { day: "CN 🎉", pts: "+100", done: false, bonus: true },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between gap-2 transition-all ${
                    item.done
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600'
                      : item.current
                      ? 'bg-amber-500/10 border-amber-500/50 text-amber-600 ring-2 ring-amber-500/20'
                      : 'bg-secondary/40 border-border text-muted-foreground'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase">{item.day}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs">
                    {item.done ? (
                      <Check className="w-5 h-5 text-emerald-600" />
                    ) : item.bonus ? (
                      <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                    ) : (
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-xs font-mono font-black">{item.pts}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 🪪 SECTION 2: SUB-TABS (VÍ ĐIỂM, QUÀ TẶNG, ĐẶC QUYỀN, CÀI ĐẶT) */}
          <div className="space-y-6">
            
            {/* Sub-tabs header */}
            <div className="flex bg-secondary/80 p-1.5 rounded-2xl border border-border overflow-x-auto">
              {[
                { id: "wallet", label: "Ví Điểm Thưởng", icon: Wallet },
                { id: "vouchers", label: "Quà Của Tôi (3)", icon: Gift },
                { id: "privileges", label: "Đặc Quyền Hội Viên", icon: Award },
                { id: "security", label: "Cài Đặt & Bảo Mật", icon: ShieldCheck }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-card text-emerald-600 shadow border border-emerald-500/20'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENT: VÍ ĐIỂM THƯỞNG */}
            {activeTab === "wallet" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none" />
                  
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Số Dư Điểm Khả Dụng</span>
                    <h3 className="text-4xl font-black font-mono tracking-tight">{currentUser.points.toLocaleString()} pt</h3>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-emerald-100 font-medium">Hội viên hạng Vàng (Giảm 5% giá đổi voucher)</p>
                    <div className="flex gap-2">
                      <Link 
                        href="/tich-diem" 
                        className="flex-1 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs rounded-xl text-center shadow transition-all"
                      >
                        Đổi Quà Ngay 🎁
                      </Link>
                      <button 
                        onClick={() => setShowHistoryModal(true)}
                        className="px-3 py-2.5 bg-emerald-700/60 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
                      >
                        Lịch Sử
                      </button>
                    </div>
                  </div>
                </div>

                {/* Point History Snippet */}
                <div className="md:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h4 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" /> Biến Động Điểm Mới Nhất
                    </h4>
                    <button 
                      onClick={() => setShowHistoryModal(true)}
                      className="text-xs font-bold text-emerald-600 hover:underline"
                    >
                      Xem tất cả ➔
                    </button>
                  </div>

                  <div className="space-y-3">
                    {pointTransactions.map((t) => (
                      <div key={t.id} className="p-3 bg-secondary/50 rounded-2xl flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground">{t.title}</p>
                          <p className="text-[10px] text-muted-foreground">{t.date}</p>
                        </div>
                        <span className={`font-mono font-black ${t.type === 'plus' ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {t.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB CONTENT: QUÀ CỦA TÔI */}
            {activeTab === "vouchers" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {myVouchers.map((v) => (
                  <div key={v.id} className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <v.icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-foreground text-sm leading-snug">{v.title}</h4>
                      <p className="text-xs text-muted-foreground">Hạn sử dụng: <strong className="text-foreground">{v.expiry}</strong></p>
                    </div>

                    <div className="p-3 bg-secondary/80 border border-border rounded-2xl flex items-center justify-between pt-2">
                      <span className="font-mono font-black text-xs tracking-wider text-emerald-700">{v.code}</span>
                      <button
                        onClick={() => handleCopyCode(v.code)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* TAB CONTENT: ĐẶC QUYỀN HỘI VIÊN */}
            {activeTab === "privileges" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg font-black text-foreground">Bảng Đặc Quyền Hạng Vàng 🥇</h3>
                    <p className="text-xs text-muted-foreground">Các ưu đãi bạn đang được hưởng trên toàn hệ sinh thái CMC</p>
                  </div>
                  <button 
                    onClick={() => setShowRankModal(true)}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-sm"
                  >
                    Xem Tất Cả 5 Cấp Độ ➔
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "+20% Điểm Thu Gom", desc: "Tăng 20% số điểm thưởng nhận được khi phân loại rác tại trạm.", icon: Zap },
                    { title: "Đổi Quà Độc Quyền", desc: "Được quyền đổi các sản phẩm quà tặng giới hạn như Bình nước tre Eco.", icon: Gift },
                    { title: "Giấy Chứng Nhận Xanh", desc: "Cấp chứng nhận thành viên tích cực đóng góp hoạt động cộng đồng.", icon: Award }
                  ].map((p, idx) => (
                    <div key={idx} className="p-4 bg-secondary/50 border border-border rounded-2xl space-y-2">
                      <p.icon className="w-6 h-6 text-emerald-600" />
                      <h4 className="font-bold text-foreground text-sm">{p.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT: CÀI ĐẶT BẢO MẬT */}
            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                
                {/* Security Password */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-emerald-600" /> Đổi Mật Khẩu Đăng Nhập
                    </h4>
                    <p className="text-xs text-muted-foreground">Mật khẩu được mã hóa an toàn đạt chuẩn bảo mật EcoValues</p>
                  </div>
                  <button
                    onClick={() => setShowChangePasswordModal(true)}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold rounded-xl border border-border"
                  >
                    Đổi Mật Khẩu
                  </button>
                </div>

                {/* Shipping Address */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600" /> Địa Chỉ Nhận Quà Tận Nơi
                    </h4>
                    {isEditingAddress ? (
                      <input 
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full md:w-96 px-3 py-1.5 bg-background border border-border rounded-xl text-xs font-semibold text-foreground outline-none"
                      />
                    ) : (
                      <p className="text-xs text-muted-foreground">{address}</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (isEditingAddress) {
                        toast({ title: "Đã Lưu Địa Chỉ!", description: "Địa chỉ nhận quà mới đã được lưu." });
                      }
                      setIsEditingAddress(!isEditingAddress);
                    }}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold rounded-xl border border-border shrink-0"
                  >
                    {isEditingAddress ? "Lưu" : "Sửa Địa Chỉ"}
                  </button>
                </div>

                {/* Notifications */}
                <div className="space-y-3">
                  <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" /> Cài Đặt Thông Báo
                  </h4>
                  <div className="flex items-center justify-between text-xs p-3 bg-secondary/50 rounded-2xl">
                    <span>Nhận thông báo sự kiện đổi quà qua Gmail ({currentUser.email})</span>
                    <input 
                      type="checkbox" 
                      checked={notifEmail} 
                      onChange={(e) => setNotifEmail(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 cursor-pointer"
                    />
                  </div>
                </div>

              </motion.div>
            )}

          </div>

        </section>

        {/* Modal 1: Edit Profile & Change Avatar Modal */}
        <AnimatePresence>
          {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-emerald-600" /> Chỉnh Sửa Hồ Sơ & Avatar
                  </h3>
                  <button onClick={() => setShowEditModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">Đóng ✖</button>
                </div>

                {/* Avatar Change Section */}
                <div className="space-y-3 bg-secondary/40 p-4 rounded-2xl border border-border">
                  <label className="block text-xs font-bold text-foreground">Ảnh Đại Diện (Avatar)</label>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 overflow-hidden shrink-0">
                      <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all active:scale-95"
                      >
                        <Upload className="w-3.5 h-3.5" /> Tải Ảnh Từ Máy (.jpg, .png)
                      </button>
                      <p className="text-[10px] text-muted-foreground">Chấp nhận ảnh dung lượng dưới 5MB</p>
                    </div>
                  </div>

                  {/* Preset Eco Avatars */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-muted-foreground block mb-2">Hoặc chọn Avatar Bộ sưu tập Eco:</span>
                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                      {PRESET_AVATARS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectPresetAvatar(item.url)}
                          className={`w-12 h-12 rounded-full border-2 overflow-hidden shrink-0 transition-all hover:scale-105 ${
                            avatarUrl === item.url ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-border'
                          }`}
                          title={item.name}
                        >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form edit name & student ID */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Họ và Tên Hiển Thị (*)</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Mã Sinh Viên / Thẻ Hội Viên (*)</label>
                    <input
                      type="text"
                      value={editStudentId}
                      onChange={(e) => setEditStudentId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 py-2.5 bg-secondary text-foreground font-bold rounded-xl text-xs border border-border"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => {
                      login(editName, currentUser.email, editStudentId, currentUser.major, currentUser.points);
                      setShowEditModal(false);
                      toast({ title: "Đã Cập Nhật Hồ Sơ!", description: "Thông tin hồ sơ và ảnh đại diện của bạn đã được lưu thành công." });
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 shadow-md active:scale-95"
                  >
                    Lưu Thay Đổi
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal 2: Detailed Rank Progress & Roadmap Modal */}
        <AnimatePresence>
          {showRankModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 md:p-8 rounded-3xl max-w-xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" /> Bảng Tiến Trình Thăng Cấp
                    </h3>
                    <p className="text-xs text-muted-foreground">Lộ trình 5 cấp bậc hội viên & đặc quyền tích điểm</p>
                  </div>
                  <button onClick={() => setShowRankModal(false)} className="text-xs font-bold text-muted-foreground hover:text-foreground">Đóng ✖</button>
                </div>

                {/* Current User Rank Status Banner */}
                <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl space-y-3 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-100">Hạng Hiện Tại Của Bạn</span>
                    <span className="px-3 py-1 bg-amber-400 text-amber-950 text-xs font-black rounded-full shadow">🥇 HỘI VIÊN HẠNG VÀNG</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Tiến trình lên Kim Cương: 83%</span>
                      <span className="font-mono">1,250 / 1,500 pt</span>
                    </div>
                    <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden p-0.5">
                      <div className="h-full bg-white rounded-full w-[83%]" />
                    </div>
                  </div>
                  
                  <p className="text-[11px] text-emerald-100 font-medium">
                    ⚡ Bạn chỉ cần tích thêm <strong className="text-white underline">+250 pt</strong> để mở khóa Hạng Kim Cương & X2 Điểm Thưởng!
                  </p>
                </div>

                {/* 5 Tiers Detailed Roadmap List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Chi Tiết 5 Cấp Bậc & Đặc Quyền:</h4>

                  {TIERS.map((tier, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-2xl border transition-all ${
                        tier.isCurrent
                          ? 'bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/20'
                          : tier.isNext
                          ? 'bg-emerald-500/10 border-emerald-500/40'
                          : 'bg-secondary/40 border-border opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{tier.icon}</span>
                          <span className="font-black text-sm text-foreground">{tier.name}</span>
                          {tier.isCurrent && (
                            <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-black rounded-md">
                              HẠNG HIỆN TẠI
                            </span>
                          )}
                          {tier.isNext && (
                            <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-md animate-pulse">
                              MỤC TIÊU TIẾP THEO
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-xs font-extrabold text-muted-foreground">
                          {tier.minPoints.toLocaleString()} - {tier.maxPoints > 50000 ? "Không giới hạn" : tier.maxPoints.toLocaleString()} pt
                        </span>
                      </div>

                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-muted-foreground pt-1">
                        {tier.perks.map((perk, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-1.5 font-medium">
                            <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${tier.isCurrent ? 'text-amber-500' : 'text-emerald-600'}`} />
                            {perk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setShowRankModal(false)}
                    className="flex-1 py-2.5 bg-secondary text-foreground font-bold rounded-xl text-xs border border-border"
                  >
                    Đóng Bảng
                  </button>
                  <Link
                    href="/tich-diem"
                    onClick={() => setShowRankModal(false)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs text-center shadow-md flex items-center justify-center gap-1 active:scale-95"
                  >
                    Tích Điểm Ngay ➔
                  </Link>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal 3: Point History Dialog */}
        <AnimatePresence>
          {showHistoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" /> Lịch Sử Tích Điểm
                  </h3>
                  <button onClick={() => setShowHistoryModal(false)} className="text-xs font-bold text-muted-foreground">Đóng</button>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {pointTransactions.map((t) => (
                    <div key={t.id} className="p-3 bg-secondary/50 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-foreground">{t.title}</p>
                        <p className="text-[10px] text-muted-foreground">{t.date}</p>
                      </div>
                      <span className={`font-mono font-black ${t.type === 'plus' ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {t.points}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal 4: Change Password Modal */}
        <AnimatePresence>
          {showChangePasswordModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4"
              >
                <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-emerald-600" /> Đổi Mật Khẩu Bảo Mật
                </h3>

                <form onSubmit={handleChangePassword} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Mật khẩu hiện tại (*)</label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Mật khẩu mới (*)</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Tối thiểu 8 ký tự (VD: Eco2026@)"
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-xs font-semibold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowChangePasswordModal(false)}
                      className="flex-1 py-2.5 bg-secondary text-foreground font-bold rounded-xl text-xs border border-border"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 shadow-md"
                    >
                      Cập Nhật Mật Khẩu
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </MainLayout>
  );
}
