import { supabase } from './supabase';

export interface Station {
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
  image?: string;
  x?: number;
  y?: number;
  lat: number;
  lng: number;
}

export interface UserLeaderboard {
  id: number;
  rank: number;
  name: string;
  points: number;
  major: string;
  itemsRecycled: number;
  badge?: string;
}

export interface Reward {
  id: string;
  title: string;
  pointsCost: number;
  category: string;
  icon: string;
  available: number;
  description: string;
}

export interface Registration {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  note: string;
  createdAt: string;
}

class MemStorage {
  private stations: Map<string, Station> = new Map();
  private leaderboard: UserLeaderboard[] = [];
  private rewards: Reward[] = [];
  private registrations: Registration[] = [];
  private stats = {
    totalRecycledWeightKg: 3120,
    activeStudents: 980,
    totalStations: 14,
    accuracyRate: 96,
  };

  constructor() {
    this.seedData();
  }

  private seedData() {
    // 14 Stations split across CMC CS1 (Duy Tân - Cầu Giấy) and CMC CS2 (Vạn Phúc - Hà Đông)
    const initialStations: Station[] = [
      // === CMC CS1: Duy Tân, Cầu Giấy ===
      {
        id: "S01",
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
        id: "S02",
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
        id: "S03",
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
      },
      {
        id: "S04",
        name: "Trạm Hội Trường CS1",
        campus: "CS1",
        campusName: "CMC CS1 (Duy Tân - Cầu Giấy)",
        building: "Hội trường A",
        floor: "Tầng 1",
        location: "Cổng chính Hội Trường Duy Tân",
        types: ["paper", "plastic"],
        status: "active",
        capacity: 38,
        lastCollected: "09:15 Hôm nay",
        hours: "Khi có sự kiện",
        lat: 21.0305,
        lng: 105.7810
      },
      {
        id: "S05",
        name: "Trạm Co-Working CS1",
        campus: "CS1",
        campusName: "CMC CS1 (Duy Tân - Cầu Giấy)",
        building: "Tòa Duy Tân",
        floor: "Tầng 2",
        location: "Khu không gian làm việc sinh viên Duy Tân",
        types: ["paper", "plastic"],
        status: "active",
        capacity: 50,
        lastCollected: "13:15 Hôm nay",
        hours: "08:00 - 21:00",
        lat: 21.0322,
        lng: 105.7821
      },
      {
        id: "S06",
        name: "Trạm KTX Cầu Giấy",
        campus: "CS1",
        campusName: "CMC CS1 (Duy Tân - Cầu Giấy)",
        building: "KTX Cầu Giấy",
        floor: "Tầng 1",
        location: "Cổng Khu nội trú Cầu Giấy",
        types: ["paper", "plastic", "ewaste"],
        status: "active",
        capacity: 78,
        lastCollected: "11:45 Hôm nay",
        hours: "24/7",
        lat: 21.0335,
        lng: 105.7842
      },
      {
        id: "S07",
        name: "Trạm Cổng Trường CS1",
        campus: "CS1",
        campusName: "CMC CS1 (Duy Tân - Cầu Giấy)",
        building: "Cổng Duy Tân",
        floor: "Mặt đường",
        location: "Mặt tiền Phố Duy Tân - Cầu Giấy",
        types: ["plastic"],
        status: "active",
        capacity: 60,
        lastCollected: "06:30 Hôm nay",
        hours: "24/7",
        lat: 21.0300,
        lng: 105.7825
      },

      // === CMC CS2: Vạn Phúc, Hà Đông ===
      {
        id: "S08",
        name: "Trạm Thư Viện Central CS2",
        campus: "CS2",
        campusName: "CMC CS2 (Vạn Phúc - Hà Đông)",
        building: "Thư viện CS2",
        floor: "Tầng 1",
        location: "Trung tâm Thư Viện Vạn Phúc",
        types: ["paper", "plastic"],
        status: "active",
        capacity: 40,
        lastCollected: "08:30 Hôm nay",
        hours: "08:00 - 20:30",
        lat: 20.9788,
        lng: 105.7765
      },
      {
        id: "S09",
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
        id: "S10",
        name: "Trạm Sân Thể Thao CS2",
        campus: "CS2",
        campusName: "CMC CS2 (Vạn Phúc - Hà Đông)",
        building: "Sân vận động CS2",
        floor: "Mặt sân",
        location: "Khu Phức Hợp Thể Thao Vạn Phúc",
        types: ["plastic"],
        status: "active",
        capacity: 65,
        lastCollected: "12:00 Hôm nay",
        hours: "06:00 - 22:00",
        lat: 20.9796,
        lng: 105.7774
      },
      {
        id: "S11",
        name: "Trạm Ký Túc Xá CS2",
        campus: "CS2",
        campusName: "CMC CS2 (Vạn Phúc - Hà Đông)",
        building: "KTX Hà Đông",
        floor: "Tầng 1",
        location: "Khu nội trú Sinh Viên Hà Đông",
        types: ["paper", "plastic", "ewaste"],
        status: "active",
        capacity: 70,
        lastCollected: "09:00 Hôm nay",
        hours: "24/7",
        lat: 20.9770,
        lng: 105.7745
      },
      {
        id: "S12",
        name: "Trạm Innovation Hub CS2",
        campus: "CS2",
        campusName: "CMC CS2 (Vạn Phúc - Hà Đông)",
        building: "Tòa Sáng Tạo",
        floor: "Tầng 2",
        location: "Trung Tâm Đổi Mới Sáng Tạo Hà Đông",
        types: ["paper", "ewaste"],
        status: "active",
        capacity: 30,
        lastCollected: "06:30 Hôm nay",
        hours: "08:00 - 18:00",
        lat: 20.9798,
        lng: 105.7760
      },
      {
        id: "S13",
        name: "Trạm Bãi Xe CS2",
        campus: "CS2",
        campusName: "CMC CS2 (Vạn Phúc - Hà Đông)",
        building: "Bãi xe CS2",
        floor: "Mặt đất",
        location: "Cổng Bãi Xe Sinh Viên Vạn Phúc",
        types: ["plastic", "paper"],
        status: "active",
        capacity: 45,
        lastCollected: "13:00 Hôm nay",
        hours: "06:00 - 22:30",
        lat: 20.9765,
        lng: 105.7762
      },
      {
        id: "S14",
        name: "Trạm Eco Coffee Garden CS2",
        campus: "CS2",
        campusName: "CMC CS2 (Vạn Phúc - Hà Đông)",
        building: "Khu Sân Vườn",
        floor: "Mặt sân",
        location: "Quán Cà Phê Sinh Viên Hà Đông",
        types: ["plastic"],
        status: "full",
        capacity: 95,
        lastCollected: "15:00 Hôm qua",
        hours: "07:30 - 22:00",
        lat: 20.9785,
        lng: 105.7780
      }
    ];
    initialStations.forEach(s => this.stations.set(s.id, s));

    // Leaderboard
    this.leaderboard = [
      { id: 1, rank: 1, name: "Nguyễn Minh Anh", points: 2450, major: "Quản trị Kinh doanh", itemsRecycled: 142, badge: "Hiệp Sĩ Xanh" },
      { id: 2, rank: 2, name: "Trần Đức Hùng", points: 2120, major: "Công nghệ Thông tin", itemsRecycled: 128, badge: "Đại Sứ Eco" },
      { id: 3, rank: 3, name: "Lê Thị Mai", points: 1980, major: "Thiết kế Đồ họa", itemsRecycled: 110, badge: "Thủ Lĩnh Tái Chế" },
      { id: 4, rank: 4, name: "Phạm Văn Khoa", points: 1850, major: "Marketing", itemsRecycled: 98 },
      { id: 5, rank: 5, name: "Hoàng Nhã Uyên", points: 1720, major: "Ngôn ngữ Anh", itemsRecycled: 91 },
      { id: 6, rank: 6, name: "Vũ Hải Đăng", points: 1640, major: "Công nghệ Thông tin", itemsRecycled: 85 },
      { id: 7, rank: 7, name: "Đặng Mai Phương", points: 1590, major: "Quản trị Kinh doanh", itemsRecycled: 80 },
      { id: 8, rank: 8, name: "Bùi Tuấn Anh", points: 1430, major: "Thiết kế Đồ họa", itemsRecycled: 74 },
    ];

    // Rewards - Expanded Store List
    this.rewards = [
      {
        id: "R01",
        title: "Voucher Căng Tin 20.000đ",
        pointsCost: 200,
        category: "Căng tin",
        icon: "Coffee",
        available: 45,
        description: "Giảm 20.000đ trực tiếp khi thanh toán đồ ăn/uống tại Căng tin CMC CS1 & CS2."
      },
      {
        id: "R02",
        title: "Voucher Căng Tin 50.000đ",
        pointsCost: 450,
        category: "Căng tin",
        icon: "Utensils",
        available: 20,
        description: "Voucher suất ăn đặc biệt 50.000đ tại khu ẩm thực sinh viên."
      },
      {
        id: "R03",
        title: "Bình Nước Thủy Tinh EcoValues",
        pointsCost: 500,
        category: "Quà Tặng",
        icon: "Droplet",
        available: 18,
        description: "Bình đựng nước thủy tinh cao cấp logo EcoValues 500ml chịu nhiệt tốt."
      },
      {
        id: "R04",
        title: "Túi Vải Canvas Zero Waste",
        pointsCost: 350,
        category: "Quà Tặng",
        icon: "ShoppingBag",
        available: 25,
        description: "Túi canvas thời trang bền bỉ thay thế hoàn toàn túi nilon đi học."
      },
      {
        id: "R05",
        title: "Sổ Tay Tái Chế Giấy Eco",
        pointsCost: 250,
        category: "Dụng Cụ Học Tập",
        icon: "BookOpen",
        available: 40,
        description: "Sổ ghi chép bìa tái chế 100 trang thiết kế độc quyền sinh viên CMC."
      },
      {
        id: "R06",
        title: "Bộ Thìa Đũa Gỗ Thân Thiện Môi Trường",
        pointsCost: 300,
        category: "Quà Tặng",
        icon: "Utensils",
        available: 30,
        description: "Bộ dụng cụ ăn cá nhân bằng gỗ cao cấp kèm túi đựng gấp gọn."
      },
      {
        id: "R07",
        title: "Ly Tre Giữ Nhiệt Logo Eco",
        pointsCost: 600,
        category: "Quà Tặng",
        icon: "Coffee",
        available: 15,
        description: "Ly giữ nhiệt vỏ tre tự nhiên 450ml in logo Đại sứ Xanh CMC."
      },
      {
        id: "R08",
        title: "Giấy Chứng Nhận Đại Sứ Xanh CMC",
        pointsCost: 1000,
        category: "Chứng Nhận",
        icon: "Award",
        available: 100,
        description: "Chứng nhận tích cực tham gia các hoạt động vì môi trường cấp bởi EcoValues."
      },
      {
        id: "R09",
        title: "Vé Tham Gia Workshop Eco Creative",
        pointsCost: 150,
        category: "Sự Kiện",
        icon: "Sparkles",
        available: 50,
        description: "Vé tham gia lớp học làm đồ handmade tái chế & trồng cây sen đá."
      }
    ];
  }

