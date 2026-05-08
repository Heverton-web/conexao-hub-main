import React, { useState } from 'react';
import { X, Loader2, Link, Zap } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { mockDb } from '../../lib/mockDb';
import { Webhook, WebhookEvent, WEBHOOK_EVENTS, Role } from '../../types';
import { toast } from 'sonner';

interface WebhookModalProps {
  webhook?: Webhook | null;
  onClose: () => void;
  onSave: () => void;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({ webhook, onClose, onSave }) => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: webhook?.name || '',
    url: webhook?.url || '',
    event: webhook?.event || '' as WebhookEvent,
    filterAllRoles: !webhook?.eventFilter?.roles || webhook.eventFilter.roles.length === 0,
    selectedRoles: webhook?.eventFilter?.roles || [],
    active: webhook?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url || !formData.event) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const eventFilter = formData.filterAllRoles
        ? undefined
        : { roles: formData.selectedRoles as Role[] };

      if (webhook?.id) {
        await mockDb.updateWebhook(webhook.id, {
          name: formData.name,
          url: formData.url,
          event: formData.event,
          eventFilter,
          active: formData.active,
        });
        toast.success('Webhook atualizado com sucesso!');
      } else {
        await mockDb.createWebhook({
          name: formData.name,
          url: formData.url,
          event: formData.event,
          eventFilter,
          active: formData.active,
        });
        toast.success('Webhook criado com sucesso!');
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast.error('Erro ao salvar webhook');
    } finally {
      setLoading(false);
    }
  };

  const roles: Role[] = ['client', 'distributor', 'consultant', 'manager'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl shadow-2xl border border-white/10" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-accent)', color: 'black' }}>
              <Zap size={20} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-main)' }}>
              {webhook ? 'Editar Webhook' : 'Novo Webhook'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} style={{ color: 'var(--color-text-muted)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-main)' }}>
              Nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Notificação Novo Usuário"
              className="w-full p-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 outline-none"
              style={{ color: 'var(--color-text-main)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-main)' }}>
              URL do Endpoint *
            </label>
            <div className="relative">
              <Link size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://api.exemplo.com/webhook"
                className="w-full pl-10 p-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 outline-none"
                style={{ color: 'var(--color-text-main)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-main)' }}>
              Evento *
            </label>
            <select
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value as WebhookEvent })}
              className="w-full p-3 rounded-xl border border-white/10 bg-white/5 focus:ring-2 outline-none"
              style={{ color: 'var(--color-text-main)' }}
            >
              <option value="">Selecione um evento</option>
              {WEBHOOK_EVENTS.map((ev) => (
                <option key={ev.value} value={ev.value}>
                  {ev.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.filterAllRoles}
                onChange={(e) => setFormData({ ...formData, filterAllRoles: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm" style={{ color: 'var(--color-text-main)' }}>
                Todos os usuários
              </span>
            </label>

            {!formData.filterAllRoles && (
              <div className="flex flex-wrap gap-2 pl-7">
                {roles.map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer"
                    style={{
                      backgroundColor: formData.selectedRoles.includes(role) ? 'var(--color-accent)' : 'transparent',
                      borderColor: 'var(--color-border)',
                      color: formData.selectedRoles.includes(role) ? 'black' : 'var(--color-text-main)',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedRoles.includes(role)}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...formData.selectedRoles, role]
                          : formData.selectedRoles.filter((r) => r !== role);
                        setFormData({ ...formData, selectedRoles: newRoles });
                      }}
                      className="hidden"
                    />
                    <span className="text-sm capitalize">{role}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={`w-11 h-6 rounded-full transition-colors ${formData.active ? 'bg-emerald-500' : 'bg-white/20'}`}
                onClick={() => setFormData({ ...formData, active: !formData.active })}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform mt-1 ${formData.active ? 'translate-x-5 ml-1' : 'translate-x-1'}`}
                />
              </div>
              <span className="text-sm" style={{ color: 'var(--color-text-main)' }}>
                Webhook ativo
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 font-medium transition-colors hover:bg-white/5"
              style={{ color: 'var(--color-text-main)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-medium transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-accent)', color: 'black' }}
            >
              {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};