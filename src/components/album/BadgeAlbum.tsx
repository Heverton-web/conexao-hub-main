import { useState, useEffect } from 'react';
import { badgeMockStore, BadgeWithDetails, ICON_MAP } from '../../src/badges';
import { Star, Lock, Eye, EyeOff } from 'lucide-react';

type FilterType = 'all' | 'earned' | 'hidden';

export function BadgeAlbum({ userId }: { userId: string }) {
  const [badges, setBadges] = useState<BadgeWithDetails[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [userId]);

  const loadBadges = async () => {
    setLoading(true);
    const userBadges = await badgeMockStore.getUserBadges(userId);
    const allBadges = await badgeMockStore.getAllBadges();
    const enriched: BadgeWithDetails[] = allBadges.map(b => {
      const ub = userBadges.find(ub => ub.badgeId === b.id);
      return {
        ...ub!,
        badge: b,
        hidden: ub?.hidden ?? false,
      };
    });
    setBadges(enriched);
    setLoading(false);
  };

  const toggleHide = async (badgeId: string) => {
    await badgeMockStore.toggleHide(userId, badgeId);
    loadBadges();
  };

  const filtered = badges.filter(b => {
    if (filter === 'earned') return !!b.userId;
    if (filter === 'hidden') return b.hidden;
    return true;
  });

  if (loading) return <div className="text-center p-6">Carregando álbum...</div>;

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'earned', 'hidden'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition ${
              filter === f ? 'bg-amber-500 text-black' : 'bg-slate-700 text-amber-200'
            }`}
          >
            {{ all: 'Todos', earned: 'Conquistados', hidden: 'Ocultos' }[f]}
          </button>
        ))}
      </div>

      {/* Grade */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map(b => {
          const Icon = ICON_MAP[b.badge.iconName] || 'Star';
          const isEarned = !!b.userId && !b.hidden;
          return (
            <div
              key={b.badge.id}
              className={`relative p-3 rounded-xl border-2 transition-all duration-300 ${
                isEarned ? 'border-amber-500 bg-slate-800' : 'border-slate-600 opacity-50'
              }`}
              style={{ borderColor: isEarned ? b.badge.color : undefined }}
            >
              <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2"
                   style={{ background: `linear-gradient(135deg, ${b.badge.color}40, ${b.badge.color}80)` }}>
                {isEarned ? (
                  <Icon className="w-6 h-6" style={{ color: b.badge.color }} />
                ) : (
                  <Lock className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <p className="text-xs font-bold text-center truncate">{b.badge.name}</p>
              {b.hidden && (
                <div className="absolute top-1 right-1">
                  <Lock className="w-3 h-3 text-red-400" />
                </div>
              )}
              {isEarned && (
                <button
                  onClick={() => toggleHide(b.badge.id)}
                  className="absolute top-1 left-1 p-1 rounded bg-slate-700 hover:bg-slate-600"
                  title={b.hidden ? 'Mostrar' : 'Ocultar'}
                >
                  {b.hidden ? <Eye className="w-3 h-3 text-green-400" /> : <EyeOff className="w-3 h-3 text-amber-400" />}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}