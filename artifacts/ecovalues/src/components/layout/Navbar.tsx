import { Link, useLocation } from "wouter";
import { Leaf, Menu, X, User, LogOut, Lock, Award, Sparkles, Bell, Check, Gift, Zap, Trophy, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  // Notification State
  const [showNotifPopover, setShowNotifPopover] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  // Generate 100% Dynamic Notifications per Logged in User
  const getDynamicNotifications = () => {
    if (!user) return [];
    
    const pts = user.points;
    let rankNotif = {
      id: 1,
      title: "🎉 Chào Mừng Hạng Đồng 🥉",
      desc: `Bạn bắt đầu với +${pts} pt thưởng ban đầu. Hãy tích điểm để lên Hạng Bạc!`,
      time: "Vừa xong",
      read: false,
      icon: Sparkles,
      color: "text-amber-600 bg-amber-500/10"
    };

    if (pts >= 3000) {
      rankNotif = {
        id: 1,
        title: "👑 Đạt Hạng VIP Huyền Thoại!",
        desc: "Bạn đã mở khóa tất cả đặc quyền vinh danh Top Campus CMC.",
        time: "Vừa xong",
        read: false,
        icon: Trophy,
        color: "text-purple-600 bg-purple-500/10"
      };
    } else if (pts >= 1500) {
      rankNotif = {
        id: 1,
        title: "💎 Đạt Hạng Kim Cương!",
        desc: "Mở khóa X2 điểm thưởng thu gom rác AI tại trạm.",
        time: "Vừa xong",
        read: false,
        icon: Trophy,
        color: "text-cyan-600 bg-cyan-500/10"
      };
    } else if (pts >= 1000) {
      rankNotif = {
        id: 1,
        title: "🥇 Đạt Hạng Vàng!",
        desc: "Mở khóa Giấy chứng nhận Tình nguyện viên & đổi bình nước tre Eco.",
        time: "Vừa xong",
        read: false,
        icon: Award,
        color: "text-amber-500 bg-amber-500/10"
      };
    } else if (pts >= 500) {
      rankNotif = {
        id: 1,
        title: "🥈 Đạt Hạng Bạc!",
        desc: "Nhận ưu đãi giảm 5% giá đổi quà tặng trên toàn hệ thống.",
        time: "Vừa xong",
        read: false,
        icon: Award,
        color: "text-slate-500 bg-slate-500/10"
      };
    }

    return [
      rankNotif,
      {
        id: 2,
        title: "🎁 Cửa Hàng Đổi Quà Mới Cập Nhật",
        desc: "Bổ sung Voucher Highlands 100k, Áo thun Eco & Balo tre cao cấp.",
        time: "Hôm nay",
        read: false,
        icon: Gift,
        color: "text-emerald-600 bg-emerald-500/10"
      },
      {
        id: 3,
        title: "⚡ Trạm Thu Gom CS1 & CS2 Đã Hoạt Động",
        desc: "14 trạm phân loại rác thông minh sẵn sàng tiếp nhận tích điểm.",
        time: "Hôm nay",
        read: false,
        icon: Zap,
        color: "text-rose-500 bg-rose-500/10"
      }
    ];
  };

  const userNotifications = getDynamicNotifications();

  const handleMarkAllRead = () => {
    setUnreadCount(0);
  };

  const NAV_LINKS = [
    { href: "/", label: "Trang Chủ" },
    { href: "/ban-do", label: "Bản Đồ" },
    { href: "/giai-phap", label: "Giải Pháp" },
    { href: "/ke-hoach", label: "Kế Hoạch" },
    { href: "/tram-ho-tro", label: "Trạm Hỗ Trợ" },
    { href: "/tich-diem", label: "Tích Điểm Xanh" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-500/10 p-2 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
            <Leaf className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none text-foreground tracking-tight">EcoValues</span>
            <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Hành Động Xanh</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
              className={cn(
                "text-sm font-medium transition-colors hover:text-emerald-600",
                location === link.href ? "text-emerald-600 font-bold" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Auth & Notifications Section */}
        <div className="hidden md:flex items-center gap-3 relative">
          
          {/* Notification Bell Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifPopover(!showNotifPopover);
                if (unreadCount > 0 && isLoggedIn) setUnreadCount(0);
              }}
              title="Thông báo EcoValues"
              className="p-2 rounded-full bg-secondary hover:bg-secondary/80 text-foreground border border-border transition-all relative active:scale-95"
            >
              <Bell className="w-4 h-4 text-emerald-600" />
              {isLoggedIn && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse border-2 border-background">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {showNotifPopover && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-border rounded-3xl shadow-2xl p-4 z-50 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-border pb-2.5">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <h4 className="font-extrabold text-sm text-foreground">Thông Báo Mới</h4>
                  </div>
                  {isLoggedIn && (
                    <button 
                      onClick={handleMarkAllRead} 
                      className="text-[11px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Đánh dấu đã đọc
                    </button>
                  )}
                </div>

                {isLoggedIn && user ? (
                  <>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                      {userNotifications.map((n) => (
                        <div 
                          key={n.id} 
                          className={`p-3 rounded-2xl border text-xs flex gap-3 transition-all ${
                            !n.read ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-secondary/40 border-border opacity-75'
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                            <n.icon className="w-4 h-4" />
                          </div>
                          <div className="space-y-0.5 flex-1">
                            <p className="font-bold text-foreground leading-snug">{n.title}</p>
                            <p className="text-muted-foreground text-[11px]">{n.desc}</p>
                            <span className="text-[10px] text-emerald-600 font-medium block pt-0.5">{n.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-1 text-center border-t border-border">
                      <Link 
                        href="/ca-nhan" 
                        onClick={() => setShowNotifPopover(false)}
                        className="text-xs font-bold text-emerald-600 hover:underline block"
                      >
                        Xem lịch sử tài khoản ➔
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                      <Lock className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-foreground">Bạn chưa đăng nhập tài khoản</p>
                    <p className="text-[11px] text-muted-foreground">Đăng nhập để nhận thông báo tích điểm, sự kiện và ưu đãi cá nhân.</p>
                    <Link 
                      href="/tham-gia?mode=login"
                      onClick={() => setShowNotifPopover(false)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow block text-center transition-all active:scale-95"
                    >
                      🔑 Đăng Nhập Ngay ➔
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          {isLoggedIn && user ? (
            <Link
              href="/ca-nhan"
              title="Vào Trang Cá Nhân"
              className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 p-1.5 pl-3.5 rounded-full transition-all group cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground leading-tight group-hover:text-emerald-600 transition-colors">{user.name}</span>
                <span className="text-[10px] text-emerald-600 font-mono font-black">{user.points} pt</span>
              </div>
              <div className="p-1.5 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-full transition-colors shadow-sm">
                <User className="w-3.5 h-3.5" />
              </div>
            </Link>
          ) : (
            <Link
              href="/tham-gia"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white shadow hover:bg-emerald-700 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Đăng Nhập / Đăng Ký
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="flex flex-col p-4 space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium p-2 rounded-md transition-colors",
                  location === link.href ? "bg-emerald-500/10 text-emerald-600 font-bold" : "text-muted-foreground hover:bg-muted"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn && user ? (
              <Link
                href="/ca-nhan"
                onClick={() => setMobileMenuOpen(false)}
                className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex justify-between items-center group cursor-pointer"
              >
                <div>
                  <p className="font-bold text-xs text-foreground group-hover:text-emerald-600 transition-colors">👤 {user.name}</p>
                  <p className="text-xs text-emerald-600 font-mono font-black">{user.points} điểm xanh ➔ Vào Hồ Sơ</p>
                </div>
                <div className="p-1.5 bg-emerald-600 text-white rounded-full">
                  <User className="w-4 h-4" />
                </div>
              </Link>
            ) : (
              <Link
                href="/tham-gia"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-bold text-white shadow hover:bg-emerald-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Lock className="w-4 h-4" /> Đăng Nhập / Đăng Ký
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
