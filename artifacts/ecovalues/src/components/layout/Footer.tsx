import { Link } from "wouter";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group inline-flex">
              <div className="bg-primary p-2 rounded-xl">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none tracking-tight">EcoValues</span>
                <span className="text-[10px] uppercase font-semibold text-primary-foreground/80 tracking-wider">Hành Động Xanh</span>
              </div>
            </Link>
            <p className="text-sm text-background/70 max-w-xs leading-relaxed">
              Dự án sáng kiến xanh từ sinh viên CMC University, hướng tới mục tiêu khuôn viên không rác thải vào năm 2026.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li><Link href="/ban-do" className="text-sm text-background/70 hover:text-primary transition-colors">Bản đồ Trạm</Link></li>
              <li><Link href="/giai-phap" className="text-sm text-background/70 hover:text-primary transition-colors">Giải pháp của chúng tôi</Link></li>
              <li><Link href="/tich-diem" className="text-sm text-background/70 hover:text-primary transition-colors">Bảng xếp hạng</Link></li>
              <li><Link href="/ke-hoach" className="text-sm text-background/70 hover:text-primary transition-colors">Lộ trình dự án</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Thông tin</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-background/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span>Cơ sở chính CMC University, Hà Nội</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="h-4 w-4 text-primary" />
                <span>hello@ecovalues.vn</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="h-4 w-4 text-primary" />
                <span>024 1234 5678</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Tham gia cùng chúng tôi</h3>
            <p className="text-sm text-background/70 mb-4">
              Bạn muốn trở thành đại sứ xanh hoặc trạm trưởng?
            </p>
            <Link
              href="/tham-gia"
              className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Đăng Ký Ngay
            </Link>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © 2026 EcoValues. Dự án phi lợi nhuận của sinh viên.
          </p>
          <div className="flex gap-4">
            <span className="text-sm text-background/50 hover:text-background cursor-pointer transition-colors">Chính sách bảo mật</span>
            <span className="text-sm text-background/50 hover:text-background cursor-pointer transition-colors">Điều khoản</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
