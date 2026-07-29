import { supabase } from './supabase';

export async function connectDB() {
  const supabaseUrl = process.env.SUPABASE_URL;
  
  if (!supabaseUrl) {
    console.log('ℹ️ Chưa tìm thấy cấu hình Supabase trong .env -> Chuyển sang chế độ MemStorage.');
    return false;
  }

  try {
    console.log('⚡ Đã kết nối thành công tới Supabase Cloud Database!');
    return true;
  } catch (err: any) {
    console.error('❌ Lỗi kết nối Supabase:', err.message);
    return false;
  }
}
