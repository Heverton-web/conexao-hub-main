export type BadgeCategory = 'xp' | 'streak' | 'event' | 'collection' | 'superadmin';

export interface BadgeCondition {
  type: BadgeCategory;
  value: number;
  comparison: 'gte' | 'lte' | 'eq';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  pointsReward: number;
  triggerType: 'xp' | 'streak' | 'event' | 'collection' | 'superadmin';
  triggerValue: number;
  series?: string;
  action?: 'unlock' | 'hide' | 'show';
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
  hidden?: boolean;
}

export interface BadgeWithDetails extends UserBadge {
  badge: Badge;
}

export const BADGE_DEFAULTS: Omit<Badge, 'id'> = {
  name: '',
  description: '',
  iconName: 'trophy',
  color: '#c9a655',
  pointsReward: 0,
  triggerType: 'xp',
  triggerValue: 0,
};

export const ICON_MAP: Record<string, string> = {
  star: 'Star',
  book: 'BookOpen',
  graduation: 'Award',
  rocket: 'Rocket',
  trophy: 'Trophy',
  diamond: 'Diamond',
  crown: 'Crown',
  flame: 'Flame',
  shield: 'Shield',
  calendar: 'Calendar',
  'calendar-checks': 'CalendarCheck',
  gift: 'Gift',
  users: 'Users',
  medal: 'Medal',
  collection: 'Album',
  collections: 'Album',
  plugin: 'Puzzle',
  settings: 'Settings',
};

const SAMPLE_BADGES: Badge[] = [
  { id: 'badge-xp-100', name: 'Mestre Iniciante', description: 'Alcançar 100 XP', iconName: 'star', color: '#c9a655', pointsReward: 10, triggerType: 'xp', triggerValue: 100 },
  { id: 'badge-xp-500', name: 'Líder de XP', description: 'Alcançar 500 XP', iconName: 'trophy', color: '#c9a655', pointsReward: 25, triggerType: 'xp', triggerValue: 500 },
  { id: 'badge-xp-1000', name: 'Lenda do XP', description: 'Alcançar 1.000 XP', iconName: 'crown', color: '#c9a655', pointsReward: 50, triggerType: 'xp', triggerValue: 1000 },
  { id: 'badge-streak-7', name: 'Frequência Semanal', description: '7 dias consecutivos', iconName: 'calendar', color: '#c9a655', pointsReward: 15, triggerType: 'streak', triggerValue: 7 },
  { id: 'badge-streak-30', name: 'Persistente', description: '30 dias consecutivos', iconName: 'calendar-checks', color: '#c9a655', pointsReward: 30, triggerType: 'streak', triggerValue: 30 },
  { id: 'badge-streak-365', name: 'Aniversário', description: '1 ano de uso', iconName: 'gift', color: '#c9a655', pointsReward: 100, triggerType: 'streak', triggerValue: 365 },
  { id: 'badge-event-1', name: 'Participante', description: 'Participar de evento', iconName: 'users', color: '#c9a655', pointsReward: 20, triggerType: 'event', triggerValue: 1 },
  { id: 'badge-event-3', name: 'Vencedor', description: 'Top 3 em evento', iconName: 'medal', color: '#c9a655', pointsReward: 40, triggerType: 'event', triggerValue: 3 },
  { id: 'badge-event-5', name: 'Campeão', description: 'Vencer 5 eventos', iconName: 'trophy', color: '#c9a655', pointsReward: 75, triggerType: 'event', triggerValue: 5 },
  { id: 'badge-collect-5', name: 'Coletor Inicial', description: '5 badges conquistados', iconName: 'album', color: '#c9a655', pointsReward: 35, triggerType: 'collection', triggerValue: 5 },
  { id: 'badge-collect-10', name: 'Colecionador', description: '10 badges conquistados', iconName: 'album', color: '#c9a655', pointsReward: 70, triggerType: 'collection', triggerValue: 10 },
  { id: 'badge-collect-20', name: 'Mestre de Coleção', description: '20 badges conquistados', iconName: 'trophy', color: '#c9a655', pointsReward: 120, triggerType: 'collection', triggerValue: 20 },
  { id: 'badge-admin-create', name: 'Criador de Badges', description: 'Criar badges', iconName: 'puzzle', color: '#c9a655', pointsReward: 200, triggerType: 'superadmin', triggerValue: 1 },
  { id: 'badge-admin-10', name: 'Gestor de Badges', description: 'Gerenciar 10 badges', iconName: 'settings', color: '#c9a655', pointsReward: 300, triggerType: 'superadmin', triggerValue: 10 },
];

