import { useState, useEffect } from 'react';
import { mockDb } from '../../lib/mockDb';
import { Badge, BadgeWithDetails } from '../../types';
import { Star, BookOpen, Award, Rocket, Trophy, Diamond, Crown, Flame, Shield, Lock } from 'lucide-react';

interface BadgeDisplayProps {
  userId: string;
  showLocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const ICONS = {
  star: Star,
  book: BookOpen,
  graduation: Award,
  rocket: Rocket,
  trophy: Trophy,
  diamond: Diamond,
  crown: Crown,
  flame: Flame,
  shield: Shield,
  stars: Trophy,
};

const getMedalStyle = (color: string, isLocked: boolean): React.CSSProperties => {
  if (isLocked) {
    return {
      background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
      borderColor: '#4b5563',
      boxShadow: 'none',
    };
  }
  return {
    background: `linear-gradient(135deg, ${color}40 0%, ${color}80 50%, ${color}40 100%)`,
    borderColor: color,
    boxShadow: `0 4px 20px ${color}40, inset 0 2px 4px rgba(255,255,255,0.2)`,
  };
};

export function BadgeDisplay({ userId, showLocked = true, size = 'md' }: BadgeDisplayProps) {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<BadgeWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [userId]);

  const loadBadges = async () => {
    setIsLoading(true);
    try {
      const [badges, userB] = await Promise.all([
        mockDb.getBadges(),
        mockDb.getUserBadges(userId),
      ]);
      setAllBadges(badges);
      setUserBadges(userB);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };

  if (isLoading) {
    return (
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`${sizeClasses[size]} rounded-full animate-pulse`}
            style={{ backgroundColor: 'var(--color-surface)' }}
          />
        ))}
      </div>
    );
  }

  const displayBadges = showLocked 
    ? allBadges 
    : allBadges.filter(b => earnedBadgeIds.has(b.id));

  return (
    <div className="flex flex-wrap gap-3">
      {displayBadges.map((badge) => {
        const isEarned = earnedBadgeIds.has(badge.id);
        const IconComponent = ICONS[badge.iconName] || Star;
        
        return (
          <div
            key={badge.id}
            className={`relative group ${isEarned ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div
              className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300 border-2`}
              style={getMedalStyle(badge.color, !isEarned)}
            >
              {isEarned ? (
                <IconComponent 
                  size={iconSizes[size]} 
                  style={{ color: badge.color }}
                  className="drop-shadow-md"
                />
              ) : (
                <Lock 
                  size={iconSizes[size] - 4} 
                  style={{ color: '#6b7280' }}
                />
              )}
            </div>
            
            {isEarned && (
              <div 
                className="absolute inset-0 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ boxShadow: `0 0 20px ${badge.color}60` }}
              />
            )}
            
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"
              style={{ 
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <p className="font-bold">{badge.name}</p>
              <p style={{ color: 'var(--color-text-muted)' }}>{badge.description}</p>
              {badge.pointsReward > 0 && (
                <p style={{ color: 'var(--color-accent)' }}>+{badge.pointsReward} XP</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface BadgeGridProps {
  userId: string;
  showStats?: boolean;
}

export function BadgeGrid({ userId, showStats = true }: BadgeGridProps) {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<BadgeWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBadges();
  }, [userId]);

  const loadBadges = async () => {
    setIsLoading(true);
    try {
      const [badges, userB] = await Promise.all([
        mockDb.getBadges(),
        mockDb.getUserBadges(userId),
      ]);
      setAllBadges(badges);
      setUserBadges(userB);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

  if (isLoading) {
    return <div className="text-center p-4">Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      {showStats && (
        <div className="flex justify-between items-center p-3 rounded-lg" style={{ backgroundColor: 'var(--color-surface)' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>
            Badges conquistados
          </span>
          <span className="text-xl font-bold" style={{ color: 'var(--color-accent)' }}>
            {userBadges.length} / {allBadges.length}
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {allBadges.map((badge) => {
          const isEarned = earnedBadgeIds.has(badge.id);
          const userBadge = userBadges.find(ub => ub.badgeId === badge.id);
          const IconComponent = ICONS[badge.iconName] || Star;

          return (
            <div
              key={badge.id}
              className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                isEarned 
                  ? 'hover:scale-105 cursor-pointer' 
                  : 'opacity-40'
              }`}
              style={{ 
                backgroundColor: isEarned ? 'var(--color-surface)' : 'var(--color-bg)',
                border: isEarned ? `2px solid ${badge.color}40` : '2px solid var(--color-border)',
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={getMedalStyle(badge.color, !isEarned)}
              >
                {isEarned ? (
                  <IconComponent size={28} style={{ color: badge.color }} className="drop-shadow-md" />
                ) : (
                  <Lock size={20} style={{ color: '#6b7280' }} />
                )}
              </div>
              
              <p className="text-sm font-bold text-center" style={{ color: 'var(--color-text-main)' }}>
                {badge.name}
              </p>
              <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
                {badge.description}
              </p>
              
              {isEarned && userBadge && (
                <p className="text-xs mt-2" style={{ color: 'var(--color-success)' }}>
                  Conquistado em {new Date(userBadge.earnedAt).toLocaleDateString('pt-BR')}
                </p>
              )}
              
              {!isEarned && badge.pointsReward > 0 && (
                <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  +{badge.pointsReward} XP
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}