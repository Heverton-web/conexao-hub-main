import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromToken } from '../../../src/utils/auth';
import { badgeMockStore } from '../../../src/badges';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'super_admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const badge = await badgeMockStore.read(req.query.id as string);
      if (!badge) return res.status(404).json({ error: 'Badge not found' });
      return res.status(200).json(badge);
    }

    if (req.method === 'PUT') {
      const badge = await badgeMockStore.update(req.query.id as string, req.body);
      return res.status(200).json(badge);
    }

    if (req.method === 'DELETE') {
      await badgeMockStore.delete(req.query.id as string);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
