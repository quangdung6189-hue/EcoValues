import { Link, useLocation } from "wouter";
import { Leaf, Menu, X, User, LogOut, Lock, Award, Sparkles } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

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
              className={cn(
                "text-sm font-medium transition-colors hover:text-emerald-600",
                location === link.href ? "text-emerald-600 font-bold" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right Auth Section */}
        <div className="hidden md:flex items-center gap-3">
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
                  <p className="font-bold text-xs text-foreground group-hover:text-emerald-600 transition-colors">👤 {user.name} (Hội viên Vàng)</p>
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
