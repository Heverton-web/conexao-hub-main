import React, { useState } from 'react';
import { X, Award, Save, Star, BookOpen, Rocket, Trophy, Diamond, Crown, Flame, Shield, LucideIcon } from 'lucide-react';
import { Badge, BadgeTriggerType } from '@/shared/types/types';
import { mockDb } from '@/infrastructure/database/mockDb';
import { toast } from 'sonner';

interface BadgeFormModalProps {
  badge?: Badge | null;
  onClose: () => void;
  onSave: () => void;
}

type BadgeIconName = 'star' | 'book' | 'graduation' | 'rocket' | 'trophy' | 'diamond' | 'crown' | 'flame' | 'shield' | 'stars';

const ICONS: { id: BadgeIconName; icon: LucideIcon }[] = [
  { id: 'star',       icon: Star },
  { id: 'book',       icon: BookOpen },
  { id: 'graduation', icon: Award },
  { id: 'rocket',     icon: Rocket },
  { id: 'trophy',     icon: Trophy },
  { id: 'diamond',    icon: Diamond },
  { id: 'crown',      icon: Crown },
  { id: 'flame',      icon: Flame },
  { id: 'shield',     icon: Shield },
  { id: 'stars',      icon: Trophy },
];

const TRIGGER_TYPES: { value: BadgeTriggerType; label: string }[] = [
  { value: 'material_completed',  label: 'Materiais Completados' },
  { value: 'collection_completed', label: 'Trilhas Completadas' },
  { value: 'points_reached',      label: 'XP Atingido' },
  { value: 'streak_days',         label: 'Dias de Sequência' },
  { value: 'ranking_position',    label: 'Posição no Ranking' },
  { value: 'login_count',         label: 'Número de Logins' },
];

