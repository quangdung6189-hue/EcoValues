import { useState, useEffect, useRef } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, 
  Search, 
  RefreshCw, 
  Truck, 
  AlertTriangle, 
  Zap, 
  ExternalLink,
  Navigation,
  Activity,
  CheckCircle2,
  PieChart as PieIcon,
  TrendingUp,
  Recycle,
  ShieldCheck,
  Radio,
  Clock,
  Sparkles,
  LocateFixed,
  Building2
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Station {
  id: string;
  name: string;
  campus: 'CS1' | 'CS2';
  campusName: string;
  building: string;
  floor: string;
  location: string;
  types: string[];
  status: 'active' | 'full' | 'maintenance';
  capacity: number;
  lastCollected: string;
  hours: string;
  lat: number;
  lng: number;
}

// Optimized, streamlined set of 6 stations focused on CMC CS2 (Vạn Phúc - Hà Đông) & CS1 (Duy Tân - Cầu Giấy)
const DEFAULT_STATIONS: Station[] = [
  // === CMC CS2: Vạn Phúc, Hà Đông (Focus 1) ===
  {
    id: "S01",
    name: "Trạm Thư Viện Central CS2",
    campus: "CS2",
    campusName: "CMC CS2 (Vạn Phúc - Hà Đông)",
    building: "Tòa Thư Viện CS2",
    floor: "Tầng 1",
    location: "Trung tâm Thư Viện Vạn Phúc - Hà Đông",
    types: ["paper", "plastic"],
    status: "active",
    capacity: 40,
    lastCollected: "08:30 Hôm nay",
    hours: "08:00 - 20:30",
    lat: 20.9788,
    lng: 105.7765
  },
  {
    id: "S02",
    name: "Trạm Căng Tin Tòa B CS2",
    campus: "CS2",
    campusName: "CMC CS2 (Vạn Phúc - Hà Đông)",
    building: "Tòa B CS2",
    floor: "Tầng 1",
    location: "Khu ẩm thực Căng tin Hà Đông",
    types: ["plastic"],
    status: "full",
    capacity: 88,
    lastCollected: "Hôm qua",
    hours: "07:00 - 19:00",
    lat: 20.9778,
    lng: 105.7752
  },
  {
    id: "S03",
    name: "Trạm Ký Túc Xá CS2",
    campus: "CS2",
    campusName: "CMC CS2 (Vạn Phúc - Hà Đông)",
    building: "KTX Hà Đông",
    floor: "Tầng 1",
    location: "Khu nội trú Sinh Viên Vạn Phúc",
    types: ["paper", "plastic", "ewaste"],
    status: "active",
    capacity: 70,
    lastCollected: "09:00 Hôm nay",
    hours: "24/7",
    lat: 20.9770,
    lng: 105.7745
  },

  // === CMC CS1: Duy Tân, Cầu Giấy (Focus 2) ===
  {
    id: "S04",
    name: "Trạm Thư Viện CS1",
    campus: "CS1",
    campusName: "CMC CS1 (Duy Tân - Cầu Giấy)",
    building: "Tòa Duy Tân",
    floor: "Tầng 1",
    location: "Sảnh Thư Viện - Khu tự học Cầu Giấy",
    types: ["paper", "plastic"],
    status: "active",
    capacity: 45,
    lastCollected: "10:30 Hôm nay",
    hours: "08:00 - 20:00",
    lat: 21.0318,
    lng: 105.7828
  },
  {
    id: "S05",
    name: "Trạm Căng Tin CS1",
    campus: "CS1",
    campusName: "CMC CS1 (Duy Tân - Cầu Giấy)",
    building: "Tòa Duy Tân",
    floor: "Tầng B1",
    location: "Khu ẩm thực Căng tin CS1 Cầu Giấy",
    types: ["plastic"],
    status: "full",
    capacity: 92,
    lastCollected: "14:00 Hôm qua",
    hours: "07:00 - 18:00",
    lat: 21.0310,
    lng: 105.7818
  },
  {
    id: "S06",
    name: "Trạm IT & AI Hub CS1",
    campus: "CS1",
    campusName: "CMC CS1 (Duy Tân - Cầu Giấy)",
    building: "Tòa Công Nghệ",
    floor: "Tầng 3",
    location: "Hành lang Phòng Lab Máy Tính CS1",
    types: ["ewaste"],
    status: "active",
    capacity: 25,
    lastCollected: "Thứ 2 vừa rồi",
    hours: "08:00 - 17:00",
    lat: 21.0326,
    lng: 105.7834
  }
];

