import * as bcrypt from 'bcryptjs';

export function generateHash(password: string): string {
  return bcrypt.hashSync(password, parseInt(process.env.HASH_SALT));
}

export function validateHash(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) {
    return Promise.resolve(false);
  }
  return bcrypt.compare(password, hash);
}
