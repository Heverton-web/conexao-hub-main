import { useState, useEffect } from 'react';
import { mockDb } from '@/infrastructure/database/mockDb';
import { Trophy, ChevronDown, User, Star, ChevronUp, ChevronDown as ChevronDownIcon, Eye, EyeOff, Crown } from 'lucide-react';
import { Role, UserLevel } from '@/shared/types/types';

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
  showToggle?: boolean;
  defaultExpanded?: boolean;
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

export function RankingBoard({ currentUserId, showToggle = true, defaultExpanded = true }: RankingBoardProps) {
  const [rankings, setRankings] = useState<UserRanking[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

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

  const top3 = rankings.slice(0, 3);

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

        <div className="flex items-center gap-3">
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

          {showToggle && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-80"
              style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}
            >
              {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
              <span className="hidden sm:inline">{isExpanded ? 'Ocultar' : 'Ver'}</span>
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
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
              {/* PODIUM - Top 3 Ultra Premium */}
              <div className="flex items-end justify-center gap-2 sm:gap-6 mb-10 mt-8">
                {/* 2º Lugar */}
                {top3[1] && (
                  <div className="flex flex-col items-center group">
                    <div className="relative mb-3">
                      <div className="absolute -inset-2 bg-slate-400/20 blur-xl rounded-full group-hover:bg-slate-400/40 transition-all duration-500" />
                      <div 
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 border-slate-400/30 backdrop-blur-md"
                        style={{ background: 'linear-gradient(135deg, rgba(192, 192, 192, 0.4) 0%, rgba(192, 192, 192, 0.1) 100%)' }}
                      >
                        <Trophy size={32} className="text-slate-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                      </div>
                    </div>
                    <div 
                      className="w-16 sm:w-24 rounded-t-2xl flex flex-col items-center px-2 py-4 border-t border-x border-white/10"
                      style={{ 
                        background: 'linear-gradient(to bottom, rgba(192, 192, 192, 0.2), transparent)',
                        height: '70px',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <span className="text-[10px] uppercase tracking-wider mb-1 opacity-50" style={{ color: 'var(--color-text-main)' }}>2º Lugar</span>
                      <span className="text-xs font-bold truncate max-w-full" style={{ color: 'var(--color-text-main)' }}>
                        {top3[1].name.split(' ')[0]}
                      </span>
                      <span className="text-[11px] font-black mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        {top3[1].points} <span className="text-[8px] opacity-50">XP</span>
                      </span>
                    </div>
                  </div>
                )}

                {/* 1º Lugar - O Rei/Rainha */}
                {top3[0] && (
                  <div className="flex flex-col items-center -mb-2 group animate-bounce-slow">
                    <div className="relative mb-4">
                      {/* Brilho de Fundo (Halo) */}
                      <div className="absolute -inset-6 bg-[var(--color-accent)] opacity-20 blur-3xl rounded-full animate-pulse" />
                      <div className="absolute -inset-1 bg-gradient-to-t from-[var(--color-accent)] to-transparent opacity-40 blur-md rounded-full" />
                      
                      <div 
                        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center border-4 border-[var(--color-accent)] shadow-[0_0_30px_rgba(201,166,85,0.4)] z-10 bg-[var(--color-bg)]/80 backdrop-blur-xl"
                      >
                        <Trophy size={48} className="text-[var(--color-accent)] drop-shadow-[0_0_12px_rgba(201,166,85,0.6)]" />
                      </div>
                      
                      {/* Coroa vetorial premium */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 drop-shadow-[0_0_15px_rgba(201,166,85,0.8)] z-20">
                        <Crown size={32} className="fill-[var(--color-accent)] text-[var(--color-accent)] animate-pulse" />
                      </div>
                    </div>

                    <div 
                      className="w-24 sm:w-32 rounded-t-3xl flex flex-col items-center px-2 py-5 border-t border-x border-[var(--color-accent)]/30"
                      style={{ 
                        background: 'linear-gradient(to bottom, rgba(201, 166, 85, 0.25), transparent)',
                        height: '100px',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 -10px 40px rgba(0,0,0,0.3)'
                      }}
                    >
                      <span className="text-[10px] uppercase tracking-[0.2em] mb-1 font-black" style={{ color: 'var(--color-accent)' }}>CAMPEÃO</span>
                      <span className="text-sm font-black truncate max-w-full" style={{ color: 'var(--color-text-main)' }}>
                        {top3[0].name.split(' ')[0]}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm font-black" style={{ color: 'var(--color-accent)' }}>
                          {top3[0].points}
                        </span>
                        <span className="text-[9px] font-bold opacity-60" style={{ color: 'var(--color-text-main)' }}>XP</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3º Lugar */}
                {top3[2] && (
                  <div className="flex flex-col items-center group">
                    <div className="relative mb-3">
                      <div className="absolute -inset-2 bg-orange-600/10 blur-xl rounded-full group-hover:bg-orange-600/30 transition-all duration-500" />
                      <div 
                        className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 border-orange-800/30 backdrop-blur-md"
                        style={{ background: 'linear-gradient(135deg, rgba(205, 127, 50, 0.4) 0%, rgba(205, 127, 50, 0.1) 100%)' }}
                      >
                        <Trophy size={32} className="text-orange-700 drop-shadow-[0_0_8px_rgba(205,127,50,0.3)]" />
                      </div>
                    </div>
                    <div 
                      className="w-16 sm:w-24 rounded-t-2xl flex flex-col items-center px-2 py-4 border-t border-x border-white/10"
                      style={{ 
                        background: 'linear-gradient(to bottom, rgba(205, 127, 50, 0.2), transparent)',
                        height: '60px',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      <span className="text-[10px] uppercase tracking-wider mb-1 opacity-50" style={{ color: 'var(--color-text-main)' }}>3º Lugar</span>
                      <span className="text-xs font-bold truncate max-w-full" style={{ color: 'var(--color-text-main)' }}>
                        {top3[2].name.split(' ')[0]}
                      </span>
                      <span className="text-[11px] font-black mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        {top3[2].points} <span className="text-[8px] opacity-50">XP</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Lista completa (opcional - abaixo do podium) */}
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
                    Sua posição: <strong style={{ color: 'var(--color-accent)' }}>{currentUserPosition}º</strong> ({rankings.find(r => r.userId === currentUserId)?.points} XP)
                  </span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}