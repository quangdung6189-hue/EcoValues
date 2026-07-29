import { useState } from "react";
import { Link } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Recycle, 
  TreePine, 
  Users, 
  TrendingUp, 
  Activity,
  Award,
  Leaf,
  BarChart3,
  AreaChart as AreaChartIcon,
  Sparkles
} from "lucide-react";
import heroCampusUrl from "@assets/generated_images/hero-campus.jpg";
import { useQuery } from "@tanstack/react-query";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + (Number(entry.value) || 0), 0);
    const isFuture = total === 0;

    return (
      <div className="bg-card/95 border border-border p-4 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-2.5 min-w-[190px]">
        <div className="flex justify-between items-center border-b border-border/60 pb-2">
          <span className="font-black text-foreground text-sm">Thứ {label}</span>
          <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] border ${
            isFuture 
              ? 'bg-secondary text-muted-foreground border-border' 
              : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
          }`}>
            {isFuture ? 'Chưa tới ngày' : `Tổng: ${total.toFixed(1)} kg`}
          </span>
        </div>
        {!isFuture ? (
          <div className="space-y-1.5 font-medium">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.fill || entry.color }}></span>
                  {entry.name}:
                </span>
                <span className="font-bold text-foreground font-mono">{entry.value} kg</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground font-medium">Dữ liệu sẽ tự động cập nhật theo thời gian thực khi tới ngày này.</p>
        )}
      </div>
    );
  }
  return null;
};

const defaultStats = [
  { label: "Rác đã tái chế", value: "48.5 kg", icon: Recycle, delay: 0.1 },
  { label: "Sinh viên tham gia", value: "20", icon: Users, delay: 0.2 },
  { label: "Trạm thu gom", value: "3", icon: TreePine, delay: 0.3 },
  { label: "Tỷ lệ phân loại đúng", value: "94%", icon: TrendingUp, delay: 0.4 },
];

const progressData = [
  { name: "Đã đạt", value: 85, color: "hsl(var(--primary))" },
  { name: "Còn lại", value: 15, color: "hsl(var(--muted))" },
];

const paperProgressData = [
  { name: "Đã đạt", value: 92, color: "hsl(var(--accent))" },
  { name: "Còn lại", value: 8, color: "hsl(var(--muted))" },
];

// Dynamically generate weekly data up to current day of the week (e.g. Thursday T5)
// Future days in current week (T6, T7, CN) remain at 0 because today has not passed them yet!
const getWeeklyData = () => {
  const jsDay = new Date().getDay(); // 0: CN, 1: T2, 2: T3, 3: T4, 4: T5, 5: T6, 6: T7
  const currentWeekDay = jsDay === 0 ? 7 : jsDay; // 1 (T2) to 7 (CN)

  const rawWeekly = [
    { name: "T2", nhua: 6.5, giay: 8.0, dienTu: 1.0, dayNum: 1 },
    { name: "T3", nhua: 8.2, giay: 7.5, dienTu: 0.5, dayNum: 2 },
    { name: "T4", nhua: 7.0, giay: 9.2, dienTu: 1.2, dayNum: 3 },
    { name: "T5", nhua: 9.5, giay: 6.8, dienTu: 0.8, dayNum: 4 }, // Today (Thursday)
    { name: "T6", nhua: 0, giay: 0, dienTu: 0, dayNum: 5 },
    { name: "T7", nhua: 0, giay: 0, dienTu: 0, dayNum: 6 },
    { name: "CN", nhua: 0, giay: 0, dienTu: 0, dayNum: 7 },
  ];

  return rawWeekly.map(d => {
    if (d.dayNum > currentWeekDay) {
      return { name: d.name, nhua: 0, giay: 0, dienTu: 0 };
    }
    return d;
  });
};

const weeklyData = getWeeklyData();

const activities = [
  { id: 1, user: "Nguyễn Minh Anh", action: "đã đóng góp 5kg giấy", time: "10 phút trước", type: "paper" },
  { id: 2, user: "Trần Đức Hùng", action: "đã phân loại 20 chai nhựa", time: "35 phút trước", type: "plastic" },
  { id: 3, user: "Nhóm Tình Nguyện Tòa A", action: "đã dọn dẹp trạm Thư Viện", time: "2 giờ trước", type: "team" },
  { id: 4, user: "Lê Thị Mai", action: "đã đạt danh hiệu Đại Sứ Xanh", time: "5 giờ trước", type: "award" },
];

export default function Home() {
  const { isLoggedIn } = useAuth();
  const [chartMode, setChartMode] = useState<"stacked" | "area">("area");
  const { data: serverStats } = useQuery({
    queryKey: ['/api/stats'],
    queryFn: async () => {
      const res = await fetch('/api/stats');
      if (!res.ok) return null;
      return res.json();
    }
  });

  const stats = [
    { label: "Rác đã tái chế", value: serverStats?.totalRecycledFormatted || "48.5 kg", icon: Recycle, delay: 0.1 },
    { label: "Sinh viên tham gia", value: serverStats?.activeStudents ? `${serverStats.activeStudents}` : "20", icon: Users, delay: 0.2 },
    { label: "Trạm thu gom", value: serverStats?.totalStations ? `${serverStats.totalStations}` : "3", icon: TreePine, delay: 0.3 },
    { label: "Tỷ lệ phân loại đúng", value: serverStats?.accuracyRate ? `${serverStats.accuracyRate}%` : "94%", icon: TrendingUp, delay: 0.4 },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-foreground pb-20 md:pb-28">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroCampusUrl} 
            alt="CMC University Campus" 
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/60 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 mt-16 md:mt-20 pb-20 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 backdrop-blur-md mb-6"
            >
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold tracking-wide">Chiến dịch sinh viên CMC 2026</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight font-sans"
            >
              Sinh Viên Tái Chế <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Hành Động Xanh Vì Tương Lai
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Mỗi chai nhựa được phân loại, mỗi tờ giấy được tái chế là một bước tiến tới khuôn viên xanh không rác thải.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20"
            >
              <Link 
                href="/ban-do" 
                className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-white shadow-xl transition-all hover:bg-primary/90 hover:scale-105"
              >
                Tìm Trạm Gần Nhất
              </Link>
              <Link 
                href={isLoggedIn ? "/ca-nhan" : "/tham-gia"} 
                className="w-full sm:w-auto inline-flex h-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-md border border-white/30 px-8 text-base font-bold text-white shadow-xl transition-all hover:bg-white/25 hover:scale-105"
              >
                {isLoggedIn ? "👤 Vào Trang Cá Nhân ➔" : "Trở Thành Tình Nguyện Viên"}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-[0] pointer-events-none z-0">
          <svg className="relative block w-full h-[50px] md:h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.08,130.83,120.47,192.39,109.85Z" className="fill-background"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background relative -mt-10 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: stat.delay }}
                className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all hover:border-primary/30"
              >
                <div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-black font-mono text-foreground tracking-tight mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Progress & Charts Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sans tracking-tight">Mục Tiêu Xanh 2026</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tiến độ thực hiện cam kết phát triển bền vững của cộng đồng sinh viên CMC University.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Progress Plastic */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col items-center text-center"
            >
              <h3 className="text-xl font-bold mb-2">Tái Chế Nhựa</h3>
              <p className="text-sm text-muted-foreground mb-6">Mục tiêu: Thu gom 100% rác thải nhựa tại các tòa nhà.</p>
              <div className="w-full h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-black font-mono text-primary">85%</span>
                </div>
              </div>
            </motion.div>

            {/* Progress Paper */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col items-center text-center"
            >
              <h3 className="text-xl font-bold mb-2">Tái Chế Giấy</h3>
              <p className="text-sm text-muted-foreground mb-6">Mục tiêu: Không lãng phí giấy in tại thư viện & phòng học.</p>
              <div className="w-full h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paperProgressData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      stroke="none"
                    >
                      {paperProgressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-black font-mono text-accent">92%</span>
                </div>
              </div>
            </motion.div>

            {/* Commitment */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-primary text-primary-foreground rounded-3xl p-8 border border-primary-foreground/10 shadow-lg flex flex-col justify-center"
            >
              <Award className="w-12 h-12 mb-6 opacity-80" />
              <h3 className="text-2xl font-bold mb-4 leading-tight">Cam Kết Sinh Viên</h3>
              <p className="text-primary-foreground/80 mb-8 flex-1">
                100% sinh viên tham gia khóa học định hướng xanh. Đã có 20 sinh viên tiên phong hoàn thành chứng chỉ.
              </p>
              <div className="w-full bg-primary-foreground/20 rounded-full h-3 mb-2">
                <div className="bg-white h-3 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between text-sm font-semibold text-primary-foreground/90">
                <span>Tiến độ</span>
                <span>45%</span>
              </div>
            </motion.div>
          </div>

          {/* Upgraded Modern Chart Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-xl space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl md:text-2xl font-black text-foreground font-sans tracking-tight">Khối Lượng Thu Gom Tuần Này</h3>
                  <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                    +14.2% tuần này
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Đơn vị đo: Kilogram (Kg) • Cập nhật tự động theo ngày</p>
              </div>

              {/* Chart Mode Switcher & Category Legends */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-3 text-xs font-bold bg-secondary/50 p-2 rounded-2xl border border-border">
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>Nhựa</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-teal-500"></div>Giấy</div>
                  <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>Điện tử</div>
                </div>

                <div className="flex bg-secondary p-1 rounded-2xl border border-border">
                  <button
                    onClick={() => setChartMode("area")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      chartMode === 'area' ? 'bg-emerald-600 text-white shadow-md' : 'text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <AreaChartIcon className="w-3.5 h-3.5" /> Xu Hướng
                  </button>
                  <button
                    onClick={() => setChartMode("stacked")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      chartMode === 'stacked' ? 'bg-emerald-600 text-white shadow-md' : 'text-muted-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Biểu Đồ Cột
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full h-[320px] md:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === "area" ? (
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorNhuaArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="colorGiayArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="colorDienTuArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="nhua" name="Nhựa" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorNhuaArea)" stackId="1" />
                    <Area type="monotone" dataKey="giay" name="Giấy" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorGiayArea)" stackId="1" />
                    <Area type="monotone" dataKey="dienTu" name="Điện tử" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorDienTuArea)" stackId="1" />
                  </AreaChart>
                ) : (
                  <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorNhuaBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981"/>
                        <stop offset="100%" stopColor="#059669"/>
                      </linearGradient>
                      <linearGradient id="colorGiayBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14b8a6"/>
                        <stop offset="100%" stopColor="#0d9488"/>
                      </linearGradient>
                      <linearGradient id="colorDienTuBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f59e0b"/>
                        <stop offset="100%" stopColor="#d97706"/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="nhua" name="Nhựa" fill="url(#colorNhuaBar)" radius={[6, 6, 0, 0]} stackId="a" />
                    <Bar dataKey="giay" name="Giấy" fill="url(#colorGiayBar)" radius={[6, 6, 0, 0]} stackId="a" />
                    <Bar dataKey="dienTu" name="Điện tử" fill="url(#colorDienTuBar)" radius={[6, 6, 0, 0]} stackId="a" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works & Activity */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* How it works */}
            <div>
              <h2 className="text-3xl font-bold mb-8 font-sans tracking-tight">Hành Động Của Bạn</h2>
              <div className="space-y-8">
                {[
                  { title: "Phân Loại Rác", desc: "Tách riêng nhựa, giấy và rác thải điện tử vào đúng thùng chứa chuyên dụng.", icon: Activity },
                  { title: "Ghi Nhận Đóng Góp", desc: "Quét mã QR tại trạm để hệ thống tự động cộng Điểm Xanh vào tài khoản.", icon: Award },
                  { title: "Đổi Quà Tái Chế", desc: "Sử dụng Điểm Xanh để đổi lấy các vật phẩm thân thiện môi trường từ dự án.", icon: TreePine },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 group"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <item.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/giai-phap" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                  Tìm hiểu thêm về giải pháp <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Live Activity Feed */}
            <div>
              <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold">Hoạt Động Mới Nhất</h2>
                  <span className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    Trực tiếp
                  </span>
                </div>
                
                <div className="space-y-6">
                  {activities.map((activity, i) => (
                    <motion.div 
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 pb-6 border-b border-border/50 last:border-0 last:pb-0"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white ${
                        activity.type === 'paper' ? 'bg-accent' : 
                        activity.type === 'plastic' ? 'bg-primary' :
                        activity.type === 'team' ? 'bg-purple-500' : 'bg-yellow-500'
                      }`}>
                        {activity.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground">
                          <span className="font-bold">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight"
          >
            Sẵn Sàng Hành Động?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto"
          >
            Gia nhập mạng lưới hơn 800 sinh viên tiên phong bảo vệ môi trường ngay hôm nay.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              href="/tham-gia" 
              className="inline-flex h-14 items-center justify-center rounded-full bg-white px-10 text-lg font-bold text-primary shadow-xl transition-all hover:bg-white/90 hover:scale-105"
            >
              Đăng Ký Tham Gia
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
}
