import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Recycle, 
  Truck, 
  Factory, 
  ArrowRight,
  Droplets,
  ScrollText,
  Battery,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Gift,
  RefreshCw,
  Cpu,
  Layers,
  ChevronRight,
  Zap
} from "lucide-react";

const PROCESS_STEPS = [
  {
    step: "01",
    id: "sorting",
    title: "Phân Loại Tại Trạm AI",
    subtitle: "Sinh viên phân loại & nhận Điểm Xanh",
    icon: Recycle,
    badge: "Bước 1 - Phân loại",
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    desc: "14 Trạm thu gom thông minh phủ sóng 2 cơ sở (Duy Tân & Hà Đông). Rác được cảm biến phân loại chính xác thành 4 dòng rác riêng biệt.",
    details: [
      "Tích +20 điểm xanh tức thì khi phân loại chai nhựa/lon nhôm",
      "Phân tách riêng rác điện tử nguy hại (pin, dây cáp cũ)",
      "Màn hình OLED và cảm biến trọng lượng đo độ chính xác 96%"
    ],
    metric: "14 Trạm Phủ Sóng",
    submetric: "Cơ sở 1 & Cơ sở 2"
  },
  {
    step: "02",
    id: "collection",
    title: "Thu Gom & Vận Chuyển IoT",
    subtitle: "Tối ưu xe gom rác lúc 16:00 hàng ngày",
    icon: Truck,
    badge: "Bước 2 - Thu gom",
    color: "from-teal-500 to-cyan-600",
    bgColor: "bg-teal-500/10 text-teal-600 border-teal-500/20",
    desc: "Đội tình nguyện viên EcoValues theo dõi dung lượng trạm qua ứng dụng. Khi trạm báo sắp đầy (>=85%), xe chuyên dụng lập tức xuất phát.",
    details: [
      "Bản đồ điều hướng thông minh ưu tiên trạm sắp đầy",
      "Vận chuyển về Kho tập kết trung tâm đảm bảo vệ sinh",
      "Giảm 40% chi phí nhiên liệu & thời gian di chuyển"
    ],
    metric: "< 15 Phút",
    submetric: "Thời gian xử lý báo dọn"
  },
  {
    step: "03",
    id: "processing",
    title: "Xử Lý & Ép Hạt Tái Chế",
    subtitle: "Nghiền ép hạt nhựa tại nhà máy xanh",
    icon: Factory,
    badge: "Bước 3 - Xử lý",
    color: "from-blue-600 to-indigo-600",
    bgColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    desc: "Nguồn rác sạch từ sinh viên được chuyển tới đối tác tái chế chuyên nghiệp. Nhựa PET được băm nhỏ thành hạt nhựa, giấy ép bột sản xuất vở.",
    details: [
      "Nhựa PET/HDPE được băm hạt nhựa tái sinh tinh khiết",
      "Giấy in & carton ép bột sản xuất giấy tái chế 100%",
      "Không xả thải bẩn ra môi trường xung quanh"
    ],
    metric: "100% Nguyên Liệu",
    submetric: "Đạt chuẩn tái sinh"
  },
  {
    step: "04",
    id: "rewards",
    title: "Sản Phẩm Tái Sinh & Quà Tặng",
    subtitle: "Vòng tuần hoàn trao lại sinh viên",
    icon: Gift,
    badge: "Bước 4 - Khép kín",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    desc: "Hạt nhựa và giấy tái chế được sản xuất thành bình nước Eco, túi vải Canvas, sổ tay. Sinh viên dùng Điểm Xanh đã tích lũy để đổi thưởng.",
    details: [
      "Đổi Voucher Căng tin, Túi Canvas EcoValues & Bình giữ nhiệt",
      "Cấp Giấy chứng nhận Đại sứ Xanh hoạt động xã hội",
      "Khép kín hoàn toàn chuỗi giá trị môi trường tại CMC"
    ],
    metric: "2.8 Tấn Rác",
    submetric: "Đã biến thành quà tặng"
  }
];

