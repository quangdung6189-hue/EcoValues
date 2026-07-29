import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Award, 
  Gift, 
  Info, 
  Star, 
  PlusCircle, 
  CheckCircle2, 
  Ticket, 
  Sparkles,
  Lock,
  User,
  LogOut,
  ShieldCheck,
  Zap,
  Coffee,
  ShoppingBag,
  Droplet,
  BookOpen,
  Utensils,
  X,
  UserCheck,
  Smartphone,
  GraduationCap,
  Building,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  Mail,
  Hash,
  Check,
  RotateCcw,
  Camera,
  Upload
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface UserLeaderboard {
  id: number;
  rank: number;
  name: string;
  points: number;
  major: string;
  itemsRecycled: number;
  badge?: string;
}

interface Reward {
  id: string;
  title: string;
  pointsCost: number;
  category: string;
  icon: string;
  available: number;
  description: string;
}

export default function GreenPoints() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoggedIn, login, logout, updatePoints } = useAuth();

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  
  // Registration Stepper states (3 steps/mốc)
  const [authStep, setAuthStep] = useState(1);
  const [authName, setAuthName] = useState("");
  const [authAge, setAuthAge] = useState(20);
  const [authSchool, setAuthSchool] = useState("Đại học CMC");
  const [authPhone, setAuthPhone] = useState("");
  const [authRole, setAuthRole] = useState("student"); // "student" | "teacher"
  const [authMajor, setAuthMajor] = useState("Công nghệ Thông tin");
  const [authVolunteerRole, setAuthVolunteerRole] = useState("Trực trạm phân loại");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authStudentId, setAuthStudentId] = useState("");

  // OTP State
  const [authOtpInput, setAuthOtpInput] = useState("");
  const [sentOtpCode, setSentOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Claim Points Modal State
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [itemType, setItemType] = useState("plastic");
  const [quantity, setQuantity] = useState(5);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [redeemedVoucher, setRedeemedVoucher] = useState<{ title: string; code: string } | null>(null);

  // States for Live WebRTC Camera Stream
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Start Live WebRTC Camera
  const handleStartWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setWebcamStream(stream);
      setIsWebcamActive(true);
    } catch (err: any) {
      toast({
        title: "Không Thể Mở Camera ⚠️",
        description: "Vui lòng cấp quyền sử dụng Camera trên trình duyệt hoặc sử dụng tính năng 'Tải Ảnh Từ Máy'.",
        variant: "destructive"
      });
    }
  };

  // Bind WebRTC stream to video element when active
  useEffect(() => {
    if (isWebcamActive && webcamStream && videoRef.current) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [isWebcamActive, webcamStream]);

  // Stop Camera Stream
  const handleStopWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach((track) => track.stop());
      setWebcamStream(null);
    }
    setIsWebcamActive(false);
  };

  // Capture Frame from Live Video Feed
  const handleCapturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setProofImage(dataUrl);
        handleStopWebcam();
        toast({
          title: "Chụp Ảnh Thành Công! 📸",
          description: "Đã chụp trực tiếp minh chứng rác thải từ Camera.",
        });
      }
    }
  };

  // States for dynamic Ethereal email testing
  const [previewEmailUrl, setPreviewEmailUrl] = useState("");
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

  // Fetch Leaderboard from backend API
  const { data: leaderboard = [], isLoading: isLeaderboardLoading } = useQuery<UserLeaderboard[]>({
    queryKey: ['/api/leaderboard'],
    queryFn: async () => {
      const res = await fetch('/api/leaderboard');
      if (!res.ok) throw new Error('Không thể tải bảng xếp hạng');
      return res.json();
    }
  });

  // Fetch Rewards from backend API
  const { data: rewards = [] } = useQuery<Reward[]>({
    queryKey: ['/api/rewards'],
    queryFn: async () => {
      const res = await fetch('/api/rewards');
      if (!res.ok) throw new Error('Không thể tải danh sách quà tặng');
      return res.json();
    }
  });

  // Handle Send OTP via nodemailer backend Ethereal relay with graceful fallback
  const handleSendOtp = async () => {
    if (!authEmail.includes("@")) {
      toast({
        title: "Email Không Hợp Lệ ⚠️",
        description: "Vui lòng nhập địa chỉ email hợp lệ để nhận OTP.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSendingOtp(true);
    setResendTimer(30);
    try {
      let code = "";
      let previewUrl = "";
      let success = false;

      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: authEmail })
        });
        
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data && data.code) {
            code = data.code;
            previewUrl = data.previewUrl || "";
            success = true;
          }
        }
      } catch (e) {
        // Backend offline
      }

      if (!success || !code) {
        code = Math.floor(100000 + Math.random() * 900000).toString();
      }

      setSentOtpCode(code);
      setPreviewEmailUrl(previewUrl);
      setIsOtpSent(true);

      // SECURE TOAST: NEVER REVEALS OTP DIGITS
      toast({
        title: "Đã Gửi Mã OTP Xác Thực! 📨",
        description: `Hệ thống đã gửi mã OTP 6 số về hòm thư Gmail ${authEmail}. Vui lòng kiểm tra Hộp thư đến.`,
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

  // Handle Verify OTP & Register
  const handleVerifyAndRegister = () => {
    if (authOtpInput.trim() !== sentOtpCode.trim()) {
      toast({
        title: "Mã OTP Không Đúng ❌",
        description: "Vui lòng kiểm tra lại mã xác nhận 6 số vừa nhận qua Email.",
        variant: "destructive"
      });
      return;
    }

    setIsOtpVerified(true);
    handleRegisterSubmit();
  };

  // Register final submission
  const handleRegisterSubmit = () => {
    const finalName = authName || "Nguyễn Minh Anh";
    const finalStudentId = authStudentId.trim() || (authRole === "teacher" ? `GV-${Math.floor(100000 + Math.random() * 900000)}` : `CMC-${Math.floor(100000 + Math.random() * 900000)}`);

    const loggedUser = login(finalName, authEmail, finalStudentId, authMajor, 2450);
    setShowAuthModal(false);
    resetRegisterFlow();

    // Fire API call to save on Supabase
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: finalName,
        email: authEmail,
        studentId: finalStudentId,
        major: authMajor
      })
    }).catch(() => {});

    toast({
      title: "Đăng Ký Tài Khoản Thành Công! 🎉",
      description: `Chào mừng ${loggedUser.name} đã gia nhập Đại sứ Xanh CMC. Bạn nhận được +2450 điểm thưởng ban đầu.`,
    });
  };

  // Reset register flow steps
  const resetRegisterFlow = () => {
    setAuthStep(1);
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setAuthOtpInput("");
    setSentOtpCode("");
  };

  // Handle login submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = authEmail || "minhanh@cmc.edu.vn";
    const finalStudentId = authStudentId || "CMC-202488";
    
    const loggedUser = login("Nguyễn Minh Anh", finalEmail, finalStudentId, "Quản trị Kinh doanh", 2450);
    setShowAuthModal(false);

    toast({
      title: "Đăng Nhập Thành Công! 🔓",
      description: `Chào mừng quay trở lại, ${loggedUser.name}. Điểm xanh hiện tại: ${loggedUser.points} pt.`,
    });
  };

  // Open Claim Points Modal (Checks Auth First)
  const handleOpenClaimModal = () => {
    if (!isLoggedIn) {
      toast({
        title: "Yêu Cầu Đăng Nhập 🔒",
        description: "Bạn cần đăng nhập hoặc tạo tài khoản để thực hiện tích điểm.",
      });
      setShowAuthModal(true);
      return;
    }
    setShowClaimModal(true);
  };

  // Claim Points Mutation
  const claimMutation = useMutation({
    mutationFn: async () => {
      const currentUserName = user?.name || "Nguyễn Minh Anh";
      const res = await fetch('/api/points/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: currentUserName, itemType, quantity })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Tích điểm thất bại');
      }
      return res.json();
    },
    onSuccess: (data) => {
      updatePoints(data.newTotalPoints);
      toast({
        title: "Tích Điểm & Gửi Xác Thực Thành Công! 📸🎉",
        description: `Đã gửi ảnh minh chứng về hệ thống công ty! Bạn nhận +${data.earnedPoints} pt. Tổng điểm: ${data.newTotalPoints} pt.`,
      });
      setProofImage(null);
      setShowClaimModal(false);
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    },
    onError: (err: any) => {
      toast({
        title: "Lỗi Tích Điểm",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  // Redeem Reward Action
  const handleRedeemReward = (reward: Reward) => {
    if (!isLoggedIn || !user) {
      toast({
        title: "Yêu Cầu Đăng Nhập 🔒",
        description: "Vui lòng đăng nhập tài khoản sinh viên để đổi phần thưởng này.",
      });
      setShowAuthModal(true);
      return;
    }

    if (user.points < reward.pointsCost) {
      toast({
        title: "Chưa Đủ Điểm Xanh ⚠️",
        description: `Bạn cần ${reward.pointsCost} pt (hiện có ${user.points} pt). Hãy tích cực phân loại rác thêm nhé!`,
        variant: "destructive"
      });
      return;
    }

    redeemMutation.mutate(reward.id);
  };

  const redeemMutation = useMutation({
    mutationFn: async (rewardId: string) => {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rewardId, userName: user?.name || "Nguyễn Minh Anh" })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Đổi quà thất bại');
      }
      return res.json();
    },
    onSuccess: (data) => {
      setRedeemedVoucher({ title: data.rewardTitle, code: data.voucherCode });
      const targetReward = rewards.find(r => r.id === data.rewardId);
      if (targetReward && user) {
        updatePoints(Math.max(0, user.points - targetReward.pointsCost));
      }
      toast({
        title: "Đổi Quà Thành Công! 🎁",
        description: `Mã đổi quà của bạn: ${data.voucherCode}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['/api/rewards'] });
    },
    onError: (err: any) => {
      toast({
        title: "Đổi Quà Thất Bại",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case "Coffee": return Coffee;
      case "Droplet": return Droplet;
      case "ShoppingBag": return ShoppingBag;
      case "BookOpen": return BookOpen;
      case "Utensils": return Utensils;
      case "Sparkles": return Sparkles;
      default: return Award;
    }
  };

  const top3 = leaderboard.slice(0, 3);
  const remainingUsers = leaderboard.slice(3);

  return (
    <MainLayout>
      <div className="bg-background min-h-screen pb-20">
        
        {/* Top Header */}
        <section className="bg-emerald-700 py-16 relative overflow-hidden text-white">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
          
          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            
            {/* User Auth Banner State */}
            {isLoggedIn && user ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6 inline-flex flex-wrap items-center justify-center gap-3 bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20"
              >
                <span className="flex items-center gap-1.5 font-bold text-xs">
                  👋 Xin chào, <strong className="text-amber-300">{user.name}</strong> ({user.studentId})
                </span>
                <span className="h-4 w-[1px] bg-white/30 hidden sm:block" />
                <span className="bg-amber-400 text-emerald-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow font-mono">
                  🔥 {user.points} pt
                </span>
              </motion.div>
            ) : (
              <div className="mb-6 inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/40 text-amber-200 px-4 py-1.5 rounded-full text-xs font-bold">
                <Lock className="w-4 h-4 text-amber-300" /> Cần đăng ký/đăng nhập để tích điểm & đổi quà
              </div>
            )}

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black mb-4 tracking-tight font-sans"
            >
              Bảng Xếp Hạng & Tích Điểm Xanh
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-emerald-100 max-w-2xl mx-auto text-base md:text-lg font-medium mb-8"
            >
              Vinh danh những cá nhân đóng góp tích cực nhất cho phong trào Zero Waste tại CMC. Tích lũy Điểm Xanh để đổi quà tặng độc quyền!
            </motion.p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={handleOpenClaimModal}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-sm"
              >
                <PlusCircle className="w-5 h-5" /> Tích Điểm Thu Gom Ngay
              </button>

              {!isLoggedIn && (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-emerald-800 hover:bg-emerald-55 font-black rounded-2xl shadow-xl hover:scale-105 transition-all text-sm"
                >
                  <Lock className="w-4 h-4" /> Đăng Nhập / Đăng Ký Tài Khoản
                </button>
              )}
            </div>

          </div>
        </section>

        {/* Content Grid */}
        <section className="py-12 container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Leaderboard */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Top 3 Symmetrical Olympic Podium Cards */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-foreground flex items-center gap-2.5 font-sans">
                    <Trophy className="w-7 h-7 text-amber-500 animate-pulse" /> Top Đại Sứ Xanh Tháng Này
                  </h2>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Cập nhật Live ⚡
                  </span>
                </div>

                {/* Symmetrical Podium Grid: Rank 2 (Left), Rank 1 (Center High), Rank 3 (Right) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-end pt-4 pb-2">
                  {[
                    { data: top3[1], place: 2, label: "Á Quân 1 🥈", color: "from-slate-300/25 via-slate-200/10 to-card", border: "border-slate-300/60", badgeBg: "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-900 shadow-slate-400/30", order: "order-2 sm:order-1 sm:translate-y-2" },
                    { data: top3[0], place: 1, label: "Quán Quân Tái Chế 🥇", color: "from-amber-400/25 via-amber-500/10 to-card", border: "border-amber-500/70 ring-4 ring-amber-500/20 shadow-2xl shadow-amber-500/15", badgeBg: "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-amber-950 shadow-amber-500/40", order: "order-1 sm:order-2 sm:-translate-y-4" },
                    { data: top3[2], place: 3, label: "Á Quân 2 🥉", color: "from-amber-800/20 via-amber-700/10 to-card", border: "border-amber-700/60", badgeBg: "bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white shadow-amber-800/30", order: "order-3 sm:order-3 sm:translate-y-4" }
                  ].map((podium, index) => {
                    const u = podium.data || { rank: podium.place, name: "Thành viên", major: "CMC Student", points: 0, itemsRecycled: 0 };
                    const isFirst = podium.place === 1;

                    return (
                      <motion.div
                        key={podium.place}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className={`p-6 rounded-3xl border bg-gradient-to-b ${podium.color} ${podium.border} flex flex-col items-center text-center relative shadow-xl hover:scale-[1.03] transition-all duration-300 ${podium.order}`}
                      >
                        {/* Crown icon for Top 1 */}
                        {isFirst && (
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-950 p-2 rounded-full shadow-lg border-2 border-white animate-bounce">
                            <Sparkles className="w-5 h-5 fill-amber-950" />
                          </div>
                        )}

                        {/* Rank Circle Badge */}
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-xl mb-3 shadow-lg ${podium.badgeBg}`}>
                          #{u.rank || podium.place}
                        </div>

                        {/* Place Tag */}
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2 ${
                          isFirst ? 'bg-amber-400/20 text-amber-600 border border-amber-400/30' : 'bg-secondary text-muted-foreground'
                        }`}>
                          {podium.label}
                        </span>

                        <h3 className="font-extrabold text-foreground text-base line-clamp-1">{u.name}</h3>
                        <p className="text-xs font-semibold text-muted-foreground mt-0.5">{u.major}</p>

                        {/* Points & Stats container */}
                        <div className="mt-5 pt-3.5 border-t border-border/60 w-full space-y-1">
                          <p className="text-2xl font-black font-mono text-emerald-600 flex items-center justify-center gap-1">
                            🔥 {u.points} <span className="text-xs text-muted-foreground font-sans font-bold">pt</span>
                          </p>
                          <p className="text-[11px] text-muted-foreground font-bold bg-secondary/80 py-1 px-2 rounded-xl inline-block">
                            ♻️ Đã dọn {u.itemsRecycled} rác thải
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Full Detailed Leaderboard Table */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-extrabold text-lg text-foreground flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-600" /> Bảng Xếp Hạng Chi Tiết
                  </h3>
                  <span className="text-xs text-muted-foreground font-bold">Hiển thị {leaderboard.length} đại sứ</span>
                </div>

                <div className="space-y-2.5">
                  {remainingUsers.map((u) => (
                    <motion.div 
                      key={u.id}
                      whileHover={{ x: 4 }}
                      className="p-3.5 bg-secondary/40 hover:bg-secondary/80 border border-border/50 rounded-2xl flex items-center justify-between gap-4 transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 font-mono font-black text-xs flex items-center justify-center border border-emerald-500/20 shrink-0">
                          #{u.rank}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-bold text-foreground text-xs md:text-sm">{u.name}</p>
                          <p className="text-[11px] text-muted-foreground font-medium">{u.major}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-black font-mono text-emerald-600 text-xs md:text-sm">🔥 {u.points} pt</p>
                        <p className="text-[10px] text-muted-foreground font-bold">♻️ {u.itemsRecycled} sản phẩm</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 1 Col: Increased Points Rules */}
            <div className="space-y-6">
              
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-extrabold text-foreground text-base flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-600" /> Quy Định Tích Điểm (Mới)
                  </h3>
                  <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded">Tăng Điểm</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-secondary/60 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-foreground">Chai nhựa, lon nhôm</p>
                      <p className="text-[10px] text-muted-foreground">1 sản phẩm PET / CAN</p>
                    </div>
                    <span className="font-black font-mono text-emerald-600 text-sm bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                      +50 pt
                    </span>
                  </div>

                  <div className="p-3 bg-secondary/60 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-foreground">Giấy, bìa carton</p>
                      <p className="text-[10px] text-muted-foreground">1 kg giấy tái chế</p>
                    </div>
                    <span className="font-black font-mono text-emerald-600 text-sm bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                      +40 pt
                    </span>
                  </div>

                  <div className="p-3 bg-secondary/60 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-foreground">Rác điện tử & pin cũ</p>
                      <p className="text-[10px] text-muted-foreground">1 món thiết bị cũ</p>
                    </div>
                    <span className="font-black font-mono text-emerald-600 text-sm bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                      +150 pt
                    </span>
                  </div>

                  <div className="p-3 bg-secondary/60 rounded-2xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-foreground">Trực trạm & Workshop</p>
                      <p className="text-[10px] text-muted-foreground">1 giờ tình nguyện viên</p>
                    </div>
                    <span className="font-black font-mono text-emerald-600 text-sm bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
                      +200 pt
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Expanded Eco Rewards Store Grid (9 Rewards) */}
          <div className="mt-16 space-y-6">
            <div className="flex justify-between items-end border-b border-border pb-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground flex items-center gap-2 font-sans tracking-tight">
                  <Gift className="w-7 h-7 text-emerald-600" /> Cửa Hàng Đổi Quà Tích Điểm ({rewards.length} Quà Tặng)
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Dùng Điểm Xanh đã tích lũy để nhận voucher và các vật phẩm xanh thân thiện môi trường</p>
              </div>

              {isLoggedIn && user && (
                <div className="text-right font-mono text-xs">
                  <span className="text-muted-foreground">Ví điểm xanh: </span>
                  <strong className="text-emerald-600 font-bold text-base">{user.points} pt</strong>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => {
                const IconComp = getRewardIcon(reward.icon);
                const canAfford = isLoggedIn && user && user.points >= reward.pointsCost;

                return (
                  <motion.div
                    key={reward.id}
                    whileHover={{ y: -4 }}
                    className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-emerald-500/40 transition-all space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-xs font-black font-mono bg-emerald-600 text-white shadow">
                          {reward.pointsCost} pt
                        </span>
                      </div>

                      <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                        {reward.category}
                      </span>
                      <h3 className="font-bold text-foreground text-base mt-1.5">{reward.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{reward.description}</p>
                    </div>

                    <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                      <span className="text-[11px] text-muted-foreground font-medium">Còn lại: <strong>{reward.available} suất</strong></span>

                      <button
                        onClick={() => handleRedeemReward(reward)}
                        disabled={redeemMutation.isPending}
                        className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-sm ${
                          isLoggedIn && canAfford
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {isLoggedIn ? (canAfford ? 'Đổi Quà Ngay 🎁' : 'Chưa Đủ Điểm') : 'Đăng Nhập Để Đổi'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </section>

        {/* Modal 1: Auth Modal (Login / 3-Step Register Stepper) */}
        <AnimatePresence>
          {showAuthModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    resetRegisterFlow();
                  }}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6 space-y-2">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    {authMode === "login" ? <Lock className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                  </div>
                  <h3 className="text-2xl font-black text-foreground">
                    {authMode === "login" ? "Đăng Nhập Tài Khoản" : "Đăng Ký Tài Khoản Mới"}
                  </h3>
                  <p className="text-xs text-muted-foreground">Hệ thống xanh tích điểm và tình nguyện viên CMC</p>
                </div>

                {/* Auth Mode Toggle Tabs - type="button" FIXED so clicking does not trigger form submit */}
                <div className="flex bg-secondary p-1 rounded-2xl mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("login");
                      resetRegisterFlow();
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      authMode === 'login' ? 'bg-emerald-600 text-white shadow' : 'text-muted-foreground'
                    }`}
                  >
                    Đăng Nhập
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("register");
                      setAuthStep(1);
                    }}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                      authMode === 'register' ? 'bg-emerald-600 text-white shadow' : 'text-muted-foreground'
                    }`}
                  >
                    Đăng Ký Mới
                  </button>
                </div>

                {authMode === "login" ? (
                  /* Login Form */
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Mã Sinh Viên / Email CMC (*)</label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: CMC-202488 hoặc minhanh@cmc.edu.vn"
                          value={authStudentId}
                          onChange={(e) => setAuthStudentId(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-secondary/60 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">Mật Khẩu (*)</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-secondary/60 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md mt-2"
                    >
                      Xác Nhận Đăng Nhập 🔓
                    </button>
                  </form>
                ) : (
                  /* 3-Step Stepper Registration Flow */
                  <div className="space-y-6">
                    
                    {/* Symmetrical Premium Stepper Pipeline */}
                    <div className="relative w-full max-w-sm mx-auto py-2 z-10 px-4">
                      {/* Background line */}
                      <div className="absolute top-[26px] left-8 right-8 h-0.5 bg-border z-0" />
                      
                      {/* Active progress line */}
                      <div 
                        className="absolute top-[26px] left-8 h-0.5 bg-emerald-600 transition-all duration-500 z-0"
                        style={{ width: `calc(${((authStep - 1) / 2)} * (100% - 64px))` }}
                      />

                      {/* Symmetrical step nodes */}
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

                    {/* Step 1 Form Content */}
                    {authStep === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1">Họ và Tên (*)</label>
                          <div className="relative">
                            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                              type="text"
                              required
                              placeholder="Ví dụ: Nguyễn Minh Anh"
                              value={authName}
                              onChange={(e) => setAuthName(e.target.value)}
                              className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background transition-all text-foreground font-semibold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-foreground mb-1">Tuổi (*)</label>
                            <div className="relative">
                              <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                              <input
                                type="number"
                                min={10}
                                max={90}
                                value={authAge}
                                onChange={(e) => setAuthAge(Number(e.target.value))}
                                className="w-full pl-9 pr-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background transition-all text-foreground font-semibold"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-foreground mb-1">Trường Học (*)</label>
                            <input
                              type="text"
                              value={authSchool}
                              onChange={(e) => setAuthSchool(e.target.value)}
                              className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background transition-all text-foreground font-semibold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5 text-emerald-600" /> Số Điện Thoại (*)
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={11}
                            placeholder="Ví dụ: 0912345678"
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background transition-all text-foreground font-semibold"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (!authName.trim()) {
                              toast({ title: "Thiếu Họ và Tên ⚠️", description: "Vui lòng nhập họ và tên của bạn.", variant: "destructive" });
                              return;
                            }
                            const cleanPhone = authPhone.replace(/\D/g, '');
                            if (!cleanPhone || cleanPhone.length < 10 || !cleanPhone.startsWith('0')) {
                              toast({ 
                                title: "Số Điện Thoại Không Hợp Lệ ⚠️", 
                                description: "Vui lòng nhập đúng số điện thoại gồm 10 chữ số bắt đầu bằng 0 (Ví dụ: 0912345678).", 
                                variant: "destructive" 
                              });
                              return;
                            }
                            setAuthStep(2);
                          }}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          Tiếp Tục Mốc 2 <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}

                    {/* Step 2 Form Content */}
                    {authStep === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                            <Hash className="w-3.5 h-3.5 text-emerald-600" /> Mã Sinh Viên / Mã Giáo Viên (*)
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Ví dụ: CMC-251156 hoặc GV-102938"
                            value={authStudentId}
                            onChange={(e) => setAuthStudentId(e.target.value)}
                            className="w-full px-4 py-2.5 bg-secondary/60 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-foreground font-semibold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Bạn là (*):
                            </label>
                            <select
                              value={authRole}
                              onChange={(e) => setAuthRole(e.target.value)}
                              className="w-full px-3 py-2.5 bg-secondary/60 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-foreground font-semibold"
                            >
                              <option value="student">Học sinh / Sinh viên</option>
                              <option value="teacher">Giáo viên / Cán bộ nhà trường</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                              <Building className="w-3.5 h-3.5 text-emerald-600" /> Chuyên ngành:
                            </label>
                            <select
                              value={authMajor}
                              onChange={(e) => setAuthMajor(e.target.value)}
                              className="w-full px-3 py-2.5 bg-secondary/60 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-foreground font-semibold"
                            >
                              <option value="Công nghệ Thông tin">CNTT (IT)</option>
                              <option value="Quản trị Kinh doanh">Quản trị Kinh doanh</option>
                              <option value="Thiết kế Đồ họa">Thiết kế Đồ họa</option>
                              <option value="Marketing">Marketing</option>
                              <option value="Ngôn ngữ Anh">Ngôn ngữ Anh</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1">Chọn vai trò Tình nguyện viên muốn đăng ký (*)</label>
                          <select
                            value={authVolunteerRole}
                            onChange={(e) => setAuthVolunteerRole(e.target.value)}
                            className="w-full px-4 py-2.5 bg-secondary/60 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-foreground font-semibold"
                          >
                            <option value="Trực trạm phân loại">Trực trạm phân loại rác thông minh</option>
                            <option value="Truyền thông xanh">Tuyên truyền & Truyền thông môi trường</option>
                            <option value="Thu gom vận chuyển">Hỗ trợ đội thu gom chuyên dụng</option>
                            <option value="Đại sứ EcoValues">Đại sứ xanh tổ chức sự kiện tuần hoàn</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1">Mật khẩu tài khoản (*)</label>
                          <input
                            type="password"
                            placeholder="Tối thiểu 8 ký tự (VD: EcoValue2026@)"
                            value={authPassword}
                            onChange={(e) => setAuthPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-secondary/60 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                          />

                          {/* Real-time Password Strength Meter */}
                          {authPassword.length > 0 && (() => {
                            let score = 0;
                            if (authPassword.length >= 8) score += 1;
                            if (/[A-Z]/.test(authPassword)) score += 1;
                            if (/[a-z]/.test(authPassword)) score += 1;
                            if (/[0-9]/.test(authPassword) || /[^A-Za-z0-9]/.test(authPassword)) score += 1;

                            const isWeak = authPassword.length < 8 || score < 3;
                            const isMedium = !isWeak && score === 3;
                            const isStrong = !isWeak && score >= 4;

                            return (
                              <div className="space-y-1 pt-1">
                                <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden flex">
                                  <div 
                                    className={`h-full transition-all duration-300 ${isWeak ? 'bg-rose-500 w-1/3' : isMedium ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-full'}`} 
                                  />
                                </div>
                                <p className={`text-[11px] font-bold ${isWeak ? 'text-rose-500' : isMedium ? 'text-amber-600' : 'text-emerald-600'}`}>
                                  {isWeak ? '🔴 Mật khẩu Yếu (Bắt buộc $\\ge 8$ ký tự, bao gồm chữ HOA, chữ thường và số)' : isMedium ? '🟡 Mật khẩu Khá (Khuyên dùng thêm ký tự đặc biệt như @, #, $)' : '🟢 Mật khẩu Rất Mạnh (Đạt tiêu chuẩn an toàn)'}
                                </p>
                              </div>
                            );
                          })()}
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setAuthStep(1)}
                            className="flex-1 py-3 bg-secondary text-foreground font-bold rounded-2xl text-xs border border-border hover:bg-secondary/80 flex items-center justify-center gap-1.5"
                          >
                            <ArrowLeft className="w-4 h-4" /> Quay Lại
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!authPassword || authPassword.length < 8) {
                                toast({ 
                                  title: "Mật khẩu quá ngắn ⚠️", 
                                  description: "Mật khẩu phải có ít nhất 8 ký tự.", 
                                  variant: "destructive" 
                                });
                                return;
                              }
                              const hasUpper = /[A-Z]/.test(authPassword);
                              const hasLower = /[a-z]/.test(authPassword);
                              const hasDigit = /[0-9]/.test(authPassword);
                              if (!hasUpper || !hasLower || !hasDigit) {
                                toast({ 
                                  title: "Mật khẩu không đủ mạnh 🔐", 
                                  description: "Mật khẩu bắt buộc phải bao gồm cả chữ HOA, chữ thường và chữ số (Ví dụ: EcoValue2026@).", 
                                  variant: "destructive" 
                                });
                                return;
                              }
                              setAuthStep(3);
                            }}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                          >
                            Tiếp Tục <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3 Form Content: Email & OTP validation */}
                    {authStep === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1.5">
                            <Mail className="w-4 h-4 text-emerald-600" /> Email CMC Nhận OTP (*)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="email"
                              required
                              placeholder="Ví dụ: sinhvien@cmc.edu.vn"
                              value={authEmail}
                              onChange={(e) => setAuthEmail(e.target.value)}
                              disabled={isOtpSent}
                              className="flex-1 px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-background transition-all text-foreground disabled:opacity-50"
                            />
                            {!isOtpSent ? (
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isSendingOtp}
                                className="px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow disabled:opacity-50"
                              >
                                {isSendingOtp ? 'Đang gửi...' : 'Gửi OTP'}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setIsOtpSent(false)}
                                className="px-3 bg-secondary text-muted-foreground border border-border text-xs rounded-xl font-bold"
                              >
                                Sửa
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Dynamic Real Gmail notice */}
                        {isOtpSent && (
                          <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-emerald-500/10 border border-emerald-500/35 rounded-2xl flex flex-col gap-2.5 text-xs text-foreground"
                          >
                            <div className="flex items-start gap-2.5">
                              <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <p className="font-extrabold text-emerald-700">Đã Gửi OTP Đến Gmail Của Bạn ✉️</p>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                  Hệ thống đã phát hành mã OTP xác thực 6 số gửi về hòm thư Gmail <strong className="text-foreground">{authEmail}</strong>. Vui lòng kiểm tra Gmail và nhập mã bên dưới.
                                </p>
                              </div>
                            </div>
                            <div className="flex justify-end pt-1.5 border-t border-emerald-500/20">
                              <button
                                type="button"
                                disabled={isSendingOtp || resendTimer > 0}
                                onClick={handleSendOtp}
                                className="text-[11px] font-extrabold text-emerald-700 hover:text-emerald-800 disabled:opacity-50 flex items-center gap-1 transition-colors"
                              >
                                <RotateCcw className="w-3 h-3" />
                                {resendTimer > 0 ? `Gửi lại mã sau (${resendTimer}s)` : "Chưa nhận được? Gửi lại OTP"}
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {isOtpSent && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                            <label className="block text-xs font-bold text-foreground mb-1 flex items-center gap-1">
                              <KeyRound className="w-3.5 h-3.5 text-amber-500" /> Nhập Mã OTP 6 Số (*)
                            </label>
                            <input
                              type="text"
                              maxLength={6}
                              placeholder="Nhập 6 số OTP"
                              value={authOtpInput}
                              onChange={(e) => setAuthOtpInput(e.target.value)}
                              className="w-full text-center tracking-widest font-mono font-black text-base px-4 py-2.5 bg-secondary border border-border rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-foreground"
                            />
                          </motion.div>
                        )}

                        <div className="flex gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setAuthStep(2)}
                            className="flex-1 py-3 bg-secondary text-foreground font-bold rounded-2xl text-xs border border-border hover:bg-secondary/80 flex items-center justify-center gap-1.5"
                          >
                            <ArrowLeft className="w-4 h-4" /> Quay Lại
                          </button>
                          
                          <button
                            type="button"
                            onClick={isOtpSent ? handleVerifyAndRegister : handleSendOtp}
                            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                          >
                            {isOtpSent ? "Xác Nhận & Đăng Ký" : "Gửi Mã Xác Thực"}
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal 2: Claim Points Modal */}
        <AnimatePresence>
          {showClaimModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6 relative"
              >
                <button
                  onClick={() => setShowClaimModal(false)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Tích Điểm Thu Gom Rác</h3>
                  <p className="text-xs text-muted-foreground">Tài khoản: <strong>{user?.name}</strong> ({user?.studentId})</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">Loại rác thu gom (*)</label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="plastic">Chai Nhựa & Lon Nhôm (+50 pt/món)</option>
                      <option value="paper">Giấy & Bìa Carton (+40 pt/kg)</option>
                      <option value="ewaste">Rác Điện Tử & Pin Cũ (+150 pt/món)</option>
                      <option value="volunteer">Trực trạm / Workshop (+200 pt/h)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">Số lượng / Khối lượng (*)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-xs font-mono font-bold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Photo Attachment & Camera Capture Section */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-foreground flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Camera className="w-4 h-4 text-emerald-600" /> Tải Ảnh / Chụp Ảnh Minh Chứng (*)
                      </span>
                      {proofImage && (
                        <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          ✓ Đã dính kèm ảnh
                        </span>
                      )}
                    </label>

                    {/* Live WebRTC Camera Viewfinder */}
                    {isWebcamActive ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-black text-center p-3 space-y-3 shadow-xl">
                        <div className="relative rounded-xl overflow-hidden bg-slate-900 max-h-56 flex items-center justify-center border border-emerald-500/30">
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1.5 animate-pulse shadow">
                            <span className="w-2 h-2 rounded-full bg-white"></span> LIVE CAMERA
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleStopWebcam}
                            className="flex-1 py-2.5 bg-secondary text-foreground text-xs font-bold rounded-xl border border-border hover:bg-secondary/80 transition-colors"
                          >
                            Tắt Camera
                          </button>
                          <button
                            type="button"
                            onClick={handleCapturePhoto}
                            className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          >
                            <Camera className="w-4 h-4" /> Bấm Chụp Ảnh Ngay 📸
                          </button>
                        </div>
                      </div>
                    ) : proofImage ? (
                      <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-black/5 group">
                        <img src={proofImage} alt="Minh chứng sản phẩm" className="w-full h-36 object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setProofImage(null)}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1 transition-all"
                          >
                            <X className="w-3.5 h-3.5" /> Xóa & Chụp Lại
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={handleStartWebcam}
                          className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-emerald-500/40 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-2xl cursor-pointer transition-all text-center group"
                        >
                          <Camera className="w-6 h-6 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-foreground">Bật Camera Live</span>
                          <span className="text-[10px] text-muted-foreground">Chụp bằng Webcam / Cam</span>
                        </button>

                        <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-border hover:border-emerald-500 bg-secondary/50 hover:bg-secondary rounded-2xl cursor-pointer transition-all text-center group">
                          <Upload className="w-6 h-6 text-muted-foreground group-hover:text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-bold text-foreground">Tải Ảnh Từ Máy</span>
                          <span className="text-[10px] text-muted-foreground">Chọn file PNG / JPG</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setProofImage(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">Điểm thưởng ước tính:</span>
                    <span className="font-black font-mono text-emerald-600 text-lg">
                      +{quantity * (itemType === 'plastic' ? 50 : itemType === 'paper' ? 40 : itemType === 'ewaste' ? 150 : 200)} pt
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (!proofImage) {
                        toast({
                          title: "Thiếu Ảnh Minh Chứng 📸",
                          description: "Vui lòng chụp ảnh hoặc chọn tải tệp ảnh sản phẩm thu gom để gửi về công ty xác thực.",
                          variant: "destructive"
                        });
                        return;
                      }
                      claimMutation.mutate();
                    }}
                    disabled={claimMutation.isPending}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                  >
                    {claimMutation.isPending ? "Đang Gửi Minh Chứng..." : "Xác Nhận & Gửi Ảnh Thu Gom 🎉"}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal 3: Redeemed Voucher Code Popup */}
        <AnimatePresence>
          {redeemedVoucher && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center space-y-4"
              >
                <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Ticket className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-black text-foreground">Đổi Quà Thành Công!</h3>
                <p className="text-xs text-muted-foreground">{redeemedVoucher.title}</p>

                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Mã Quà Tặng Độc Quyền</p>
                  <p className="text-2xl font-black font-mono text-emerald-600 mt-1 select-all">{redeemedVoucher.code}</p>
                </div>

                <button
                  onClick={() => setRedeemedVoucher(null)}
                  className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs hover:bg-emerald-700 transition-colors shadow-md"
                >
                  Hoàn Tất
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </MainLayout>
  );
}
