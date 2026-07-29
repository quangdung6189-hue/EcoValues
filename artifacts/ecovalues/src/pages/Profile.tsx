import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Award, 
  Sparkles, 
  Copy, 
  Check, 
  Clock, 
  Gift, 
  Zap, 
  ShieldCheck, 
  LogOut, 
  Camera, 
  Edit3, 
  ChevronRight, 
  Flame, 
  Calendar, 
  CheckCircle2, 
  X, 
  Wallet,
  Lock,
  Mail,
  Shield,
  KeyRound,
  FileCheck,
  Recycle,
  Trophy
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Profile() {
  const { toast } = useToast();
  const { user, isLoggedIn, logout, updatePoints, updateUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If user is not logged in, show Auth Gate Notice
  if (!isLoggedIn || !user) {
    return (
      <MainLayout>
        <div className="bg-background min-h-[80vh] flex items-center justify-center p-4">
          <div className="bg-card border border-border p-8 rounded-3xl max-w-md w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground">Bạn Chưa Đăng Nhập Tài Khoản</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Vui lòng đăng nhập hoặc tạo tài khoản sinh viên CMC để truy cập Hồ sơ cá nhân, Ví điểm thưởng và Kho quà tặng.
              </p>
            </div>
            <a 
              href="/tham-gia?mode=login" 
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs shadow-lg block transition-all active:scale-95"
            >
              🔑 Đăng Nhập Tài Khoản ➔
            </a>
          </div>
        </div>
      </MainLayout>
    );
  }

  const currentUser = user;

  // Daily Check-in state persisted per user per date
  const todayStr = new Date().toISOString().slice(0, 10);
  const checkInKey = user ? `ecovalues_checkin_${user.email}_${todayStr}` : "";

  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(() => {
    return checkInKey ? localStorage.getItem(checkInKey) === "true" : false;
  });

  const [checkInStreak, setCheckInStreak] = useState<number>(4);

  // Active Sub-tab inside Profile Page: "wallet" | "recycle_history" | "vouchers" | "privileges" | "security"
  const [activeTab, setActiveTab] = useState<"wallet" | "recycle_history" | "vouchers" | "privileges" | "security">("wallet");

  // Modals state
  const [showRankModal, setShowRankModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Edit Profile Form state
  const [editName, setEditName] = useState(currentUser.name);
  const [editStudentId, setEditStudentId] = useState(currentUser.studentId);
  const [editMajor, setEditMajor] = useState(currentUser.major);

  // Persistent Avatar State per User Account
  const avatarKey = `ecovalues_avatar_${currentUser.email}`;
  const [avatarUrl, setAvatarUrl] = useState<string>(() => {
    const saved = localStorage.getItem(avatarKey);
    return saved || currentUser.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400";
  });

  useEffect(() => {
    const saved = localStorage.getItem(avatarKey);
    if (saved) {
      setAvatarUrl(saved);
    } else if (currentUser.avatar) {
      setAvatarUrl(currentUser.avatar);
    }
  }, [currentUser.email, currentUser.avatar, avatarKey]);

  // Copy voucher code state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // User-isolated Transaction History
  const txKey = `ecovalues_tx_${currentUser.email}`;
  const [pointTransactions, setPointTransactions] = useState(() => {
    const saved = localStorage.getItem(txKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 1, type: "plus", title: "Thưởng thành viên mới (Hạng Đồng)", date: "Hôm nay, 08:00", points: "+100 pt" }
    ];
  });

  // User-isolated Vouchers
  const voucherKey = `ecovalues_vouchers_${currentUser.email}`;
  const [myVouchers, setMyVouchers] = useState(() => {
    const saved = localStorage.getItem(voucherKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Handle Logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Đã Đăng Xuất 👋",
      description: "Hẹn gặp lại bạn trong các hoạt động tích điểm tiếp theo!",
    });
  };

  // Handle Copy Voucher Code
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Đã Mã Quà Tặng! 📋",
      description: `Đã sao chép mã ${code} vào bộ nhớ tạm.`,
    });
    setTimeout(() => setCopiedCode(null), 3000);
  };

  // Handle Avatar Image Upload (Persisted to localStorage & User Profile state!)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatarUrl(result);
        localStorage.setItem(avatarKey, result);
        updateUserProfile({ avatar: result });
        toast({
          title: "Đã Đổi Avatar Mới! ✨",
          description: "Ảnh đại diện Eco-Avatar đã được lưu trữ vĩnh viễn.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Daily Check-in Action (Double Reward +100 pt!)
  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) {
      toast({
        title: "Đã Điểm Danh Hôm Nay 📅",
        description: "Bạn đã nhận phần thưởng điểm danh hôm nay rồi. Hãy quay lại vào ngày mai nhé!",
      });
      return;
    }

    if (checkInKey) {
      localStorage.setItem(checkInKey, "true");
    }
    setHasCheckedInToday(true);
    setCheckInStreak(prev => prev + 1);
    
    const newPoints = currentUser.points + 100;
    updatePoints(newPoints);

    // Save transaction to user's private history
    const newTxItem = {
      id: Date.now(),
      type: "plus",
      title: "Điểm danh hàng ngày (X2 Bonus)",
      date: "Hôm nay, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      points: "+100 pt"
    };
    const updatedTx = [newTxItem, ...pointTransactions];
    setPointTransactions(updatedTx);
    if (txKey) {
      localStorage.setItem(txKey, JSON.stringify(updatedTx));
    }

    toast({
      title: "Điểm Danh Thành Công! 🎉",
      description: "Bạn vừa nhận +100 điểm xanh hôm nay (Đã tăng gấp đôi thưởng!).",
    });
  };

  // Handle Profile Info Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      studentId: editStudentId,
      major: editMajor,
    });
    setShowEditModal(false);
    toast({
      title: "Đã Lưu Hồ Sơ! 📝",
      description: "Thông tin cá nhân đã được cập nhật thành công.",
    });
  };

  // 5 Tier Levels Definition for Modal
  const TIER_LEVELS = [
    {
      name: "Đồng (Bronze)",
      minPoints: 0,
      maxPoints: 499,
      icon: "🥉",
      color: "from-amber-700 to-amber-900",
      perks: ["Thưởng +100 pt khởi tạo", "Tham gia tích điểm thu gom rác", "Huy hiệu Đồng khởi đầu"]
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
      perks: ["Tích điểm +20%", "Nhận Giấy chứng nhận Tình nguyện viên", "Đổi bình nước tre Eco cao cấp"]
    },
    {
      name: "Kim Cương (Diamond)",
      minPoints: 1500,
      maxPoints: 2999,
      icon: "💎",
      color: "from-cyan-400 to-emerald-600",
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
                      {(() => {
                        const pts = currentUser.points;
                        let badgeTitle = "Hội Viên Hạng Đồng 🥉";
                        let badgeStyle = "bg-amber-700/20 text-amber-800 border-amber-700/30";
                        let iconColor = "text-amber-700";

                        if (pts >= 3000) {
                          badgeTitle = "Hội Viên VIP Huyền Thoại 👑";
                          badgeStyle = "bg-purple-500/20 text-purple-600 border-purple-500/30";
                          iconColor = "text-purple-500";
                        } else if (pts >= 1500) {
                          badgeTitle = "Hội Viên Kim Cương 💎";
                          badgeStyle = "bg-cyan-500/20 text-cyan-600 border-cyan-500/30";
                          iconColor = "text-cyan-500";
                        } else if (pts >= 1000) {
                          badgeTitle = "Hội Viên Hạng Vàng 🥇";
                          badgeStyle = "bg-amber-400/20 text-amber-600 border-amber-400/30";
                          iconColor = "text-amber-500";
                        } else if (pts >= 500) {
                          badgeTitle = "Hội Viên Hạng Bạc 🥈";
                          badgeStyle = "bg-slate-400/20 text-slate-600 border-slate-400/30";
                          iconColor = "text-slate-500";
                        }

                        return (
                          <button 
                            onClick={() => setShowRankModal(true)}
                            className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1 transition-all shadow-sm active:scale-95 ${badgeStyle}`}
                          >
                            <Award className={`w-3.5 h-3.5 ${iconColor}`} /> {badgeTitle}
                          </button>
                        );
                      })()}
                    </div>
                    <p className="text-xs text-muted-foreground font-semibold">
                      Mã SV: <strong className="text-foreground">{currentUser.studentId}</strong> | Chuyên ngành: <strong className="text-foreground">{currentUser.major}</strong>
                    </p>

                    {/* Dynamic Waste Contribution Stats */}
                    {(() => {
                      const pts = currentUser.points;
                      const wasteKg = pts <= 100 ? "0.0" : ((pts - 100) * 0.1).toFixed(1);
                      const wasteItems = pts <= 100 ? 0 : Math.floor((pts - 100) / 2);

                      return (
                        <p className="text-xs text-emerald-600 font-bold flex items-center justify-center sm:justify-start gap-1 pt-0.5">
                          ♻️ Đã đóng góp: <span className="underline">{wasteKg} kg rác AI</span> ({wasteItems} chai nhựa & carton)
                        </p>
                      );
                    })()}
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

              {/* Dynamic Rank Progress Bar */}
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
                          <>Cần tích lũy thêm <strong className="text-emerald-600 font-mono">+{needed} pt</strong> để lên hạng tiếp theo</>
                        ) : (
                          <>Đã đạt thứ hạng cao nhất!</>
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
                  Điểm danh mỗi ngày để tích +100 pt điểm thưởng và duy trì chuỗi điểm danh xanh (X2 Thưởng!)
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
                  <> <CheckCircle2 className="w-4 h-4" /> Đã Điểm Danh Hôm Nay (+100 pt) </>
                ) : (
                  <> <Flame className="w-4 h-4 text-amber-300 animate-bounce" /> Nhận +100 Điểm Hôm Nay! </>
                )}
              </button>
            </div>

            {/* 7 Days Streak Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 md:gap-4 pt-2">
              {[
                { day: "T2", pts: "+100", done: true },
                { day: "T3", pts: "+100", done: true },
                { day: "T4", pts: "+100", done: true },
                { day: "T5", pts: "+100", done: true },
                { day: "T6 (Hôm nay)", pts: "+100", current: true, done: hasCheckedInToday },
                { day: "T7", pts: "+100", done: false },
                { day: "CN 🎉", pts: "+200", done: false, bonus: true },
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

          {/* 🪪 SECTION 2: SUB-TABS (VÍ ĐIỂM, LỊCH SỬ THU GOM, QUÀ TẶNG, ĐẶC QUYỀN, CÀI ĐẶT) */}
          <div className="space-y-6">
            
            {/* Sub-tabs header */}
            <div className="flex bg-secondary/80 p-1.5 rounded-2xl border border-border overflow-x-auto">
              {[
                { id: "wallet", label: "Ví Điểm Thưởng", icon: Wallet },
                { id: "recycle_history", label: "Lịch Sử Thu Gom 📅", icon: Recycle },
                { id: "vouchers", label: `Quà Của Tôi (${myVouchers.length})`, icon: Gift },
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

            {/* TAB CONTENT 1: VÍ ĐIỂM THƯỞNG */}
            {activeTab === "wallet" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="md:col-span-1 bg-gradient-to-br from-emerald-600 to-teal-800 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none" />
                  
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Số Dư Điểm Khả Dụng</span>
                    <h3 className="text-4xl font-black font-mono tracking-tight">{currentUser.points.toLocaleString()} pt</h3>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-emerald-100 font-medium">Đặc quyền tích điểm xanh EcoValues</p>
                    <div className="flex gap-2">
                      <a 
                        href="/tich-diem" 
                        className="flex-1 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs rounded-xl text-center shadow transition-all block"
                      >
                        Đổi Quà Ngay 🎁
                      </a>
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
                    {pointTransactions.map((t: any) => (
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

            {/* TAB CONTENT 2: LỊCH SỬ THU GOM RÁC HÀNG NGÀY */}
            {activeTab === "recycle_history" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                      <Recycle className="w-5 h-5 text-emerald-600" /> Lịch Sử Tích Điểm Thu Gom Rác Hàng Ngày 📅
                    </h3>
                    <p className="text-xs text-muted-foreground pt-0.5">Theo dõi lịch sử phân loại rác AI & các hoạt động điểm danh tích điểm</p>
                  </div>
                  <a
                    href="/tich-diem"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm block"
                  >
                    + Thu Gom Rác Mới ➔
                  </a>
                </div>

                <div className="space-y-3">
                  {pointTransactions.length > 0 ? (
                    pointTransactions.map((item: any) => (
                      <div 
                        key={item.id}
                        className="p-4 rounded-2xl border border-border bg-secondary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-emerald-500/30 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                            item.type === 'plus' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                          }`}>
                            {item.type === 'plus' ? <Recycle className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-sm">{item.title}</p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-2 pt-0.5">
                              <span>📅 {item.date}</span>
                              <span className="text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md text-[10px]">
                                ✓ Xác thực AI thành công
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right shrink-0">
                          <span className={`font-mono font-black text-base block ${
                            item.type === 'plus' ? 'text-emerald-600' : 'text-rose-500'
                          }`}>
                            {item.points}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-semibold">Đã ghi sổ cái EcoValues</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center space-y-3 text-muted-foreground">
                      <Recycle className="w-10 h-10 mx-auto text-emerald-600/40" />
                      <p className="text-xs font-bold">Chưa có lịch sử thu gom rác nào</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT 3: QUÀ CỦA TÔI */}
            {activeTab === "vouchers" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {myVouchers.length > 0 ? (
                  myVouchers.map((v: any) => (
                    <div key={v.id} className="bg-card border border-border rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                          <Gift className="w-5 h-5" />
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
                  ))
                ) : (
                  <div className="md:col-span-3 bg-card border border-border rounded-3xl p-12 text-center space-y-4">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                      <Gift className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-foreground text-base">Kho Quà Tặng Trống</h4>
                      <p className="text-xs text-muted-foreground">Bạn chưa đổi phần thưởng nào. Hãy tích điểm rác AI để đổi Voucher nhé!</p>
                    </div>
                    <a 
                      href="/tich-diem" 
                      className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-all"
                    >
                      🎁 Đổi Quà Ngay ➔
                    </a>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB CONTENT 4: ĐẶC QUYỀN HỘI VIÊN */}
            {activeTab === "privileges" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <div>
                    <h3 className="text-lg font-black text-foreground">Bảng Đặc Quyền Tích Điểm Xanh 🏆</h3>
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
                    { title: "Tích Điểm Thu Gom AI", desc: "Nhận điểm thưởng tức thì mỗi khi chụp ảnh phân loại rác thông minh.", icon: Zap },
                    { title: "Đổi Quà Độc Quyền", desc: "Được quyền đổi các sản phẩm quà tặng giới hạn như Voucher Highlands, Balo tre.", icon: Gift },
                    { title: "Giấy Chứng Nhận Xanh", desc: "Cấp chứng nhận thành viên tích cực đóng góp hoạt động cộng đồng.", icon: Award }
                  ].map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-border bg-secondary/30 space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB CONTENT 5: CÀI ĐẶT & BẢO MẬT */}
            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="text-lg font-black text-foreground">Bảo Mật Tài Khoản 🔒</h3>
                  <p className="text-xs text-muted-foreground">Quản lý hòm thư Gmail, mã OTP và thông tin cá nhân</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-border bg-secondary/30 space-y-1">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Gmail Đã Xác Thực</span>
                    <p className="font-bold text-foreground text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4 text-emerald-600" /> {currentUser.email}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-border bg-secondary/30 space-y-1">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Mã Sinh Viên / Mã Cán Bộ</span>
                    <p className="font-bold text-foreground text-sm flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-600" /> {currentUser.studentId}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </section>

        {/* RANK MODAL: 5 TIER LEVELS ROADMAP */}
        <AnimatePresence>
          {showRankModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 md:p-8 rounded-3xl max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 text-amber-600 rounded-2xl">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground">Hệ Thống 5 Cấp Độ Thứ Hạng</h3>
                      <p className="text-xs text-muted-foreground">Tích lũy Điểm Xanh để mở khóa các đặc quyền cao cấp hơn</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowRankModal(false)}
                    className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Dynamic Current User Rank Card */}
                {(() => {
                  const pts = currentUser.points;
                  let rankName = "🥉 HỘI VIÊN HẠNG ĐỒNG";
                  let targetPts = 500;
                  let progress = Math.min(100, Math.round((pts / 500) * 100));

                  if (pts >= 3000) {
                    rankName = "👑 HỘI VIÊN VIP HUYỀN THOẠI";
                    targetPts = pts;
                    progress = 100;
                  } else if (pts >= 1500) {
                    rankName = "💎 HỘI VIÊN HẠNG KIM CƯƠNG";
                    targetPts = 3000;
                    progress = Math.min(100, Math.round(((pts - 1500) / 1500) * 100));
                  } else if (pts >= 1000) {
                    rankName = "🥇 HỘI VIÊN HẠNG VÀNG";
                    targetPts = 1500;
                    progress = Math.min(100, Math.round(((pts - 1000) / 500) * 100));
                  } else if (pts >= 500) {
                    rankName = "🥈 HỘI VIÊN HẠNG BẠC";
                    targetPts = 1000;
                    progress = Math.min(100, Math.round(((pts - 500) / 500) * 100));
                  }

                  return (
                    <div className="p-4 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">{rankName} - {progress}%</span>
                        <span className="text-muted-foreground font-mono">{pts.toLocaleString()} / {targetPts.toLocaleString()} pt</span>
                      </div>
                      <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  );
                })()}

                {/* 5 Tier Cards Grid */}
                <div className="space-y-3">
                  {TIER_LEVELS.map((tier, idx) => {
                    const pts = currentUser.points;
                    const isCurrentTier = pts >= tier.minPoints && pts <= tier.maxPoints;
                    const isNextTier = pts < tier.minPoints && (idx === 0 || pts >= TIER_LEVELS[idx - 1].minPoints);

                    return (
                      <div 
                        key={tier.name}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isCurrentTier 
                            ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md' 
                            : isNextTier
                            ? 'bg-amber-500/5 border-amber-500/50'
                            : 'bg-secondary/30 border-border opacity-70'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl shrink-0">{tier.icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-foreground text-sm">{tier.name}</h4>
                              {isCurrentTier && (
                                <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-full uppercase">
                                  HẠNG HIỆN TẠI
                                </span>
                              )}
                              {isNextTier && (
                                <span className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full uppercase">
                                  MỤC TIÊU TIẾP THEO
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-emerald-600 font-mono font-bold pt-0.5">
                              {tier.minPoints.toLocaleString()} - {tier.maxPoints >= 99999 ? "Vô hạn" : tier.maxPoints.toLocaleString()} pt
                            </p>
                          </div>
                        </div>

                        <div className="text-xs space-y-1">
                          {tier.perks.map((perk, i) => (
                            <p key={i} className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" /> {perk}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => setShowRankModal(false)}
                  className="w-full py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs rounded-2xl border border-border"
                >
                  Đóng Màn Hình ✖
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* EDIT PROFILE MODAL */}
        <AnimatePresence>
          {showEditModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-lg font-black text-foreground">Chỉnh Sửa Hồ Sơ Cá Nhân</h3>
                  <button onClick={() => setShowEditModal(false)} className="text-muted-foreground hover:text-foreground text-xs font-bold">✖</button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Họ và Tên</label>
                    <input 
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Mã Sinh Viên / Cán Bộ</label>
                    <input 
                      type="text"
                      value={editStudentId}
                      onChange={(e) => setEditStudentId(e.target.value)}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Chuyên Ngành Học Tập</label>
                    <input 
                      type="text"
                      value={editMajor}
                      onChange={(e) => setEditMajor(e.target.value)}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 py-2.5 bg-secondary text-foreground font-bold text-xs rounded-xl border border-border"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                    >
                      Lưu Thay Đổi ➔
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* FULL HISTORY MODAL */}
        <AnimatePresence>
          {showHistoryModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-lg font-black text-foreground">Lịch Sử Biến Động Điểm Thưởng</h3>
                  <button onClick={() => setShowHistoryModal(false)} className="text-muted-foreground hover:text-foreground text-xs font-bold">✖</button>
                </div>

                <div className="space-y-3">
                  {pointTransactions.map((t: any) => (
                    <div key={t.id} className="p-3.5 bg-secondary/50 rounded-2xl flex items-center justify-between text-xs border border-border/60">
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

                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="w-full py-2.5 bg-secondary text-foreground font-bold text-xs rounded-xl border border-border"
                >
                  Đóng Màn Hình ✖
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </MainLayout>
  );
}