export default function Solutions() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <MainLayout>
      <div className="bg-background min-h-screen pb-24">
        
        {/* Hero Section */}
        <section className="bg-foreground text-background py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
          
          <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" /> Mô Hình Zero-Waste Đột Phá
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-5 tracking-tight text-white font-sans leading-tight max-w-5xl mx-auto space-y-2"
            >
              <span className="block text-white">Vòng Đời Tái Chế Khép Kín EcoValues</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Từ Thùng Rác Đến Sản Phẩm Tái Sinh
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm md:text-base text-background/80 leading-relaxed max-w-xl mx-auto font-medium"
            >
              Quy trình tái chế 4 bước minh bạch giúp biến rác thải học đường thành tài nguyên trao lại cho cộng đồng sinh viên.
            </motion.p>
          </div>
        </section>

        {/* Unique Dynamic Flowchart Section */}
        <section className="py-20 container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center justify-center gap-2">
              <Layers className="w-7 h-7 text-emerald-600" /> Quy Trình Khép Kín 4 Giai Đoạn
            </h2>
            <p className="text-muted-foreground text-sm max-w-xl mx-auto">
              Nhấp vào từng giai đoạn bên dưới để khám phá sơ đồ tương tác và thông số kỹ thuật chi tiết
            </p>
          </div>

          {/* Interactive Flowchart Diagram Container */}
          <div className="bg-card border border-border/80 rounded-3xl p-6 md:p-10 shadow-2xl space-y-12 relative overflow-hidden">
            
            {/* Background Glow Node Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

            {/* Top Process Flow Pipeline Nodes (Desktop & Mobile) */}
            <div className="relative z-10">
              
              {/* Horizontal Connecting Pipe (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-12 right-12 h-1.5 bg-secondary -translate-y-1/2 rounded-full overflow-hidden z-0">
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500 transition-all duration-500"
                  style={{ width: `${((activeStep + 1) / PROCESS_STEPS.length) * 100}%` }}
                />
              </div>

              {/* 4 Step Node Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 relative z-10 items-stretch">
                {PROCESS_STEPS.map((step, index) => {
                  const isActive = activeStep === index;
                  const StepIcon = step.icon;

                  return (
                    <motion.div
                      key={step.id}
                      onClick={() => setActiveStep(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`cursor-pointer p-5 rounded-3xl border transition-all duration-300 flex flex-col items-center justify-between text-center relative ${
                        isActive 
                          ? 'bg-card border-emerald-500 shadow-2xl ring-4 ring-emerald-500/20 z-20' 
                          : 'bg-secondary/40 border-border hover:border-emerald-500/40 hover:bg-card/80 z-10 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {/* Step Number Tag */}
                      <span className={`absolute -top-3 px-3 py-0.5 rounded-full text-[10px] font-black font-mono shadow-md ${
                        isActive ? 'bg-emerald-600 text-white' : 'bg-secondary text-muted-foreground border border-border'
                      }`}>
                        STEP {step.step}
                      </span>

                      {/* Icon Circle */}
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mt-2 mb-3 transition-all duration-300 shadow-md ${
                        isActive 
                          ? `bg-gradient-to-br ${step.color} text-white scale-105 shadow-emerald-500/30` 
                          : 'bg-background text-muted-foreground border border-border'
                      }`}>
                        <StepIcon className="w-7 h-7" />
                      </div>

                      <div className="space-y-1 mb-2">
                        <h3 className={`font-black text-xs sm:text-sm ${isActive ? 'text-foreground font-extrabold' : 'text-foreground/80'}`}>
                          {step.title}
                        </h3>
                        <p className="text-[11px] text-muted-foreground leading-snug min-h-[32px] flex items-center justify-center">
                          {step.subtitle}
                        </p>
                      </div>

                      {/* Active Pill Indicator */}
                      {isActive && (
                        <motion.div 
                          layoutId="activePill"
                          className="w-8 h-1 bg-emerald-500 rounded-full shadow-md mt-1"
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Active Step Detailed Inspector Box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-secondary/30 border border-border rounded-3xl p-6 md:p-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center"
              >
                {/* Left Col: Step Info */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${PROCESS_STEPS[activeStep].bgColor}`}>
                      {PROCESS_STEPS[activeStep].badge}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">Quy trình tự động hóa EcoValues</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-foreground font-sans">
                    {PROCESS_STEPS[activeStep].title}
                  </h3>

                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">
                    {PROCESS_STEPS[activeStep].desc}
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {PROCESS_STEPS[activeStep].details.map((detail, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs md:text-sm font-semibold text-foreground">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Col: Metric Badge Box */}
                <div className="bg-card border border-border p-6 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-1">
                    <Zap className="w-6 h-6" />
                  </div>
                  
                  <div>
                    <p className="text-2xl md:text-3xl font-black font-mono text-emerald-600">
                      {PROCESS_STEPS[activeStep].metric}
                    </p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">
                      {PROCESS_STEPS[activeStep].submetric}
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % PROCESS_STEPS.length)}
                    className="w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-md mt-2"
                  >
                    Xem Bước Tiếp Theo <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </section>

        {/* Accepted Waste Categories */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-3">Các Dòng Rác Thu Gom Phân Loại</h2>
              <p className="text-muted-foreground text-sm">Chúng tôi tập trung vào 3 nhóm rác thải phổ biến nhất tại 2 cơ sở CMC để đạt tỷ lệ tái chế vượt 85%.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                whileHover={{ y: -6 }}
                className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-4"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Droplets className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold">Nhựa PET & Lon Nhôm</h3>
                <ul className="space-y-2.5 text-xs md:text-sm text-muted-foreground font-medium">
                  <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Chai nước suối, trà sữa rửa sạch</li>
                  <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> Lon nước ngọt, chai rỗng</li>
                  <li className="flex gap-2.5 text-rose-500"><AlertCircle className="w-4 h-4 shrink-0" /> Không nhận hộp xốp thức ăn dính mỡ</li>
                </ul>
              </motion.div>

              <motion.div 
                whileHover={{ y: -6 }}
                className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-4"
              >
                <div className="w-14 h-14 bg-teal-500/10 rounded-2xl flex items-center justify-center text-teal-600">
                  <ScrollText className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold">Giấy In & Bìa Carton</h3>
                <ul className="space-y-2.5 text-xs md:text-sm text-muted-foreground font-medium">
                  <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" /> Giấy A4 hỏng, sách tài liệu cũ</li>
                  <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" /> Bìa carton gói hàng khô</li>
                  <li className="flex gap-2.5 text-rose-500"><AlertCircle className="w-4 h-4 shrink-0" /> Không nhận giấy ướt, dính chất lỏng</li>
                </ul>
              </motion.div>

              <motion.div 
                whileHover={{ y: -6 }}
                className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-4"
              >
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                  <Battery className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold">Rác Điện Tử & Pin Cũ</h3>
                <ul className="space-y-2.5 text-xs md:text-sm text-muted-foreground font-medium">
                  <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /> Pin AA/AAA, pin máy tính</li>
                  <li className="flex gap-2.5"><CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" /> Dây sạc, tai nghe, linh kiện hỏng</li>
                  <li className="flex gap-2.5 text-rose-500"><AlertCircle className="w-4 h-4 shrink-0" /> Không nhận ắc quy và màn hình vỡ</li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Hiệu Quả Dự Án</h2>
            <p className="text-muted-foreground text-sm">So sánh hệ thống EcoValues với mô hình thu gom rác truyền thống</p>
          </div>

          <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-xl">
            <div className="grid grid-cols-3 bg-secondary/60 p-5 border-b border-border font-bold text-xs uppercase tracking-wider">
              <div>Tiêu Chí</div>
              <div className="text-muted-foreground text-center">Trước Đây</div>
              <div className="text-emerald-600 text-center">Với EcoValues</div>
            </div>
            
            {[
              { label: "Phân loại tại nguồn", before: "Bỏ chung 1 thùng", after: "4 dòng rác phân tách chuẩn" },
              { label: "Tỷ lệ tái chế thực tế", before: "Dưới 15%", after: "Đạt vượt 86.4%" },
              { label: "Quyền lợi sinh viên", before: "Không có", after: "Tích Điểm Xanh đổi quà" },
              { label: "Giám sát trạm rác", before: "Thủ công", after: "Bản đồ GPS & Sensor 3s/lần" },
              { label: "Chu trình sản phẩm", before: "Chôn lấp rác", after: "100% Khép kín tái sinh" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-3 p-5 border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors text-xs md:text-sm">
                <div className="font-bold text-foreground flex items-center">{row.label}</div>
                <div className="text-muted-foreground text-center flex items-center justify-center">{row.before}</div>
                <div className="text-emerald-600 font-bold text-center flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5 shrink-0" />
                  {row.after}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </MainLayout>
  );
}
