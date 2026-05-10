import React from 'react';
import { Role } from '@/shared/types/types';

interface MockLoginCardsProps {
  onLogin: (role: Role) => void;
  isVisible: boolean;
}

const mockRoles = [
  { role: 'client' as Role, label: 'Cliente' },
  { role: 'distributor' as Role, label: 'Distribuidor' },
  { role: 'consultant' as Role, label: 'Consultor' },
  { role: 'manager' as Role, label: 'Gestor' },
  { role: 'super_admin' as Role, label: 'Admin' },
];

export const MockLoginCards: React.FC<MockLoginCardsProps> = ({ onLogin, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="mt-6 pt-6 border-t border-white/10">
      <p className="text-xs font-medium text-center mb-3" style={{ color: 'var(--color-text-muted)' }}>Acesso Rápido (Demo)</p>
      <div className="grid grid-cols-2 gap-2">
        {mockRoles.map((item) => (
          <button
            key={item.role}
            onClick={() => onLogin(item.role)}
            className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-center group/card"
          >
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-main)' }}>{item.label}</span>
            <span className="block text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Demo</span>
          </button>
        ))}
      </div>
    </div>
  );
};