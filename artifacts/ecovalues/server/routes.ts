import { Express, Request, Response } from 'express';
import { storage } from './storage';
import nodemailer from 'nodemailer';

const otpCache = new Map<string, { code: string; expires: number }>();

export function registerRoutes(app: Express) {
  // Stats API
  app.get('/api/stats', (_req: Request, res: Response) => {
    try {
      const stats = storage.getStats();
      res.json(stats);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Stations API
  app.get('/api/stations', (_req: Request, res: Response) => {
    try {
      const stations = storage.getAllStations();
      res.json(stations);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/stations/:id', (req: Request, res: Response) => {
    const station = storage.getStationById(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Không tìm thấy trạm thu gom' });
    }
    res.json(station);
  });

  app.post('/api/stations/:id/report', (req: Request, res: Response) => {
    const { action, capacity } = req.body;
    if (action === 'collect') {
      const updated = storage.reportStationCollection(req.params.id);
      return res.json({ message: 'Đã báo cáo thu gom thành công!', station: updated });
    } else if (typeof capacity === 'number') {
      const updated = storage.updateStationCapacity(req.params.id, capacity);
      return res.json({ message: 'Cập nhật sức chứa thành công', station: updated });
    }
    res.status(400).json({ error: 'Thao tác không hợp lệ' });
  });

  // Leaderboard API
  app.get('/api/leaderboard', (_req: Request, res: Response) => {
    try {
      const leaderboard = storage.getLeaderboard();
      res.json(leaderboard);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Claim GreenPoints
  app.post('/api/points/claim', (req: Request, res: Response) => {
    try {
      const { userName, itemType, quantity } = req.body;
      if (!userName || !itemType || !quantity) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đầy đủ thông tin (tên, loại rác, số lượng)' });
      }
      const result = storage.claimPoints(userName, itemType, Number(quantity));
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Rewards API
  app.get('/api/rewards', (_req: Request, res: Response) => {
    try {
      const rewards = storage.getRewards();
      res.json(rewards);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/rewards/redeem', (req: Request, res: Response) => {
    try {
      const { rewardId, userName } = req.body;
      if (!rewardId) {
        return res.status(400).json({ error: 'Vui lòng chọn phần thưởng' });
      }
      const result = storage.redeemReward(rewardId, userName || 'Nguyễn Minh Anh');
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Volunteer & Partner Registration
  app.post('/api/join', (req: Request, res: Response) => {
    try {
      const { fullName, email, phone, role, note } = req.body;
      if (!fullName || !email) {
        return res.status(400).json({ error: 'Họ tên và email là bắt buộc' });
      }
      const reg = storage.addRegistration({ fullName, email, phone: phone || '', role: role || 'Tình nguyện viên', note: note || '' });
      res.json({ message: 'Đăng ký thành công! Đội ngũ EcoValues sẽ liên hệ với bạn trong 24h.', registration: reg });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // User auth endpoints
  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { name, email, studentId, major } = req.body;
      const user = storage.registerUser(
        name || 'Nguyễn Minh Anh',
        email || 'minhanh@cmc.edu.vn',
        studentId || 'CMC-202488',
        major || 'Công nghệ Thông tin'
      );

      res.json({
        success: true,
        message: "Tạo tài khoản thành công!",
        token: `jwt-token-${Date.now()}`,
        user: {
          id: user.id,
          name: user.name,
          email: email || "minhanh@cmc.edu.vn",
          studentId: studentId || "CMC-202488",
          major: user.major,
          points: user.points,
          role: "student"
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, studentId } = req.body;
      const user = storage.registerUser(
        "Nguyễn Minh Anh",
        email || "minhanh@cmc.edu.vn",
        studentId || "CMC-202488",
        "Quản trị Kinh doanh"
      );

      res.json({
        success: true,
        token: `jwt-token-${Date.now()}`,
        user: {
          id: user.id,
          name: user.name,
          email: email || "minhanh@cmc.edu.vn",
          studentId: studentId || "CMC-202488",
          points: user.points,
          major: user.major,
          role: "student"
        }
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Generate & Send Real OTP directly to Customer Gmail Inbox
  app.post('/api/auth/send-otp', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Email không hợp lệ' });
      }

      // Generate 6 digit code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      otpCache.set(email, { code: otpCode, expires: Date.now() + 10 * 60 * 1000 }); // 10 mins

      const smtpUser = process.env.GMAIL_USER || "ecovalous@gmail.com";
      const smtpPass = process.env.GMAIL_PASS || "cmwrnwajkmmprzpl";

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"Đại Sứ Xanh EcoValues 🌿" <${smtpUser}>`,
        to: email,
        subject: 'Mã xác thực OTP tài khoản Đại Sứ Xanh CMC 🔑',
        text: `Mã OTP xác thực của bạn là: ${otpCode}. Vui lòng nhập mã này vào trang đăng ký EcoValues để hoàn tất xác minh tài khoản.`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1)">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 40px;">🌿</span>
              <h2 style="color: #059669; margin: 8px 0 0 0; font-weight: 800;">EcoValues Vietnam</h2>
              <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Hệ sinh thái tuần hoàn & Tích điểm CMC</p>
            </div>
            
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">Xin chào,</p>
            <p style="font-size: 14px; color: #334155; line-height: 1.6;">Bạn đang thực hiện đăng ký tài khoản thành viên Đại Sứ Xanh CMC. Dưới đây là mã OTP xác thực email của bạn:</p>
            
            <div style="background-color: #f0fdf4; border: 1px dashed #10b981; border-radius: 8px; padding: 16px; text-align: center; margin: 20px 0;">
              <span style="font-size: 12px; color: #047857; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">Mã xác thực OTP</span>
              <h1 style="font-family: monospace; font-size: 32px; color: #047857; margin: 8px 0; font-weight: 900; letter-spacing: 4px;">${otpCode}</h1>
              <span style="font-size: 11px; color: #64748b;">(Có hiệu lực trong vòng 10 phút)</span>
            </div>
            
            <p style="font-size: 12px; color: #64748b; line-height: 1.6; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px;">
              Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email. Đây là email tự động từ hệ thống.
            </p>
          </div>
        `
      });

      console.log(`[REAL GMAIL OTP DISPATCHED SUCCESS] Sent to target email: ${email} | Code: ${otpCode}`);

      res.json({
        success: true,
        message: `Mã OTP đã được gửi trực tiếp về hòm thư Gmail ${email}!`,
        code: otpCode
      });
    } catch (err: any) {
      console.error("[GMAIL SEND ERROR]", err);
      res.status(500).json({ error: 'Không thể gửi email OTP: ' + err.message });
    }
  });

  // Verify OTP
  app.post('/api/auth/verify-otp', (req: Request, res: Response) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ error: 'Thiếu email hoặc mã OTP' });
      }

      const record = otpCache.get(email);
      if (!record) {
        return res.status(400).json({ error: 'Mã OTP đã hết hạn hoặc chưa được tạo' });
      }

      if (Date.now() > record.expires) {
        otpCache.delete(email);
        return res.status(400).json({ error: 'Mã OTP đã hết hạn' });
      }

      if (record.code !== code) {
        return res.status(400).json({ error: 'Mã OTP nhập vào không đúng' });
      }

      otpCache.delete(email);
      res.json({ success: true, message: 'Xác thực OTP thành công!' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}

