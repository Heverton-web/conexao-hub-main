import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from '@/shared/types/types';
import { Star, BookOpen, Award, Rocket, Trophy, Diamond, Crown, Flame, Shield, X } from 'lucide-react';

interface BadgeNotificationProps {
  badge: Badge | null;
  onClose: () => void;
  autoCloseDelay?: number;
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

export function BadgeNotification({ badge, onClose, autoCloseDelay = 5000 }: BadgeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (badge) {
      setIsVisible(true);
      setTimeout(() => setShowContent(true), 100);
      
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [badge]);

  const handleClose = () => {
    setShowContent(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 300);
  };

  if (!badge || !isVisible) return null;

  const IconComponent = ICONS[badge.iconName] || Star;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
    >
      <div 
        className={`relative w-full max-w-md p-8 rounded-2xl transform transition-all duration-500 ${
          showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        style={{ 
          backgroundColor: 'var(--color-surface)',
          boxShadow: `0 0 60px ${badge.color}40`,
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-2 rounded-full hover:opacity-80 transition-opacity"
          style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}
        >
          <X size={18} />
        </button>

        <div className="text-center space-y-6">
          <p 
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: 'var(--color-accent)' }}
          >
            Badge Conquistado!
          </p>

          <div className="relative inline-block">
            <div 
              className="w-32 h-32 mx-auto rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${badge.color}40 0%, ${badge.color}80 50%, ${badge.color}40 100%)`,
                border: `4px solid ${badge.color}`,
                boxShadow: `0 8px 40px ${badge.color}50`,
              }}
            >
              <IconComponent size={56} style={{ color: badge.color }} className="drop-shadow-lg" />
            </div>

            <div 
              className="absolute inset-0 rounded-full overflow-hidden"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)' }}
            >
              <div 
                className="absolute top-0 left-0 w-full h-full animate-shine"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                  transform: 'translateX(-100%)',
                  animation: 'shine 1.5s ease-in-out infinite',
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h2 
              className="text-2xl font-bold"
              style={{ color: 'var(--color-text-main)' }}
            >
              {badge.name}
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              {badge.description}
            </p>
          </div>

          {badge.pointsReward > 0 && (
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ 
                backgroundColor: `${badge.color}20`,
                color: badge.color,
              }}
            >
              <Star size={16} style={{ fill: badge.color }} />
              <span className="text-lg font-bold">+{badge.pointsReward} XP</span>
            </div>
          )}

          <button
            onClick={handleClose}
            className="px-8 py-3 rounded-xl font-bold transition-all hover:opacity-90"
            style={{ 
              backgroundColor: badge.color,
              color: '#000',
            }}
          >
            Continuar
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
    </div>,
    document.body
  );
}

export function useBadgeNotification() {
  const [awardedBadge, setAwardedBadge] = useState<Badge | null>(null);

  const showBadge = (badge: Badge) => {
    setAwardedBadge(badge);
  };

  const clearBadge = () => {
    setAwardedBadge(null);
  };

  return {
    awardedBadge,
    showBadge,
    clearBadge,
    BadgeNotificationComponent: () => (
      <BadgeNotification 
        badge={awardedBadge} 
        onClose={clearBadge} 
      />
    ),
  };
}