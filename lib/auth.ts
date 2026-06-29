// lib/auth.ts
// Basit cookie tabanlı admin doğrulama sistemi

export const verifyAdminSession = (cookieStr?: string): boolean => {
  if (!cookieStr) return false;
  
  try {
    // Sadece güvenlik için basit bir kontrol, Next.js 'cookies' fonksiyonu veya middleware üzerinden geçecek
    return cookieStr.includes('admin_session=true');
  } catch {
    return false;
  }
};