  getStats() {
    return {
      ...this.stats,
      totalRecycledFormatted: `${(this.stats.totalRecycledWeightKg / 1000).toFixed(1)} Tấn`,
    };
  }

  getAllStations(): Station[] {
    return Array.from(this.stations.values());
  }

  getStationById(id: string): Station | undefined {
    return this.stations.get(id);
  }

  updateStationCapacity(id: string, capacity: number): Station | undefined {
    const station = this.stations.get(id);
    if (!station) return undefined;
    
    station.capacity = capacity;
    if (capacity >= 85) {
      station.status = 'full';
    } else if (station.status === 'full' && capacity < 85) {
      station.status = 'active';
    }
    this.stations.set(id, station);
    return station;
  }

  reportStationCollection(id: string): Station | undefined {
    const station = this.stations.get(id);
    if (!station) return undefined;

    station.capacity = 10;
    station.status = 'active';
    const now = new Date();
    station.lastCollected = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} Vừa dọn sạch`;
    this.stations.set(id, station);
    return station;
  }

  getLeaderboard(): UserLeaderboard[] {
    return [...this.leaderboard].sort((a, b) => b.points - a.points);
  }

  claimPoints(userName: string, itemType: string, quantity: number) {
    const pointsPerItemMap: Record<string, number> = {
      plastic: 50,
      paper: 40,
      ewaste: 150,
      volunteer: 200
    };

    const multiplier = pointsPerItemMap[itemType] || 50;
    const earnedPoints = quantity * multiplier;
    this.stats.totalRecycledWeightKg += Math.round(quantity * 0.3);

    let user = this.leaderboard.find(u => u.name.toLowerCase() === userName.toLowerCase());
    if (user) {
      user.points += earnedPoints;
      user.itemsRecycled += quantity;
    } else {
      user = {
        id: this.leaderboard.length + 1,
        rank: this.leaderboard.length + 1,
        name: userName,
        points: earnedPoints,
        major: "Sinh viên CMC",
        itemsRecycled: quantity,
        badge: "Thành Viên Mới"
      };
      this.leaderboard.push(user);
    }

    this.leaderboard.sort((a, b) => b.points - a.points);
    this.leaderboard.forEach((u, index) => {
      u.rank = index + 1;
    });

    return {
      earnedPoints,
      user,
      newTotalPoints: user.points
    };
  }

  getRewards(): Reward[] {
    return this.rewards;
  }

  redeemReward(rewardId: string, userName: string) {
    const reward = this.rewards.find(r => r.id === rewardId);
    if (!reward) throw new Error("Phần thưởng không tồn tại");
    if (reward.available <= 0) throw new Error("Phần thưởng đã hết số lượng");

    let user = this.leaderboard.find(u => u.name.toLowerCase() === userName.toLowerCase());
    if (!user) {
      user = this.leaderboard[0];
    }

    if (user.points < reward.pointsCost) {
      throw new Error(`Bạn cần tối thiểu ${reward.pointsCost} điểm (Hiện có: ${user.points} điểm)`);
    }

    user.points -= reward.pointsCost;
    reward.available -= 1;

    const voucherCode = `ECO-${reward.id}-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      success: true,
      voucherCode,
      remainingPoints: user.points,
      rewardTitle: reward.title
    };
  }

  addRegistration(data: Omit<Registration, 'id' | 'createdAt'>): Registration {
    const reg: Registration = {
      id: `REG-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.registrations.push(reg);

    // Asynchronously sync to Supabase registrations table (fails gracefully if table not created yet)
    supabase.from('registrations').insert([
      {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        note: data.note,
        createdAt: reg.createdAt
      }
    ]).then(({ error }) => {
      if (error) {
        console.warn('⚠️ Ghi Supabase (registrations) thất bại (có thể bảng chưa được tạo):', error.message);
      } else {
        console.log('⚡ Đã đồng bộ đăng ký lên Supabase!');
      }
    });

    return reg;
  }

  getRegistrations(): Registration[] {
    return this.registrations;
  }

  registerUser(name: string, email: string, studentId: string, major: string) {
    let existing = this.leaderboard.find(u => u.name.toLowerCase() === name.toLowerCase());
    if (!existing) {
      existing = {
        id: this.leaderboard.length + 1,
        rank: this.leaderboard.length + 1,
        name,
        points: 2450,
        major: major || "Công nghệ Thông tin",
        itemsRecycled: 10,
        badge: "Đại Sứ Mới"
      };
      this.leaderboard.push(existing);

      // Asynchronously sync to Supabase users table (fails gracefully if table not created yet)
      supabase.from('users').insert([
        {
          name: existing.name,
          email,
          studentId,
          major: existing.major,
          points: existing.points,
          itemsRecycled: existing.itemsRecycled,
          badge: existing.badge
        }
      ]).then(({ error }) => {
        if (error) {
          console.warn('⚠️ Ghi Supabase (users) thất bại (có thể bảng chưa được tạo):', error.message);
        } else {
          console.log('⚡ Đã đồng bộ tài khoản sinh viên lên Supabase!');
        }
      });
    }
    return existing;
  }
}

export const storage = new MemStorage();

