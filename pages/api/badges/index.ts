import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserFromToken } from '../../../utils/auth';
import { badgeMockStore } from '../../../src/badges';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await getUserFromToken(req);
  if (!user || user.role !== 'super_admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const badges = await badgeMockStore.getAllBadges();
      return res.status(200).json(badges);
    }

    if (req.method === 'POST') {
      const { name, description, iconName, color, pointsReward, triggerType, triggerValue, series } = req.body;
      const newBadge = await badgeMockStore.create({
        name,
        description,
        iconName,
        color,
        pointsReward,
        triggerType,
        triggerValue,
        series
      });
      return res.status(201).json(newBadge);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
