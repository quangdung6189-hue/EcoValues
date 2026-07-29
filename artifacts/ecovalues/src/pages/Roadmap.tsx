import { Link } from "wouter";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Check, Target, Clock, Star } from "lucide-react";

const MILESTONES = [
  {
    quarter: "Q1 / 2025",
    title: "Khởi tạo & Khảo sát",
    desc: "Thành lập đội ngũ cốt lõi, khảo sát thói quen xả rác của sinh viên và thiết kế mẫu trạm thu gom đầu tiên.",
    status: "completed",
    items: ["Khảo sát 2000 sinh viên", "Thiết kế trạm nguyên mẫu", "Được duyệt kinh phí giai đoạn 1"]
  },
  {
    quarter: "Q3 / 2025",
    title: "Lắp đặt Trạm Thí Điểm",
    desc: "Triển khai 5 trạm thu gom đầu tiên tại Tòa A và Thư viện. Bắt đầu chiến dịch truyền thông nhận diện.",
    status: "completed",
    items: ["Lắp đặt 5 trạm thông minh", "100 tình nguyện viên tiên phong", "Đạt 500kg rác tái chế đầu tiên"]
  },
  {
    quarter: "Q1 / 2026",
    title: "Tích hợp Ứng dụng Xanh",
    desc: "Ra mắt hệ thống Tích Điểm Xanh (Green Points) trên web app, liên kết thẻ sinh viên.",
    status: "in-progress",
    items: ["Hoàn thiện Web App EcoValues", "Hệ thống QR code tại trạm", "Ra mắt tính năng bảng xếp hạng"]
  },
  {
    quarter: "Q3 / 2026",
    title: "Mở Rộng Toàn Trường",
    desc: "Phủ sóng trạm thu gom tại 100% tòa nhà. Tổ chức lễ hội tái chế thường niên.",
    status: "future",
    items: ["Triển khai 20 trạm bổ sung", "Ký kết đối tác doanh nghiệp xanh", "Tổ chức EcoFest 2026"]
  },
  {
    quarter: "Q4 / 2026",
    title: "Mục Tiêu Xanh 2026",
    desc: "Đạt mốc chứng nhận Khuôn Viên Không Rác Thải (Zero Waste Campus).",
    status: "future",
    items: ["Tái chế >90% rác thải", "Tham gia của 100% sinh viên", "Chuyển giao mô hình cho các trường khác"]
  }
];

export default function Roadmap() {
  const { isLoggedIn } = useAuth();
  return (
    <MainLayout>
      <section className="py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
            >
              Lộ Trình Dự Án
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Hành trình biến một ý tưởng trên giấy thành hiện thực. Chúng tôi đi từng bước vững chắc để đảm bảo tính bền vững của dự án.
            </motion.p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-secondary -translate-x-1/2 rounded-full z-0"></div>

            <div className="space-y-12 md:space-y-24">
              {MILESTONES.map((milestone, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative z-10 flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-[28px] md:left-1/2 -translate-x-1/2 mt-6 md:mt-0 flex items-center justify-center">
                    <div className={`w-14 h-14 rounded-full border-4 border-background flex items-center justify-center shadow-lg transition-all ${
                      milestone.status === "completed" ? "bg-primary text-white" :
                      milestone.status === "in-progress" ? "bg-accent text-white shadow-[0_0_20px_rgba(13,148,136,0.4)]" :
                      "bg-secondary text-muted-foreground"
                    }`}>
                      {milestone.status === "completed" && <Check className="w-6 h-6" />}
                      {milestone.status === "in-progress" && <Target className="w-6 h-6 animate-pulse" />}
                      {milestone.status === "future" && <Clock className="w-6 h-6" />}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`ml-20 md:ml-0 w-full md:w-[calc(50%-48px)] ${
                    index % 2 === 0 ? "md:text-left" : "md:text-right"
                  }`}>
                    <div className={`p-8 rounded-3xl border transition-all duration-300 ${
                      milestone.status === "completed" ? "bg-card border-primary/20 shadow-sm" :
                      milestone.status === "in-progress" ? "bg-primary/5 border-primary shadow-md scale-[1.02]" :
                      "bg-card/50 border-border opacity-70"
                    }`}>
                      <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4 ${
                        milestone.status === "completed" ? "bg-primary/10 text-primary" :
                        milestone.status === "in-progress" ? "bg-accent text-white" :
                        "bg-secondary text-muted-foreground"
                      }`}>
                        {milestone.quarter}
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3">{milestone.title}</h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed">
                        {milestone.desc}
                      </p>

                      <ul className={`space-y-2 text-sm font-medium ${
                        index % 2 === 0 ? "text-left" : "text-left md:text-right md:flex md:flex-col md:items-end"
                      }`}>
                        {milestone.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-foreground">
                            {index % 2 === 0 ? (
                              <><Star className={`w-4 h-4 ${milestone.status === "future" ? "text-muted" : "text-yellow-500"}`} /> {item}</>
                            ) : (
                              <><span className="hidden md:inline">{item}</span> <Star className={`w-4 h-4 ${milestone.status === "future" ? "text-muted" : "text-yellow-500"}`} /> <span className="md:hidden">{item}</span></>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-20 bg-secondary/30 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-bold mb-6">Trở thành một phần của lịch sử</h2>
          <p className="text-muted-foreground mb-8">
            Dự án EcoValues được vận hành 100% bởi sinh viên. Chúng tôi luôn tìm kiếm những người đồng hành tâm huyết.
          </p>
          <a href="/tham-gia" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-white shadow-lg transition-all hover:bg-primary/90">
            Xem vị trí tuyển dụng
          </a>
        </div>
      </section>
    </MainLayout>
  );
}
