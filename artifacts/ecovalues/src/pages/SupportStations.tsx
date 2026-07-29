import { MainLayout } from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { Search, MapPin, Clock } from "lucide-react";
import cmcLibraryUrl from "@assets/generated_images/cmc-library.jpg";
import cmcItLabUrl from "@assets/generated_images/cmc-it-lab.jpg";
import cmcAuditoriumUrl from "@assets/generated_images/cmc-auditorium.jpg";

// 3 Real CMC Stations matching provided campus photos
const STATIONS_DATA = [
  { 
    id: 1, 
    name: "Trạm Thư Viện", 
    location: "CMC CS2 (Vạn Phúc - Hà Đông) • Tầng 1 Khu tự học", 
    image: cmcLibraryUrl, 
    types: ["paper", "plastic"], 
    capacity: 45, 
    hours: "08:00 - 20:30" 
  },
  { 
    id: 2, 
    name: "Trạm IT Lab", 
    location: "CMC CS2 (Vạn Phúc - Hà Đông) • Tòa A Tầng 3 (IC Design)", 
    image: cmcItLabUrl, 
    types: ["ewaste", "plastic"], 
    capacity: 20, 
    hours: "08:00 - 17:30" 
  },
  { 
    id: 3, 
    name: "Trạm Hội Trường", 
    location: "CMC CS1 (Duy Tân - Cầu Giấy) • Hội trường chính", 
    image: cmcAuditoriumUrl, 
    types: ["paper", "plastic", "ewaste"], 
    capacity: 30, 
    hours: "Khi có sự kiện" 
  },
];

export default function SupportStations() {
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black mb-4 tracking-tight"
          >
            Hệ Thống Trạm Hỗ Trợ
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-background/80 max-w-2xl mx-auto"
          >
            Khám phá các trạm phân loại rác thông minh thực tế tại các cơ sở CMC University.
          </motion.p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="border-b border-border bg-card sticky top-16 z-40">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Tìm kiếm tên trạm, cơ sở, tòa nhà..." 
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button className="px-5 py-2 rounded-full text-sm font-bold bg-foreground text-background whitespace-nowrap">Tất cả (3 Trạm)</button>
            <button className="px-5 py-2 rounded-full text-sm font-bold bg-secondary text-foreground hover:bg-secondary/80 whitespace-nowrap">Trạm Nhựa</button>
            <button className="px-5 py-2 rounded-full text-sm font-bold bg-secondary text-foreground hover:bg-secondary/80 whitespace-nowrap">Trạm Giấy</button>
            <button className="px-5 py-2 rounded-full text-sm font-bold bg-secondary text-foreground hover:bg-secondary/80 whitespace-nowrap">Trạm Điện tử</button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-background min-h-screen">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STATIONS_DATA.map((station, index) => (
              <motion.div
                key={station.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={station.image} 
                    alt={station.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 flex gap-1">
                    {station.types.includes('plastic') && <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">Nhựa</span>}
                    {station.types.includes('paper') && <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">Giấy</span>}
                    {station.types.includes('ewaste') && <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">Điện tử</span>}
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{station.name}</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                      {station.location}
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="w-4 h-4 mr-2 text-primary flex-shrink-0" />
                      {station.hours}
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-xl p-4">
                    <div className="flex justify-between text-sm mb-2 font-bold">
                      <span>Mức chứa hiện tại</span>
                      <span className={station.capacity > 80 ? "text-destructive" : "text-primary"}>
                        {station.capacity}%
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${station.capacity > 80 ? 'bg-destructive' : 'bg-primary'}`} 
                        style={{ width: `${station.capacity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