export const badgeMockStore = {
  _store: {} as Record<string, Badge>,
  _userStore: {} as Record<string, UserBadge>,

  init: () => {
    SAMPLE_BADGES.forEach(b => { badgeMockStore._store[b.id] = b; });
  },

  create: async (badge: Omit<Badge, 'id'>): Promise<Badge> => {
    const id = `badge-${Date.now()}`;
    const newBadge: Badge = { ...BADGE_DEFAULTS, ...badge, id };
    badgeMockStore._store[id] = newBadge;
    return newBadge;
  },

  read: async (id?: string): Promise<Badge[] | Badge> => {
    if (id) return badgeMockStore._store[id];
    return Object.values(badgeMockStore._store);
  },

  update: async (id: string, badge: Partial<Badge>): Promise<Badge> => {
    if (!badgeMockStore._store[id]) throw new Error('Badge not found');
    badgeMockStore._store[id] = { ...badgeMockStore._store[id], ...badge };
    return badgeMockStore._store[id];
  },

  delete: async (id: string): Promise<void> => { delete badgeMockStore._store[id]; },

  addUserBadge: async (userId: string, badgeId: string): Promise<UserBadge> => {
    const id = `ub-${userId}-${badgeId}`;
    const userBadge: UserBadge = { id, userId, badgeId, earnedAt: new Date().toISOString() };
    badgeMockStore._userStore[id] = userBadge;
    return userBadge;
  },

  getUserBadges: async (userId: string): Promise<UserBadge[]> => {
    return Object.values(badgeMockStore._userStore).filter(u => u.userId === userId);
  },

  toggleHide: async (userId: string, badgeId: string): Promise<void> => {
    const key = `ub-${userId}-${badgeId}`;
    if (badgeMockStore._userStore[key]) {
      badgeMockStore._userStore[key].hidden = !badgeMockStore._userStore[key].hidden;
    }
  },

  getAllBadges: async (): Promise<Badge[]> => Object.values(badgeMockStore._store),
  getAllUserBadges: async (): Promise<UserBadge[]> => Object.values(badgeMockStore._userStore),

  evaluateBadges: async (userId: string) => {
    const { mockDb } = await import('./lib/mockDb');
    const user = await mockDb.getProfileById(userId);
    if (!user) return;
    const userBadges = await badgeMockStore.getUserBadges(userId);
    const ownedIds = new Set(userBadges.map(ub => ub.badgeId));
    const streakDays = (user as any).streakDays || 0;
    const collectionCount = userBadges.length;
    for (const badge of Object.values(badgeMockStore._store)) {
      if (ownedIds.has(badge.id)) continue;
      let conditionMet = false;
      switch (badge.triggerType) {
        case 'xp': conditionMet = user.points >= badge.triggerValue; break;
        case 'streak': conditionMet = streakDays >= badge.triggerValue; break;
        case 'collection': conditionMet = collectionCount >= badge.triggerValue; break;
        default: conditionMet = false;
      }
      if (conditionMet) {
        await badgeMockStore.addUserBadge(userId, badge.id);
        if (badge.pointsReward) await mockDb.addPoints(userId, badge.pointsReward);
      }
    }
  },
};