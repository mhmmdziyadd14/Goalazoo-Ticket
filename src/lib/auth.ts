// src/lib/auth.ts
import jwt from 'jsonwebtoken';

// Mengambil kunci rahasia JWT dari variabel lingkungan
// Penting: Gunakan kunci yang kuat dan jaga kerahasiaannya di produksi
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_jangan_gunakan_ini_di_produksi';

// Interface untuk payload token JWT
interface TokenPayload {
  id: number;
  email: string;
  role: 'user' | 'admin'; // Menentukan peran pengguna
}

/**
 * Membuat token JWT dari payload yang diberikan.
 * Token akan kadaluarsa dalam 7 hari.
 * @param payload Data yang akan disertakan dalam token (ID pengguna, email, peran).
 * @returns String token JWT yang ditandatangani.
 */
export function createToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Memverifikasi token JWT dan mengembalikan payload yang didekode.
 * Akan melempar error jika token tidak valid atau kadaluarsa.
 * @param token String token JWT yang akan diverifikasi.
 * @returns Payload token yang didekode.
 */
export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
}
