import { useState, useEffect } from 'react';
import { mockDb } from '../../lib/mockDb';
import { Trophy, ChevronDown, User, Star } from 'lucide-react';
import { Role, UserLevel } from '../../types';

interface UserRanking {
  position: number;
  userId: string;
  name: string;
  role: Role;
  points: number;
  level: UserLevel;
}

interface RankingBoardProps {
  currentUserId?: string;
}

const ROLE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'client', label: 'Cliente' },
  { value: 'distributor', label: 'Distribuidor' },
  { value: 'consultant', label: 'Consultor' },
  { value: 'manager', label: 'Gestor' },
];

const getLevelIcon = (level: UserLevel): string => {
  switch (level) {
    case 'Master': return '👑';
    case 'Ouro': return '🥇';
    case 'Prata': return '🥈';
    case 'Bronze': return '🥉';
    default: return '🌱';
  }
};

const getLevelColor = (level: UserLevel): string => {
  switch (level) {
    case 'Master': return '#c9a655';
    case 'Ouro': return '#ffd700';
    case 'Prata': return '#c0c0c0';
    case 'Bronze': return '#cd7f32';
    default: return '#888888';
  }
};

const getRoleBadgeColor = (role: Role): string => {
  switch (role) {
    case 'client': return '#10b981';
    case 'distributor': return '#f59e0b';
    case 'consultant': return '#6366f1';
    case 'manager': return '#8b5cf6';
    case 'super_admin': return '#ec4899';
    default: return '#6b7280';
  }
};

const getRoleLabel = (role: string): string => {
  switch (role) {
    case 'client': return 'Cliente';
    case 'distributor': return 'Distribuidor';
    case 'consultant': return 'Consultor';
    case 'manager': return 'Gestor';
    case 'super_admin': return 'Admin';
    default: return role;
  }
};

export function RankingBoard({ currentUserId }: RankingBoardProps) {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRanking();
  }, [roleFilter]);

  const loadRanking = async () => {
    setIsLoading(true);
    try {
      const data = await mockDb.getUserRanking(roleFilter);
      setRankings(data);
    } catch (error) {
      console.error('Erro ao carregar ranking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getHeaderTitle = () => {
    if (roleFilter === 'all') return 'RANKING GERAL';
    return `RANKING - ${getRoleLabel(roleFilter).toUpperCase()}`;
  };

  const currentUserPosition = currentUserId 
    ? rankings.findIndex(r => r.userId === currentUserId) + 1 
    : 0;

  return (
    <div className="liquid-glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'rgba(201, 166, 85, 0.2)' }}
          >
            <Trophy size={20} style={{ color: 'var(--color-accent)' }} />
          </div>
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-main)' }}>
              {getHeaderTitle()}
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {rankings.length} usuários
            </p>
          </div>
        </div>

        <div className="relative">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="appearance-none bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-2 pr-8 text-sm font-medium cursor-pointer"
            style={{ color: 'var(--color-text-main)' }}
          >
            {ROLE_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown 
            size={16} 
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: 'var(--color-text-muted)' }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          Carregando ranking...
        </div>
      ) : rankings.length === 0 ? (
        <div className="text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
          Nenhum usuário encontrado
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {rankings.slice(0, 10).map((user) => {
              const isCurrentUser = user.userId === currentUserId;
              
              return (
                <div 
                  key={user.userId}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isCurrentUser 
                      ? 'border-2' 
                      : ''
                  }`}
                  style={{
                    backgroundColor: isCurrentUser 
                      ? 'rgba(201, 166, 85, 0.1)' 
                      : 'var(--color-bg)',
                    borderColor: isCurrentUser 
                      ? 'var(--color-accent)' 
                      : 'transparent'
                  }}
                >
                  <div className="w-8 text-center">
                    {user.position <= 3 ? (
                      <span className="text-xl">
                        {user.position === 1 ? '🥇' : user.position === 2 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      <span 
                        className="text-sm font-bold"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        {user.position}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <User size={14} style={{ color: 'var(--color-text-muted)' }} />
                      <span 
                        className="font-medium truncate"
                        style={{ color: 'var(--color-text-main)' }}
                      >
                        {user.name}
                      </span>
                      {isCurrentUser && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ 
                            backgroundColor: 'var(--color-accent)', 
                            color: 'var(--color-bg)' 
                          }}
                        >
                          Você
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: getRoleBadgeColor(user.role) + '20',
                        color: getRoleBadgeColor(user.role)
                      }}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 min-w-[80px] justify-end">
                    <span style={{ color: getLevelColor(user.level) }}>
                      {getLevelIcon(user.level)}
                    </span>
                    <span 
                      className="text-sm font-bold"
                      style={{ color: 'var(--color-accent)' }}
                    >
                      {user.points}
                    </span>
                    <Star size={10} style={{ fill: 'var(--color-warning)', color: 'var(--color-warning)' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {currentUserPosition > 10 && (
            <div 
              className="mt-4 p-3 rounded-xl text-center"
              style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}
            >
              <span className="text-sm">
                Sua posição: <strong style={{ color: 'var(--color-accent)' }}>{currentUserPosition}º</strong> ({user.points} XP)
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}