export const BadgeFormModal: React.FC<BadgeFormModalProps> = ({ badge, onClose, onSave }) => {
  const [name,         setName]         = useState(badge?.name         || '');
  const [description,  setDescription]  = useState(badge?.description  || '');
  const [iconName,     setIconName]     = useState<BadgeIconName>(badge?.iconName || 'star');
  const [triggerType,  setTriggerType]  = useState<BadgeTriggerType>(badge?.triggerType || 'material_completed');
  const [triggerValue, setTriggerValue] = useState(badge?.triggerValue ?? 1);
  const [pointsReward, setPointsReward] = useState(badge?.pointsReward ?? 0);
  const [color,        setColor]        = useState(badge?.color        || '#c9a655');
  const [isSaving,     setIsSaving]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = { name, description, iconName, triggerType, triggerValue, pointsReward, color };
      if (badge) {
        await mockDb.updateBadge(badge.id, data);
        toast.success('Badge atualizado com sucesso!');
      } else {
        await mockDb.createBadge(data);
        toast.success('Badge criado com sucesso!');
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving badge:', error);
      toast.error('Erro ao salvar badge');
    } finally {
      setIsSaving(false);
    }
  };

  // Ícone selecionado para preview
  const SelectedIcon = ICONS.find(i => i.id === iconName)?.icon ?? Award;

  return (
    /* Overlay — igual ao padrão dos outros modais */
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-overlay, rgba(0,0,0,0.6))' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Painel do modal */}
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-up"
        style={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border-subtle, rgba(255,255,255,0.08))',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
        }}
      >
        {/* Linha decorativa superior — gradiente accent assinatura */}
        <div style={{
          height: '3px',
          background: 'linear-gradient(90deg, var(--color-gradient-start, #c9a655) 0%, var(--color-gradient-mid, #e8d48b) 50%, var(--color-gradient-end, #a8873a) 100%)',
        }} />

        {/* Header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid var(--color-border-subtle, rgba(255,255,255,0.06))' }}
        >
          <div className="flex items-center gap-3">
            <div className="icon-box-sm">
              <Award size={16} />
            </div>
            <div>
              <h3 className="font-bold text-base" style={{ color: 'var(--color-text-main)' }}>
                {badge ? 'Editar Badge' : 'Novo Badge'}
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {badge ? 'Altere as propriedades da conquista' : 'Configure uma nova conquista para a plataforma'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto" style={{ maxHeight: '75vh' }}>

          {/* Preview do badge */}
          <div className="flex items-center gap-4 p-4 rounded-xl" style={{
            background: 'linear-gradient(135deg, var(--color-gradient-start, #c9a655)15 0%, var(--color-gradient-start, #c9a655)08 100%)',
            border: '1px solid var(--color-accent, #c9a655)30',
          }}>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${color}40 0%, ${color}80 50%, ${color}40 100%)`,
                border: `2px solid ${color}`,
                boxShadow: `0 4px 16px ${color}40`,
              }}
            >
              <SelectedIcon size={24} style={{ color }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--color-text-main)' }}>
                {name || 'Nome do Badge'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {description || 'Descrição da conquista'}
              </p>
              <p className="text-xs mt-1 font-medium" style={{ color: 'var(--color-accent)' }}>
                +{pointsReward} XP de recompensa
              </p>
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Nome do Badge
            </label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Mestre do Conhecimento"
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-input-border, #334155)',
                color: 'var(--color-text-main)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent, #c9a655)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-input-border, #334155)')}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Descrição
            </label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="O que o usuário precisa fazer para ganhar?"
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all resize-none"
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-input-border, #334155)',
                color: 'var(--color-text-main)',
              }}
              onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent, #c9a655)')}
              onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-input-border, #334155)')}
            />
          </div>

          {/* Gatilho + Valor */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Gatilho
              </label>
              <select
                value={triggerType}
                onChange={e => setTriggerType(e.target.value as BadgeTriggerType)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-input-border, #334155)',
                  color: 'var(--color-text-main)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent, #c9a655)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-input-border, #334155)')}
              >
                {TRIGGER_TYPES.map(t => (
                  <option key={t.value} value={t.value} style={{ backgroundColor: 'var(--color-surface)' }}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Valor Alvo
              </label>
              <input
                type="number"
                required
                min={1}
                value={triggerValue}
                onChange={e => setTriggerValue(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-input-border, #334155)',
                  color: 'var(--color-text-main)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent, #c9a655)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-input-border, #334155)')}
              />
            </div>
          </div>

          {/* Recompensa XP + Cor */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Recompensa (XP)
              </label>
              <input
                type="number"
                min={0}
                value={pointsReward}
                onChange={e => setPointsReward(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-input-border, #334155)',
                  color: 'var(--color-text-main)',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent, #c9a655)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-input-border, #334155)')}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Cor do Badge
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer flex-shrink-0"
                  style={{
                    border: '1px solid var(--color-input-border, #334155)',
                    backgroundColor: 'var(--color-bg)',
                    padding: '2px',
                  }}
                />
                <input
                  type="text"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none transition-all font-mono"
                  style={{
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-input-border, #334155)',
                    color: 'var(--color-text-main)',
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'var(--color-accent, #c9a655)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'var(--color-input-border, #334155)')}
                />
              </div>
            </div>
          </div>

          {/* Seletor de Ícone */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
              Ícone
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(item => {
                const Icon = item.icon;
                const isSelected = iconName === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setIconName(item.id)}
                    className="p-3 rounded-xl transition-all"
                    style={{
                      backgroundColor: isSelected ? `${color}20` : 'var(--color-bg)',
                      border: isSelected ? `1.5px solid ${color}` : '1.5px solid var(--color-input-border, #334155)',
                      boxShadow: isSelected ? `0 0 12px ${color}30` : 'none',
                    }}
                  >
                    <Icon size={18} style={{ color: isSelected ? color : 'var(--color-text-muted)' }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rodapé com botões */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all"
              style={{
                backgroundColor: 'var(--color-bg)',
                border: '1px solid var(--color-accent, #c9a655)30',
                color: 'var(--color-text-main)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                e.currentTarget.style.borderColor = 'var(--color-accent, #c9a655)60';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg)';
                e.currentTarget.style.borderColor = 'var(--color-accent, #c9a655)30';
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, #c9a655 0%, #e8d48b 40%, #a8873a 70%, #c9a655 100%)',
                color: '#0f172a',
                fontWeight: 800,
                letterSpacing: '0.01em',
                boxShadow: '0 4px 20px rgba(201,166,85,0.45)',
              }}
            >
              {isSaving ? 'Salvando...' : <><Save size={16} /> Salvar Badge</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
