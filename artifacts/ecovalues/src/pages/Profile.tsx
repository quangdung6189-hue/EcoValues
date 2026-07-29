import { useState } from "react";
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
  ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, isLoggedIn, updatePoints, logout } = useAuth();
  const { toast } = useToast();

  // Avatar & Profile edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.name || "Nguyễn Văn A");
  const [editStudentId, setEditStudentId] = useState(user?.studentId || "CMC-125323");

  // Daily Check-in state
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [checkInStreak, setCheckInStreak] = useState(4); // 4 days streak

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

  // Default fallback user if not logged in
  const currentUser = user || {
    name: "Nguyễn Văn A",
    email: "nguyenvana@cmc.edu.vn",
    studentId: "CMC-125323",
    major: "Công nghệ Thông tin",
    points: 1250,
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

  return (
    <MainLayout>
      <div className="bg-background min-h-screen pb-24">
        
        {/* Header Profile Hero Banner */}
        <section className="bg-gradient-to-b from-emerald-900 via-emerald-800 to-background pt-28 pb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
          
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="bg-card/90 backdrop-blur-md border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
              
              {/* Profile Main Info Bar */}
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                
                {/* Left: Avatar & Name */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-700 p-1 shadow-xl">
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                        <User className="w-12 h-12 text-emerald-600" />
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEditModal(true)}
                      title="Chỉnh sửa thông tin"
                      className="absolute bottom-0 right-0 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg border-2 border-card transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <h1 className="text-2xl md:text-3xl font-black text-foreground">{currentUser.name}</h1>
                      <span className="px-3 py-0.5 rounded-full text-xs font-black bg-amber-400/20 text-amber-600 border border-amber-400/30 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" /> Hội Viên Hạng Vàng 🥇
                      </span>
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
                    className="px-4 py-2.5 bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold rounded-2xl border border-border flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-4 h-4 text-emerald-600" /> Chỉnh Sửa Hồ Sơ
                  </button>
                  <button
                    onClick={logout}
                    className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 text-xs font-bold rounded-2xl border border-rose-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <LogOut className="w-4 h-4" /> Đăng Xuất
                  </button>
                </div>
              </div>

              {/* Progress Bar: Up Cấp Kim Cương */}
              <div className="pt-4 border-t border-border/60 space-y-2">
                <div className="flex justify-between items-center text-xs font-extrabold">
                  <span className="text-foreground flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" /> Tiến Trình Up Cấp: <strong className="text-emerald-600">83%</strong>
                  </span>
                  <span className="text-muted-foreground">
                    1,250 / 1,500 pt ➔ <strong className="text-cyan-600">Kim Cương 💎</strong>
                  </span>
                </div>
                <div className="h-3 w-full bg-secondary rounded-full overflow-hidden p-0.5 border border-border">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '83%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full shadow-md"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground font-medium text-right">
                  💡 Tích thêm <strong className="text-emerald-600">+250 pt</strong> nữa để lên Hạng Kim Cương & X2 Điểm thưởng!
                </p>
              </div>

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
            <div className="grid grid-cols-7 gap-2.5 text-center">
              {[
                { day: "T2", pt: 20, done: true },
                { day: "T3", pt: 20, done: true },
                { day: "T4", pt: 20, done: true },
                { day: "T5", pt: 20, done: true },
                { day: "T6 (Hôm nay)", pt: 50, done: hasCheckedInToday, active: true },
                { day: "T7", pt: 30, done: false },
                { day: "CN", pt: 100, done: false, bonus: true }
              ].map((item, i) => (
                <div 
                  key={i}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-between gap-1 transition-all ${
                    item.done 
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700' 
                      : item.active 
                      ? 'bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/30' 
                      : 'bg-secondary/40 border-border opacity-60'
                  }`}
                >
                  <span className="text-[11px] font-bold">{item.day}</span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs my-1 ${
                    item.done ? 'bg-emerald-500 text-white' : item.bonus ? 'bg-amber-400 text-amber-950 font-extrabold' : 'bg-secondary text-muted-foreground'
                  }`}>
                    {item.done ? <Check className="w-4 h-4" /> : `+${item.pt}`}
                  </div>
                  <span className="text-[10px] font-mono font-bold">
                    {item.done ? 'Đã nhận' : item.bonus ? '🎁 Quà Khúc' : `+${item.pt}pt`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 🪙 SECTION 2: VÍ ĐIỂM THƯỞNG */}
          <div className="bg-gradient-to-br from-emerald-900/40 via-card to-card border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-4 h-4 text-emerald-600" /> Ví Điểm Thưởng Khả Dụng
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl md:text-5xl font-black font-mono text-emerald-600">{currentUser.points}</span>
                  <span className="text-lg font-bold text-muted-foreground">điểm xanh</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/tich-diem"
                  className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Gift className="w-4 h-4" /> Đổi Quà Ngay
                </Link>
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="flex-1 sm:flex-none px-5 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-2xl text-xs border border-border transition-all flex items-center justify-center gap-1.5"
                >
                  <Clock className="w-4 h-4 text-emerald-600" /> Lịch Sử Điểm
                </button>
              </div>
            </div>
          </div>

          {/* 🌟 SECTION 3: ĐẶC QUYỀN HỘI VIÊN & QUÀ CỦA TÔI */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" /> Đặc Quyền Hội Viên & Quà Của Tôi
              </h2>
              
              {/* Tabs selector */}
              <div className="flex bg-secondary p-1 rounded-2xl border border-border">
                <button
                  onClick={() => setActiveTab("vouchers")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "vouchers" ? "bg-card text-emerald-600 shadow" : "text-muted-foreground"
                  }`}
                >
                  🎟️ Quà Của Tôi ({myVouchers.length})
                </button>
                <button
                  onClick={() => setActiveTab("privileges")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === "privileges" ? "bg-card text-amber-600 shadow" : "text-muted-foreground"
                  }`}
                >
                  ⚡ Đặc Quyền Hạng Vàng
                </button>
              </div>
            </div>

            {/* Tab 1: My Saved Vouchers */}
            {activeTab === "vouchers" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {myVouchers.map((v) => (
                  <div key={v.id} className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-3 relative group hover:border-emerald-500/40 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <v.icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                        HSD: {v.expiry}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-foreground text-sm line-clamp-1">{v.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Đã dùng: {v.points} pt</p>
                    </div>

                    <div className="p-2.5 bg-background border border-border rounded-xl flex items-center justify-between font-mono text-xs">
                      <span className="font-black text-emerald-600">{v.code}</span>
                      <button
                        onClick={() => handleCopyCode(v.code)}
                        className="text-muted-foreground hover:text-foreground text-[10px] font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Coppy
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Gold Tier Privileges */}
            {activeTab === "privileges" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-amber-950 flex items-center justify-center font-black">
                    1.5x
                  </div>
                  <h4 className="font-bold text-foreground text-sm">X1.5 Điểm Thưởng Tích Lũy</h4>
                  <p className="text-xs text-muted-foreground">Nhận 1.5 lần điểm thưởng cho mọi lượt phân loại rác AI tại trạm.</p>
                </div>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
                    🎁
                  </div>
                  <h4 className="font-bold text-foreground text-sm">Voucher Sinh Nhật 100.000đ</h4>
                  <p className="text-xs text-muted-foreground">Tặng ngay voucher quà tặng 100k vào tháng sinh nhật của bạn.</p>
                </div>

                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center font-black">
                    ⚡
                  </div>
                  <h4 className="font-bold text-foreground text-sm">Ưu Tiên Đổi Quà Sinh Thái</h4>
                  <p className="text-xs text-muted-foreground">Đặc quyền đặt trước bình nước EcoValues & túi canvas giới hạn.</p>
                </div>
              </div>
            )}
          </div>

          {/* ⚙️ SECTION 4: CÀI ĐẶT & BẢO MẬT */}
          <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-foreground flex items-center gap-2 border-b border-border pb-4">
              <ShieldCheck className="w-6 h-6 text-emerald-600" /> Cài Đặt & Bảo Mật Tài Khoản
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* 🔑 Item 1: Đổi mật khẩu */}
              <div 
                onClick={() => setShowChangePasswordModal(true)}
                className="p-4 bg-secondary/40 hover:bg-secondary/80 border border-border rounded-2xl flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm group-hover:text-emerald-600 transition-colors">🔑 Đổi Mật Khẩu Tài Khoản</h4>
                    <p className="text-xs text-muted-foreground">Cập nhật mật khẩu bảo mật 2 lớp</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>

              {/* 📍 Item 2: Địa chỉ nhận quà */}
              <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm">📍 Địa Chỉ Nhận Quà</h4>
                      <p className="text-xs text-muted-foreground">Địa chỉ giao quà tặng trực tiếp</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-xs font-bold text-emerald-600 hover:underline"
                  >
                    {isEditingAddress ? "Lưu" : "Sửa"}
                  </button>
                </div>

                {isEditingAddress ? (
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-xs font-medium text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ) : (
                  <p className="text-xs font-semibold text-foreground bg-background p-2.5 rounded-xl border border-border/60">
                    {address}
                  </p>
                )}
              </div>

              {/* 🔔 Item 3: Thông báo */}
              <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">🔔 Cài Đặt Thông Báo</h4>
                    <p className="text-xs text-muted-foreground">Tùy chọn nhận email & cảnh báo trạm</p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="flex items-center justify-between text-xs font-medium cursor-pointer">
                    <span>Email thông báo tích điểm & quà</span>
                    <input
                      type="checkbox"
                      checked={notifEmail}
                      onChange={(e) => setNotifEmail(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs font-medium cursor-pointer">
                    <span>Cảnh báo trạm AI sắp đầy (trên 85%)</span>
                    <input
                      type="checkbox"
                      checked={notifPush}
                      onChange={(e) => setNotifPush(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* ❓ Item 4: Hỗ trợ & Trợ giúp */}
              <div className="p-4 bg-secondary/40 border border-border rounded-2xl flex items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">❓ Hỗ Trợ & Trợ Giúp</h4>
                    <p className="text-xs text-muted-foreground">Hotline: 0912.345.678 (24/7)</p>
                  </div>
                </div>
                <Link
                  href="/tham-gia"
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Liên Hệ
                </Link>
              </div>

            </div>
          </div>

        </section>

        {/* Modal 1: Edit Profile Name & Student ID */}
        <AnimatePresence>
          {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-4"
              >
                <h3 className="text-xl font-black text-foreground">Chỉnh Sửa Hồ Sơ Cá Nhân</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Họ và Tên (*)</label>
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
                      setShowEditModal(false);
                      toast({ title: "Đã Cập Nhật Hồ Sơ!", description: "Thông tin tên và mã số của bạn đã thay đổi." });
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 shadow-md"
                  >
                    Lưu Thay Đổi
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal 2: Point History Dialog */}
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

        {/* Modal 3: Change Password Modal */}
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
