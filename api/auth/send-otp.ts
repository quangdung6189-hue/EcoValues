import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body || {};
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email không hợp lệ' });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

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
          <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: center;">
            <p style="margin: 0; color: #166534; font-size: 13px; font-weight: 600;">MÃ XÁC THỰC OTP CỦA BẠN</p>
            <h1 style="margin: 8px 0; color: #059669; font-size: 32px; letter-spacing: 6px; font-family: monospace;">${otpCode}</h1>
            <p style="margin: 0; color: #15803d; font-size: 11px;">(Có hiệu lực trong 10 phút)</p>
          </div>
          <p style="color: #334155; font-size: 13px; line-height: 1.6; margin-bottom: 16px;">
            Chào bạn,<br/>
            Bạn đang thực hiện đăng ký tài khoản thành viên/tình nguyện viên trên nền tảng EcoValues. Vui lòng nhập mã OTP trên vào trang web để hoàn tất quá trình xác thực.
          </p>
          <div style="border-t: 1px solid #f1f5f9; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 11px;">
            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.<br/>
            © 2026 EcoValues CMC Campus Project.
          </div>
        </div>
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Mã OTP đã được gửi trực tiếp từ Gmail ecovalous@gmail.com!',
      code: otpCode
    });
  } catch (err: any) {
    console.error('Email send error:', err);
    return res.status(500).json({ error: err.message || 'Lỗi gửi email' });
  }
}