const RECENT_LOGS = [
  { id: 1, text: "Sinh viên Nguyễn Minh Anh vừa phân loại 15 chai nhựa tại Trạm Thư Viện CS2", time: "2 phút trước", icon: Recycle },
  { id: 2, text: "Đội vệ sinh đã hoàn tất dọn dẹp sạch Trạm Ký Túc Xá CS2 (Hà Đông)", time: "15 phút trước", icon: Truck },
  { id: 3, text: "Trạm Căng Tin CS1 (Duy Tân) phát tín hiệu cảnh báo sức chứa 92%", time: "30 phút trước", icon: AlertTriangle },
  { id: 4, text: "Trần Đức Hùng đã nộp 3kg bìa carton tại Trạm Sảnh Tòa B CS2", time: "1 giờ trước", icon: CheckCircle2 },
];

export default function LiveMap() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCampus, setSelectedCampus] = useState<"ALL" | "CS1" | "CS2">("CS2");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStationId, setSelectedStationId] = useState<string | null>("S01");
  const [mapType, setMapType] = useState<"google" | "satellite" | "osm">("google");
  const [localStations, setLocalStations] = useState<Station[]>(DEFAULT_STATIONS);

  // User GPS state
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestStationInfo, setNearestStationInfo] = useState<{ station: Station; distanceMeters: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Fetch stations from Express API (3s polling)
  const { data: serverStations, isLoading, refetch } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
    queryFn: async () => {
      const res = await fetch('/api/stations');
      if (!res.ok) throw new Error('Không thể tải từ Server API');
      return await res.json();
    },
    refetchInterval: 3000,
    retry: 1
  });

  // Sync server stations safely
  useEffect(() => {
    if (serverStations && Array.isArray(serverStations) && serverStations.length > 0) {
      const mapped = serverStations.slice(0, 6).map((s, idx) => ({
        ...s,
        campus: s.campus || (idx < 3 ? 'CS2' : 'CS1'),
        campusName: s.campusName || (idx < 3 ? 'CMC CS2 (Vạn Phúc - Hà Đông)' : 'CMC CS1 (Duy Tân - Cầu Giấy)'),
        lat: s.lat || DEFAULT_STATIONS[idx % DEFAULT_STATIONS.length].lat,
        lng: s.lng || DEFAULT_STATIONS[idx % DEFAULT_STATIONS.length].lng,
      }));
      setLocalStations(mapped);
    }
  }, [serverStations]);

  // Calculate distance between two GPS coordinates (Haversine formula)
  const calculateDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  };

  // GPS Locate User Action
  const handleLocateUser = () => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      toast({
        title: "Trình Duyệt Không Hỗ Trợ GPS",
        description: "Mô phỏng vị trí của bạn tại cổng trường CMC CS2 (Vạn Phúc).",
      });
      setUserPositionFallback(20.9785, 105.7760);
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setUserPositionFallback(uLat, uLng);
        setIsLocating(false);
      },
      (err) => {
        toast({
          title: "Vị Trí Định Vị",
          description: "Mô phỏng vị trí của bạn tại CMC Cơ sở 2 Vạn Phúc.",
        });
        setUserPositionFallback(20.9785, 105.7760);
        setIsLocating(false);
      },
      { timeout: 5000 }
    );
  };

  const setUserPositionFallback = (uLat: number, uLng: number) => {
    setUserLocation({ lat: uLat, lng: uLng });

    // Find nearest station
    let nearest: Station = localStations[0];
    let minDist = Infinity;

    localStations.forEach(st => {
      const dist = calculateDistanceMeters(uLat, uLng, st.lat, st.lng);
      if (dist < minDist) {
        minDist = dist;
        nearest = st;
      }
    });

    setNearestStationInfo({ station: nearest, distanceMeters: minDist });
    setSelectedStationId(nearest.id);

    if (leafletMap.current) {
      const map = leafletMap.current;

      // Add user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
      }

      const userIconHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="absolute -inset-3 rounded-full bg-blue-500/40 animate-ping"></div>
          <div class="absolute -inset-1 rounded-full bg-blue-400/60 animate-pulse"></div>
          <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-700 via-blue-500 to-cyan-300 border-2 border-white shadow-xl shadow-blue-500/60 flex items-center justify-center z-10 transition-transform group-hover:scale-125">
            <span class="w-2 h-2 rounded-full bg-white shadow-inner animate-pulse"></span>
          </div>
        </div>
      `;

      const customUserIcon = L.divIcon({
        html: userIconHtml,
        className: 'custom-user-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      userMarkerRef.current = L.marker([uLat, uLng], { icon: customUserIcon }).addTo(map);
      userMarkerRef.current.bindTooltip("📍 Vị Trí Của Bạn (GPS)", { direction: 'top', offset: [0, -12] });
      map.flyTo([uLat, uLng], 17, { duration: 1 });
    }

    toast({
      title: "Đã Định Vị Thành Công! 📍",
      description: `Trạm gần bạn nhất: ${nearest.name} (cách ${minDist}m - Sức chứa: ${nearest.capacity}%)`,
    });
  };

  // Collection Report Mutation
  const collectMutation = useMutation({
    mutationFn: async (stationId: string) => {
      try {
        const res = await fetch(`/api/stations/${stationId}/report`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'collect' })
        });
        if (res.ok) return await res.json();
      } catch (e) {}
      return { message: "Đã báo dọn dẹp thành công!" };
    },
    onSuccess: (data, stationId) => {
      setLocalStations(prev => prev.map(s => {
        if (s.id === stationId) {
          return {
            ...s,
            capacity: 0,
            status: 'active',
            lastCollected: "Vừa xong"
          };
        }
        return s;
      }));

      toast({
        title: "Báo Dọn Dẹp Thành Công! 🚛",
        description: "Thông báo đã được gửi đến Đội xử lý rác AI Campus CMC.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/stations'] });
    }
  });

  // Simulation: Add Waste to Station
  const handleSimulateAddWaste = (stationId: string) => {
    setLocalStations(prev => prev.map(s => {
      if (s.id === stationId) {
        const newCap = Math.min(100, s.capacity + 20);
        return {
          ...s,
          capacity: newCap,
          status: newCap >= 85 ? 'full' : 'active'
        };
      }
      return s;
    }));

    toast({
      title: "Mô Phỏng Rác Đổ Về (+20%) ⚡",
      description: "Sức chứa trạm đã cập nhật theo thời gian thực.",
    });
  };

  // Initialize Leaflet Map Centered at CMC CS2 (Vạn Phúc)
  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // Centered between CS2 and CS1
    const map = L.map(mapRef.current, {
      center: [20.9785, 105.7760],
      zoom: 16,
      zoomControl: false
    });

    const tileUrl = "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
    const layer = L.tileLayer(tileUrl, {
      attribution: '&copy; Google Maps',
      maxZoom: 20,
    }).addTo(map);

    tileLayerRef.current = layer;
    L.control.zoom({ position: "bottomright" }).addTo(map);
    leafletMap.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Map Tile Switcher
  useEffect(() => {
    if (!leafletMap.current || !tileLayerRef.current) return;
    leafletMap.current.removeLayer(tileLayerRef.current);

    let url = "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
    if (mapType === "satellite") {
      url = "https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}";
    } else if (mapType === "osm") {
      url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    }

    const newLayer = L.tileLayer(url, { maxZoom: 20 }).addTo(leafletMap.current);
    tileLayerRef.current = newLayer;
  }, [mapType]);

  // Handle Campus selection zoom
  const handleSelectCampusTab = (campusKey: "ALL" | "CS1" | "CS2") => {
    setSelectedCampus(campusKey);
    if (!leafletMap.current) return;
    const map = leafletMap.current;

    if (campusKey === "CS1") {
      map.flyTo([21.0318, 105.7828], 16, { duration: 1 });
    } else if (campusKey === "CS2") {
      map.flyTo([20.9785, 105.7760], 16, { duration: 1 });
    } else {
      map.flyTo([21.0050, 105.7800], 13, { duration: 1 });
    }
  };

  // Update Markers on Map
  useEffect(() => {
    if (!leafletMap.current) return;
    const map = leafletMap.current;

    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    const filtered = localStations.filter(s => {
      const matchCampus = selectedCampus === "ALL" || s.campus === selectedCampus;
      const matchFilter = filter === "all" || (filter === "full" ? s.capacity >= 85 : s.types.includes(filter));
      const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCampus && matchFilter && matchSearch;
    });

    filtered.forEach(station => {
      const isSelected = selectedStationId === station.id;
      const isFull = station.capacity >= 85;

      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <!-- Pulsing wave ring -->
          ${isFull ? '<div class="absolute -inset-3 rounded-full bg-rose-500/50 animate-ping"></div>' : '<div class="absolute -inset-2 rounded-full bg-emerald-500/30 animate-pulse"></div>'}
          
          <!-- Compact Circular Glowing Dot Icon -->
          <div class="w-8 h-8 rounded-full font-black text-[11px] flex items-center justify-center shadow-xl border-2 border-white transition-all transform group-hover:scale-125 z-20 ${
            isSelected 
              ? 'bg-emerald-600 text-white ring-4 ring-emerald-400/80 scale-110 shadow-emerald-500/60' 
              : isFull 
              ? 'bg-rose-600 text-white shadow-rose-500/50' 
              : 'bg-emerald-700 text-white shadow-emerald-600/40'
          }">
            <span class="font-mono font-bold">${station.capacity}%</span>
          </div>

          <!-- Station Name Label Banner (ONLY SHOWN ON HOVER OR WHEN SELECTED) -->
          <div class="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 ${isSelected ? 'opacity-100' : ''} transition-all duration-200 pointer-events-none z-50 whitespace-nowrap bg-emerald-950/95 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-emerald-400/40 backdrop-blur-md flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full ${isFull ? 'bg-rose-400 animate-ping' : 'bg-emerald-400'}"></span>
            <span>${station.name}</span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([station.lat, station.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedStationId(station.id);
        map.flyTo([station.lat, station.lng], 17, { duration: 0.8 });
      });

      markersRef.current[station.id] = marker;
    });
  }, [localStations, selectedCampus, filter, searchQuery, selectedStationId]);

  // Guaranteed 100% synchronized active station for bottom panel & card clicks!
  const activeStation = localStations.find(s => s.id === selectedStationId) || localStations[0];
  const displayStation = activeStation;

  const handleSelectCard = (s: Station) => {
    setSelectedStationId(s.id);
    if (leafletMap.current) {
      leafletMap.current.flyTo([s.lat, s.lng], 17, { duration: 0.8 });
    }
  };

  const filteredStations = localStations.filter(s => {
    const matchCampus = selectedCampus === "ALL" || s.campus === selectedCampus;
    const matchFilter = filter === "all" || (filter === "full" ? s.capacity >= 85 : s.types.includes(filter));
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        s.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCampus && matchFilter && matchSearch;
  });

  const fullStationsCount = localStations.filter(s => s.capacity >= 85).length;

  const openGoogleMapsDirections = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <MainLayout>
      <div className="bg-background min-h-screen py-6 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        
        {/* Top Campus Selector & GPS Locate Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-card border border-border p-4 rounded-3xl shadow-sm gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide">
            <span className="text-xs font-bold uppercase text-muted-foreground whitespace-nowrap mr-1 flex items-center gap-1">
              <Building2 className="w-4 h-4 text-emerald-600" /> Chọn Cơ Sở:
            </span>
            <button
              onClick={() => handleSelectCampusTab("CS2")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedCampus === 'CS2' ? 'bg-emerald-600 text-white shadow-md' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              🏫 CMC CS2 (Vạn Phúc - Hà Đông)
            </button>
            <button
              onClick={() => handleSelectCampusTab("CS1")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedCampus === 'CS1' ? 'bg-emerald-600 text-white shadow-md' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              🏢 CMC CS1 (Duy Tân - Cầu Giấy)
            </button>
            <button
              onClick={() => handleSelectCampusTab("ALL")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                selectedCampus === 'ALL' ? 'bg-emerald-600 text-white shadow-md' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}
            >
              🌐 Tất Cả 2 Cơ Sở
            </button>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <button
              onClick={handleLocateUser}
              disabled={isLocating}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? "Đang định vị GPS..." : "Định Vị Vị Trí Của Tôi 📍"}
            </button>

            <button
              onClick={() => refetch()}
              className="p-2 bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-xl transition-all"
              title="Làm mới dữ liệu trạm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Map Split Interface */}
        <div className="flex flex-col lg:flex-row h-[720px] rounded-3xl overflow-hidden border border-border bg-card shadow-2xl">
          
          {/* Left Sidebar: Search, Filters & Stations List */}
          <div className="w-full lg:w-96 border-r border-border bg-card flex flex-col h-full z-10 shrink-0">
            
            {/* Search Input Box */}
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm tên trạm, vị trí..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-secondary border border-border rounded-xl text-xs font-bold text-foreground outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-[11px]">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    filter === 'all' ? 'bg-emerald-600 text-white shadow' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  Tất cả ({localStations.length})
                </button>
                <button
                  onClick={() => setFilter("full")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    filter === 'full' ? 'bg-rose-600 text-white shadow' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  Sắp đầy ({fullStationsCount})
                </button>
                <button
                  onClick={() => setFilter("plastic")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    filter === 'plastic' ? 'bg-emerald-600 text-white shadow' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  Chai Nhựa
                </button>
                <button
                  onClick={() => setFilter("paper")}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    filter === 'paper' ? 'bg-emerald-600 text-white shadow' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                  }`}
                >
                  Giấy Carton
                </button>
              </div>
            </div>

            {/* Stations Scrollable List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {filteredStations.length === 0 ? (
                <div className="p-8 text-center space-y-2 text-muted-foreground">
                  <AlertTriangle className="w-8 h-8 mx-auto text-amber-500" />
                  <p className="text-xs font-bold">Không tìm thấy trạm thu gom phù hợp</p>
                </div>
              ) : (
                filteredStations.map((station) => {
                  const isSelected = selectedStationId === station.id;
                  const isFull = station.capacity >= 85;

                  return (
                    <motion.div
                      key={station.id}
                      onClick={() => handleSelectCard(station)}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-emerald-600 bg-emerald-500/5 shadow-md ring-1 ring-emerald-600' 
                          : 'border-border bg-background hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-extrabold px-1.5 py-0.5 rounded">
                              {station.campus}
                            </span>
                            <h3 className="font-bold text-foreground text-sm">
                              {station.name}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{station.location}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isFull 
                            ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30 animate-pulse' 
                            : 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                        }`}>
                          {isFull ? 'Sắp đầy ⚠️' : 'Đang mở'}
                        </span>
                      </div>

                      <div className="space-y-1 mt-2.5">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="text-muted-foreground">Mức chứa rác:</span>
                          <span className={`font-bold ${isFull ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {station.capacity}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden border border-border/40">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isFull ? 'bg-rose-500' : station.capacity > 65 ? 'bg-amber-500' : 'bg-emerald-600'
                            }`}
                            style={{ width: `${station.capacity}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex gap-1 flex-wrap">
                          {station.types.map(t => (
                            <span key={t} className="text-[9px] bg-secondary px-2 py-0.5 rounded font-bold uppercase text-muted-foreground">
                              {t === 'plastic' ? 'Nhựa' : t === 'paper' ? 'Giấy' : 'Điện tử'}
                            </span>
                          ))}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openGoogleMapsDirections(station.lat, station.lng);
                          }}
                          className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-md"
                        >
                          Google Maps <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Map Canvas Box */}
          <div className="flex-1 relative flex flex-col h-full overflow-hidden">
            
            {/* Map Layer Controls */}
            <div className="absolute top-4 left-4 z-20 bg-card/90 backdrop-blur-md p-1.5 rounded-2xl border border-border shadow-xl flex gap-1">
              <button
                onClick={() => setMapType("google")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mapType === 'google' ? 'bg-emerald-600 text-white shadow' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                Google Maps
              </button>
              <button
                onClick={() => setMapType("satellite")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mapType === 'satellite' ? 'bg-emerald-600 text-white shadow' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                Vệ Tinh
              </button>
              <button
                onClick={() => setMapType("osm")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  mapType === 'osm' ? 'bg-emerald-600 text-white shadow' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                Bản Đồ Mở
              </button>
            </div>

            {/* Quick Simulation Action */}
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <button
                onClick={() => handleSimulateAddWaste(activeStation.id)}
                className="px-4 py-2.5 bg-card/90 backdrop-blur-md border border-border shadow-xl rounded-2xl font-bold text-xs text-foreground hover:bg-card flex items-center gap-1.5 transition-all"
              >
                <Zap className="w-4 h-4 text-amber-500" /> Mô Phỏng Rác Đổ Về (+20%)
              </button>
            </div>

            {/* Leaflet Map Div Container */}
            <div ref={mapRef} className="w-full h-full z-0 bg-slate-200" />

            {/* Guaranteed 100% Synchronized Bottom Detail Panel */}
            <AnimatePresence>
              {displayStation && (
                <motion.div
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 60, opacity: 0 }}
                  className="absolute bottom-6 left-6 right-6 z-20 bg-card/95 border border-border/80 p-5 rounded-3xl shadow-2xl backdrop-blur-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white">
                        {displayStation.campusName}
                      </span>
                      <h2 className="text-lg font-black text-foreground">{displayStation.name}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        displayStation.capacity >= 85 
                          ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30 animate-pulse' 
                          : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      }`}>
                        Mã: {displayStation.id} • {displayStation.capacity}% sức chứa
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex flex-wrap items-center gap-4">
                      <span>📍 {displayStation.location}</span>
                      <span>🕒 Mở cửa: {displayStation.hours}</span>
                      <span>🧹 Dọn gần nhất: {displayStation.lastCollected}</span>
                    </p>
                  </div>

                  <div className="flex gap-2.5 w-full md:w-auto">
                    <button
                      onClick={() => openGoogleMapsDirections(displayStation.lat, displayStation.lng)}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-secondary text-foreground border border-border font-bold rounded-xl hover:bg-secondary/80 transition-all text-xs"
                    >
                      <Navigation className="w-4 h-4 text-emerald-600" /> Chỉ Đường Google Maps
                    </button>

                    <button
                      onClick={() => collectMutation.mutate(displayStation.id)}
                      disabled={collectMutation.isPending}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-md text-xs disabled:opacity-50"
                    >
                      <Truck className="w-4 h-4" /> Báo Dọn Dẹp / Xử Lý Rác
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Analytics & Activity Section (Below Map) */}
        <div className="space-y-8 pt-4">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-4 gap-4">
            <div>
              <h2 className="text-2xl font-black text-foreground flex items-center gap-2 font-sans tracking-tight">
                <Activity className="w-6 h-6 text-emerald-600" /> Thống Kê Phủ Sóng CS2 Vạn Phúc & CS1 Duy Tân
              </h2>
              <p className="text-sm text-muted-foreground">Tổng hợp dữ liệu phân loại rác thải thực tế 2 cơ sở trường CMC</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-full text-xs border border-emerald-500/20">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" /> Tín hiệu GPS & Trạm Sensor thời gian thực
            </div>
          </div>

          {/* 4 Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">Tổng Trạm Phủ Sóng</span>
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-black font-mono text-foreground">{localStations.length} Trạm</p>
              <p className="text-xs text-emerald-600 font-bold">✓ CS2: 3 trạm | CS1: 3 trạm</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">Trạm Cần Dọn Dẹp</span>
                <AlertTriangle className="w-5 h-5 text-rose-500" />
              </div>
              <p className="text-3xl font-black font-mono text-rose-600">{fullStationsCount} Trạm</p>
              <p className="text-xs text-rose-500 font-bold">⚠️ Sức chứa vượt quá 85%</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">Tỷ Lệ Phân Loại Chuẩn</span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-3xl font-black font-mono text-foreground">96.4%</p>
              <p className="text-xs text-emerald-600 font-bold">↑ Tăng 4.2% so với tháng trước</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-3xl shadow-sm space-y-2 hover:border-emerald-500/40 transition-all">
              <div className="flex justify-between items-center text-muted-foreground">
                <span className="text-xs font-bold uppercase tracking-wider">Tốc Độ Xử Lý Rác</span>
                <Clock className="w-5 h-5 text-accent" />
              </div>
              <p className="text-3xl font-black font-mono text-foreground">&lt; 15 Phút</p>
              <p className="text-xs text-muted-foreground font-medium">Kể từ khi nhận báo cáo dọn</p>
            </div>
          </div>

          {/* Waste Category Progress Breakdown & Real-Time Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Category Distribution */}
            <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-emerald-600" /> Tỷ Lệ Cơ Cấu Rác Thu Gom
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-foreground">Chai Nhựa & Lon Nhôm (PET / CAN)</span>
                    <span className="text-emerald-600 font-mono">48% (1.2 Tấn)</span>
                  </div>
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '48%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-foreground">Giấy & Bìa Carton</span>
                    <span className="text-accent font-mono">34% (850 kg)</span>
                  </div>
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '34%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-foreground">Rác Điện Tử & Pin Cũ</span>
                    <span className="text-amber-500 font-mono">18% (450 kg)</span>
                  </div>
                  <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80 leading-relaxed font-medium">
                  Rác nhựa và giấy tái chế được gom trực tiếp chuyển tới các nhà máy đối tác để biến thành đồ dùng học tập và túi vải tặng lại cho sinh viên.
                </p>
              </div>
            </div>

            {/* Live Activity Stream */}
            <div className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" /> Nhật Ký Hoạt Động Trực Tuyến
                </h3>
                <span className="text-xs text-muted-foreground font-mono">Cập nhật liên tục ⚡</span>
              </div>

              <div className="divide-y divide-border/60">
                {(() => {
                  const fullStations = localStations.filter(s => s.capacity >= 85);
                  const activeStations = localStations.filter(s => s.capacity < 85);

                  const dynamicLogs = [];
                  if (fullStations.length > 0) {
                    dynamicLogs.push({
                      id: 1,
                      text: `${fullStations[0].name} (${fullStations[0].campus === 'CS2' ? 'Hà Đông' : 'Duy Tân'}) phát tín hiệu cảnh báo sức chứa ${fullStations[0].capacity}%`,
                      time: "15 phút trước",
                      icon: AlertTriangle
                    });
                  }
                  if (fullStations.length > 1) {
                    dynamicLogs.push({
                      id: 2,
                      text: `${fullStations[1].name} (${fullStations[1].campus === 'CS2' ? 'Hà Đông' : 'Duy Tân'}) phát tín hiệu cảnh báo sức chứa ${fullStations[1].capacity}%`,
                      time: "30 phút trước",
                      icon: AlertTriangle
                    });
                  }
                  dynamicLogs.push({
                    id: 3,
                    text: `Sinh viên Nguyễn Minh Anh vừa phân loại 15 chai nhựa tại ${activeStations[0]?.name || "Trạm Thư Viện CS2"}`,
                    time: "2 phút trước",
                    icon: Recycle
                  });
                  dynamicLogs.push({
                    id: 4,
                    text: `Đội vệ sinh đã hoàn tất dọn dẹp và thu gom rác tại ${activeStations[1]?.name || "Trạm Ký Túc Xá CS2"}`,
                    time: "45 phút trước",
                    icon: Truck
                  });

                  return dynamicLogs.map((log) => (
                    <div key={log.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                          <log.icon className="w-5 h-5" />
                        </div>
                        <p className="text-xs md:text-sm font-medium text-foreground">{log.text}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-mono whitespace-nowrap">{log.time}</span>
                    </div>
                  ));
                })()}
              </div>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}
