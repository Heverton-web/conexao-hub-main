import type { NextApiRequest } from 'next';

const MOCK_USERS: Record<string, { role: string }> = {
  'super_admin': { role: 'super_admin' }
};

export async function getUserFromToken(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (token === 'Bearer super_admin') {
    return { id: 'mock-admin', role: 'super_admin' };
  }

  // In production, verify JWT with Supabase
  // For now, just return null for other tokens
  return null;
}
