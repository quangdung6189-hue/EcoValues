import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Award, 
  Sparkles, 
  PlusCircle, 
  CheckCircle, 
  Upload, 
  Lock, 
  UserCheck, 
  User, 
  Hash, 
  Check, 
  ArrowRight, 
  Smartphone, 
  GraduationCap, 
  Building, 
  ShieldAlert, 
  Gift, 
  Ticket, 
  Camera, 
  X,
  Coffee,
  Droplet,
  ShoppingBag,
  BookOpen,
  Utensils,
  Calendar,
  Clock,
  Flame,
  Zap
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

interface UserLeaderboard {
  id: number;
  rank: number;
  name: string;
  major: string;
  points: number;
  itemsRecycled: number;
}

interface Reward {
  id: string;
  title: string;
  category: string;
  pointsCost: number;
  stock: number;
  description: string;
  iconName: string;
}

export default function GreenPoints() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, isLoggedIn, login, logout, updatePoints, isEmailRegistered, registerUserAccount } = useAuth();

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  
  // Registration Stepper (3-step pipeline)
  const [authStep, setAuthStep] = useState(1);
  const [authName, setAuthName] = useState("");
  const [authAge, setAuthAge] = useState(20);
  const [authSchool, setAuthSchool] = useState("Đại học CMC");
  const [authPhone, setAuthPhone] = useState("");
  const [authRole, setAuthRole] = useState("student");
  const [authMajor, setAuthMajor] = useState("Công nghệ Thông tin");
  const [authVolunteerRole, setAuthVolunteerRole] = useState("Trực trạm phân loại");
  const [authPassword, setAuthPassword] = useState("");

  const [authStudentId, setAuthStudentId] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authOtpInput, setAuthOtpInput] = useState("");
  const [sentOtpCode, setSentOtpCode] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Claim Points Modal State
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [itemType, setItemType] = useState("Chai Nhựa & Vỏ Hộp (+15 pt/món)");
  const [quantity, setQuantity] = useState(5);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Leaderboard Time Filter State: "day" | "month" | "year"
  const [leaderboardFilter, setLeaderboardFilter] = useState<"day" | "month" | "year">("month");

  // Redeemed Voucher Modal State
  const [redeemedVoucher, setRedeemedVoucher] = useState<{ title: string; code: string } | null>(null);

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

  // Dynamic Leaderboard Generation based on Time Filter & Active Users
  const getDynamicLeaderboard = (): UserLeaderboard[] => {
    const activeUserName = user ? user.name : "Trần Hữu Toàn";
    const activeUserPoints = user ? user.points : 100;
    const activeUserStudentId = user ? user.studentId : "BIT250098";

    // Adjust points scale based on timeframe filter
    const scale = leaderboardFilter === "day" ? 0.2 : leaderboardFilter === "year" ? 3.5 : 1.0;

    let rawList = [
      { id: 1, name: activeUserName, major: `Mã SV: ${activeUserStudentId}`, points: activeUserPoints, itemsRecycled: Math.floor(activeUserPoints / 3) },
      { id: 2, name: "Nguyễn Minh Anh", major: "Quản trị Kinh doanh", points: Math.round(1450 * scale), itemsRecycled: Math.round(180 * scale) },
      { id: 3, name: "Lê Hoàng Nam", major: "Thiết kế Đồ họa", points: Math.round(1280 * scale), itemsRecycled: Math.round(155 * scale) },
      { id: 4, name: "Phạm Hải Yến", major: "Marketing Digital", points: Math.round(1120 * scale), itemsRecycled: Math.round(140 * scale) },
      { id: 5, name: "Trần Đức Mạnh", major: "Công nghệ Thông tin", points: Math.round(980 * scale), itemsRecycled: Math.round(115 * scale) },
      { id: 6, name: "Vũ Phương Thảo", major: "Ngôn ngữ Anh", points: Math.round(850 * scale), itemsRecycled: Math.round(95 * scale) },
      { id: 7, name: "Đỗ Gia Bảo", major: "Khoa học Máy tính", points: Math.round(720 * scale), itemsRecycled: Math.round(80 * scale) }
    ];

    // Sort descending by points
    rawList.sort((a, b) => b.points - a.points);

    // Assign rank 1..N
    return rawList.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
  };

  const leaderboard = getDynamicLeaderboard();

  // Rewards catalog data
  const rewards: Reward[] = [
    { id: "r1", title: "Voucher Highlands Coffee 100.000đ", category: "Voucher", pointsCost: 900, stock: 45, description: "Áp dụng cho toàn bộ đồ uống trên hệ thống Highlands Coffee toàn quốc.", iconName: "Coffee" },
    { id: "r2", title: "Tai Nghe Eco Wireless Bluetooth", category: "Quà Tặng", pointsCost: 2500, stock: 12, description: "Tai nghe chống ồn làm từ nhựa tái chế cao cấp thương hiệu EcoValues.", iconName: "Sparkles" },
    { id: "r3", title: "Áo Thun Đại Sứ Xanh EcoValues", category: "Thời Trang", pointsCost: 1800, stock: 20, description: "Áo thun cotton hữu cơ 100% in logo Đại sứ Xanh CMC.", iconName: "ShoppingBag" },
    { id: "r4", title: "Balo Chống Nước Tre Eco 20L", category: "Quà Tặng", pointsCost: 1500, stock: 15, description: "Balo thiết kế chống nước siêu bền làm từ xơ sợi tre tự nhiên.", iconName: "ShoppingBag" },
    { id: "r5", title: "Bình Giữ Nhiệt Inox Eco 750ml", category: "Dụng Cụ", pointsCost: 500, stock: 50, description: "Bình inox 304 giữ nhiệt 24h trang bị nắp bật thông minh.", iconName: "Droplet" },
    { id: "r6", title: "Voucher Căng Tin CMC 50.000đ", category: "Voucher", pointsCost: 400, stock: 80, description: "Giảm 50.000đ trực tiếp khi thanh toán suất ăn căng tin trường CMC.", iconName: "Utensils" }
  ];

  // Register final submission
  const handleRegisterSubmit = () => {
    const finalName = authName || "Thành Viên EcoValues";
    const finalStudentId = authStudentId.trim() || (authRole === "teacher" ? `GV-${Math.floor(100000 + Math.random() * 900000)}` : `CMC-${Math.floor(100000 + Math.random() * 900000)}`);

    if (isEmailRegistered(authEmail)) {
      toast({
        title: "Email Đã Tồn Tại ⚠️",
        description: `Hòm thư ${authEmail} đã được đăng ký tài khoản trước đó. Vui lòng chọn Đăng Nhập.`,
        variant: "destructive"
      });
      return;
    }

    const res = registerUserAccount(finalName, authEmail, finalStudentId, authMajor, authPassword, 100);
    if (!res.success) {
      toast({
        title: "Đăng Ký Thất Bại ⚠️",
        description: res.message,
        variant: "destructive"
      });
      return;
    }

    setShowAuthModal(false);

    toast({
      title: "Đăng Ký Thành Công! 🥉",
      description: `Chào mừng ${res.user?.name} đã gia nhập Đại Sứ Xanh. Bạn bắt đầu từ Hạng Đồng (+100 pt ban đầu).`,
    });
  };

  // Handle login submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalEmail = authEmail || "ecovalous@gmail.com";
    const finalStudentId = authStudentId || "CMC-251156";
    
    const loggedUser = login("Đặng Quang Dũng", finalEmail, finalStudentId, "Công nghệ Thông tin", 100);
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

  // Claim Points Mutation (Adjusted Rates + Guaranteed Safe Execution!)
  const claimMutation = useMutation({
    mutationFn: async () => {
      let rate = 15;
      if (itemType.includes("Chai Nhựa")) rate = 15;
      else if (itemType.includes("Giấy")) rate = 10;
      else if (itemType.includes("Kim Loại")) rate = 25;
      else if (itemType.includes("Điện Tử")) rate = 40;

      const earnedPoints = rate * quantity;
      const currentUserName = user?.name || "Thành Viên EcoValues";
      let newTotalPoints = (user?.points || 100) + earnedPoints;

      try {
        const res = await fetch('/api/points/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userName: currentUserName, itemType, quantity })
        });
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data && data.newTotalPoints) {
            newTotalPoints = data.newTotalPoints;
          }
        }
      } catch (e) {}

      return { earnedPoints, newTotalPoints };
    },
    onSuccess: (data) => {
      updatePoints(data.newTotalPoints);

      // Save transaction to user's private history
      if (user) {
        const txKey = `ecovalues_tx_${user.email}`;
        const savedTx = localStorage.getItem(txKey);
        let txList = savedTx ? JSON.parse(savedTx) : [];
        const newTx = {
          id: Date.now(),
          type: "plus",
          title: `Thu gom ${quantity} ${itemType}`,
          date: "Hôm nay, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          points: `+${data.earnedPoints} pt`
        };
        txList = [newTx, ...txList];
        localStorage.setItem(txKey, JSON.stringify(txList));
      }

      toast({
        title: "Tích Điểm Thành Công! 📸🎉",
        description: `Đã gửi minh chứng thu gom! Bạn nhận được +${data.earnedPoints} pt. Tổng điểm: ${data.newTotalPoints} pt.`,
      });
      setProofImage(null);
      setShowClaimModal(false);
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard'] });
    },
    onError: (err: any) => {
      toast({
        title: "Lỗi Tích Điểm ⚠️",
        description: err.message || "Vui lòng thử lại sau.",
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
      const targetReward = rewards.find(r => r.id === rewardId);
      const rewardTitle = targetReward ? targetReward.title : "Phần thưởng EcoValues";
      const rewardCost = targetReward ? targetReward.pointsCost : 300;
      const voucherCode = `ECO-${Math.floor(100000 + Math.random() * 900000)}`;

      try {
        const res = await fetch('/api/rewards/redeem', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rewardId, userName: user?.name || "Thành Viên" })
        });
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          return data;
        }
      } catch (e) {}

      return {
        rewardTitle,
        rewardCost,
        voucherCode,
        rewardId
      };
    },
    onSuccess: (data) => {
      setRedeemedVoucher({ title: data.rewardTitle, code: data.voucherCode });
      const targetReward = rewards.find(r => r.id === data.rewardId);
      const pointsCost = targetReward ? targetReward.pointsCost : (data.rewardCost || 300);

      if (user) {
        const newPoints = Math.max(0, user.points - pointsCost);
        updatePoints(newPoints);

        // Save voucher to user's myVouchers
        const vKey = `ecovalues_vouchers_${user.email}`;
        const savedV = localStorage.getItem(vKey);
        let vList = savedV ? JSON.parse(savedV) : [];
        const newVoucher = {
          id: Date.now(),
          title: data.rewardTitle,
          code: data.voucherCode,
          expiry: "30/09/2026",
          points: pointsCost
        };
        vList = [newVoucher, ...vList];
        localStorage.setItem(vKey, JSON.stringify(vList));

        // Save minus transaction
        const txKey = `ecovalues_tx_${user.email}`;
        const savedTx = localStorage.getItem(txKey);
        let txList = savedTx ? JSON.parse(savedTx) : [];
        const newTx = {
          id: Date.now(),
          type: "minus",
          title: `Đổi ${data.rewardTitle}`,
          date: "Hôm nay, " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          points: `-${pointsCost} pt`
        };
        txList = [newTx, ...txList];
        localStorage.setItem(txKey, JSON.stringify(txList));
      }

      toast({
        title: "Đổi Quà Thành Công! 🎁",
        description: `Mã quà tặng của bạn: ${data.voucherCode}`,
      });
    },
    onError: (err: any) => {
      toast({
        title: "Đổi Quà Thất Bại ⚠️",
        description: err.message || "Vui lòng kiểm tra lại điểm số.",
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-black text-foreground flex items-center gap-2.5 font-sans">
                    <Trophy className="w-7 h-7 text-amber-500 animate-pulse" /> Top Đại Sứ Xanh CMC
                  </h2>
                  
                  {/* Leaderboard Time Filter Tabs: Day / Month / Year */}
                  <div className="flex bg-secondary p-1 rounded-2xl border border-border shrink-0 self-start sm:self-auto">
                    {[
                      { key: "day", label: "Hôm Nay 📅" },
                      { key: "month", label: "Tháng Này 🏆" },
                      { key: "year", label: "Trong Năm 👑" }
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setLeaderboardFilter(tab.key as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          leaderboardFilter === tab.key
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
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

              {/* Ranks 4+ List Table */}
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="font-extrabold text-foreground text-sm uppercase tracking-wider text-muted-foreground">
                  Danh Sách Đại Sứ Xanh Tiêu Biểu #{leaderboardFilter === "day" ? "Hôm Nay" : leaderboardFilter === "year" ? "Trong Năm" : "Tháng Này"}
                </h3>
                <div className="space-y-2">
                  {remainingUsers.map((u) => (
                    <div 
                      key={u.id}
                      className="p-3.5 rounded-2xl bg-secondary/40 hover:bg-secondary border border-border/60 flex items-center justify-between transition-all"
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 font-extrabold text-xs flex items-center justify-center font-mono shrink-0">
                          #{u.rank}
                        </span>
                        <div>
                          <p className="font-bold text-foreground text-sm leading-tight">{u.name}</p>
                          <p className="text-[11px] text-muted-foreground">{u.major}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-600 text-sm font-mono">{u.points} pt</span>
                        <p className="text-[10px] text-muted-foreground font-semibold">{u.itemsRecycled} món rác</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: Rewards Store */}
            <div className="space-y-6">
              <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h2 className="text-xl font-black text-foreground flex items-center gap-2 font-sans">
                    <Gift className="w-5 h-5 text-emerald-600" /> Cửa Hàng Đổi Quà Xanh
                  </h2>
                  <p className="text-xs text-muted-foreground pt-0.5">Dùng điểm thưởng phân loại rác để nhận Voucher & Quà độc quyền</p>
                </div>

                <div className="space-y-4">
                  {rewards.map((r) => {
                    const IconComponent = getRewardIcon(r.iconName);
                    const canAfford = isLoggedIn && user && user.points >= r.pointsCost;

                    return (
                      <div 
                        key={r.id}
                        className="p-4 rounded-2xl border border-border bg-secondary/30 hover:border-emerald-500/40 transition-all space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="space-y-1 flex-1">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                              {r.category}
                            </span>
                            <h3 className="font-bold text-foreground text-sm leading-snug">{r.title}</h3>
                            <p className="text-[11px] text-muted-foreground leading-relaxed">{r.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/60">
                          <span className="font-black text-emerald-600 text-sm font-mono">
                            {r.pointsCost} pt
                          </span>
                          <button
                            onClick={() => handleRedeemReward(r)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                              canAfford 
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow'
                                : 'bg-secondary text-muted-foreground border border-border'
                            }`}
                          >
                            Đổi Quà ➔
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Claim Points Modal */}
        <AnimatePresence>
          {showClaimModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 md:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-xl">
                      <PlusCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-foreground">Tích Điểm Thu Gom Rác</h3>
                      <p className="text-xs text-muted-foreground">Tài khoản: <strong>{user?.name}</strong> ({user?.studentId})</p>
                    </div>
                  </div>
                  <button onClick={() => setShowClaimModal(false)} className="text-muted-foreground hover:text-foreground text-xs font-bold">✖</button>
                </div>

                {/* Form inputs */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Loại rác thu gom (*)</label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Chai Nhựa & Vỏ Hộp (+15 pt/món)">Chai Nhựa & Vỏ Hộp (+15 pt/món)</option>
                      <option value="Giấy & Carton (+10 pt/kg)">Giấy & Giấy Carton (+10 pt/kg)</option>
                      <option value="Kim Loại & Lon Nhôm (+25 pt/món)">Kim Loại & Lon Nhôm (+25 pt/món)</option>
                      <option value="Rác Điện Tử & Pin Cũ (+40 pt/món)">Rác Điện Tử & Pin Cũ (+40 pt/món)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">Số lượng / Khối lượng (*)</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-secondary border border-border rounded-xl text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Photo Proof Upload */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-foreground flex items-center justify-between">
                      <span>📸 Tải Ảnh / Chụp Ảnh Minh Chứng (*)</span>
                      {proofImage && <span className="text-emerald-600 text-[10px] font-bold">✓ Đã dính kèm ảnh</span>}
                    </label>

                    {isWebcamActive ? (
                      <div className="space-y-2">
                        <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-emerald-500 aspect-video">
                          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleCapturePhoto}
                            className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                          >
                            <Camera className="w-4 h-4" /> Chụp Ảnh Minh Chứng
                          </button>
                          <button
                            type="button"
                            onClick={handleStopWebcam}
                            className="px-3 py-2 bg-secondary text-foreground font-bold rounded-xl text-xs border border-border"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={handleStartWebcam}
                          className="p-3 bg-emerald-500/10 border-2 border-dashed border-emerald-500/40 rounded-2xl text-center hover:bg-emerald-500/20 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                        >
                          <Camera className="w-5 h-5 text-emerald-600" />
                          <span className="text-xs font-bold text-foreground">Chụp Ảnh Trực Tiếp</span>
                        </button>

                        <label className="p-3 bg-secondary/50 border-2 border-dashed border-border rounded-2xl text-center hover:border-emerald-500 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-xs font-bold text-foreground">Tải Ảnh Từ Máy</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => setProofImage(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}

                    {proofImage && !isWebcamActive && (
                      <div className="relative w-full h-32 rounded-2xl border border-emerald-500 overflow-hidden mt-2">
                        <img src={proofImage} alt="Proof" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setProofImage(null)}
                          className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full shadow"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Calculated Estimated Points */}
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex justify-between items-center text-xs">
                    <span className="font-bold text-foreground">Điểm thưởng ước tính:</span>
                    <span className="font-black text-emerald-600 font-mono text-base">
                      +{(itemType.includes("Chai Nhựa") ? 15 : itemType.includes("Giấy") ? 10 : itemType.includes("Kim Loại") ? 25 : 40) * quantity} pt
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => claimMutation.mutate()}
                  disabled={claimMutation.isPending}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 mt-2"
                >
                  {claimMutation.isPending ? "Đang xử lý..." : "Xác Nhận & Gửi Ảnh Thu Gom 🎉"}
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Redeemed Voucher Success Dialog */}
        <AnimatePresence>
          {redeemedVoucher && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-border p-6 rounded-3xl max-w-md w-full text-center space-y-4 shadow-2xl"
              >
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Gift className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-foreground">Đổi Quà Thành Công! 🎉</h3>
                <p className="text-xs text-muted-foreground">{redeemedVoucher.title}</p>
                <div className="p-4 bg-secondary border border-border rounded-2xl font-mono text-center">
                  <span className="text-xs text-muted-foreground block mb-1">MÃ VOUCHER CỦA BẠN:</span>
                  <span className="text-xl font-black text-emerald-600 tracking-widest">{redeemedVoucher.code}</span>
                </div>
                <button
                  onClick={() => setRedeemedVoucher(null)}
                  className="w-full py-3 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow"
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
