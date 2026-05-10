import React, { useEffect, useState } from 'react';
import { Zap, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockDb } from '../../infrastructure/database/mockDb';
import { Webhook, WebhookEvent, WEBHOOK_EVENTS, Role } from '@/shared/types/types';
import { toast } from 'sonner';

export const WebhooksPage: React.FC = () => {
  const navigate = useNavigate();
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null);

  const loadWebhooks = async () => {
    setLoading(true);
    try {
      const data = await mockDb.getWebhooks();
      setWebhooks(data);
    } catch (error) {
      console.error('Error loading webhooks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWebhooks();
  }, []);

  const handleDelete = async (webhook: Webhook) => {
    if (confirm(`Excluir webhook "${webhook.name}"?`)) {
      await mockDb.deleteWebhook(webhook.id);
      loadWebhooks();
      toast.success('Webhook excluído');
    }
  };

  const handleSave = async (data: {
    name: string;
    url: string;
    event: string;
    active: boolean;
  }) => {
    try {
      if (editingWebhook?.id) {
        await mockDb.updateWebhook(editingWebhook.id, data);
        toast.success('Webhook atualizado');
      } else {
        await mockDb.createWebhook(data);
        toast.success('Webhook criado');
      }
      setModalOpen(false);
      setEditingWebhook(null);
      loadWebhooks();
    } catch (error) {
      console.error('Error saving webhook:', error);
      toast.error('Erro ao salvar webhook');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="text-center" style={{ color: 'var(--color-text-muted)' }}>
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg hover:bg-white/10"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <ArrowLeft size={24} />
          </button>
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-accent)' }}>
            <Zap size={24} color="black" />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-main)' }}>
            Webhooks
          </h1>
        </div>

        <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--color-surface)' }}>
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Configure webhooks para receber notificações em tempo real sobre eventos do sistema.
            </p>
            <button
              onClick={() => { setEditingWebhook(null); setModalOpen(true); }}
              className="liquid-glass-gold px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
              style={{ color: 'var(--color-accent)' }}
            >
              <Plus size={16} /> Novo Webhook
            </button>
          </div>

          {webhooks.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
              <Zap size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-sm">Nenhum webhook configurado</p>
              <p className="text-xs mt-1">Clique em "Novo Webhook" para adicionar</p>
            </div>
          ) : (
            <div className="space-y-3">
              {webhooks.map((webhook) => (
                <div
                  key={webhook.id}
                  className="p-4 rounded-xl flex items-center gap-4"
                  style={{ backgroundColor: 'var(--color-bg)' }}
                >
                  <div className="p-2 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 10%, transparent)' }}>
                    <Zap size={20} style={{ color: 'var(--color-accent)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text-main)' }}>
                      {webhook.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {webhook.url}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: 'var(--color-accent)', color: 'black' }}
                      >
                        {webhook.event}
                      </span>
                      {!webhook.active && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">
                          Inativo
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => { setEditingWebhook(webhook); setModalOpen(true); }}
                      className="p-2 rounded-lg hover:bg-white/10"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(webhook)}
                      className="p-2 rounded-lg hover:bg-white/10"
                      style={{ color: 'var(--color-error)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <WebhookFormModal
          webhook={editingWebhook}
          onClose={() => { setModalOpen(false); setEditingWebhook(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

interface WebhookFormModalProps {
  webhook?: Webhook | null;
  onClose: () => void;
  onSave: (data: { name: string; url: string; event: string; active: boolean }) => void;
}

const WebhookFormModal: React.FC<WebhookFormModalProps> = ({ webhook, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: webhook?.name || '',
    url: webhook?.url || '',
    event: webhook?.event || '',
    active: webhook?.active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.url || !formData.event) {
      toast.error('Preencha todos os campos');
      return;
    }
    setLoading(true);
    onSave(formData);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl shadow-2xl border border-white/10" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-accent)', color: 'black' }}>
              <Zap size={20} />
            </div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-main)' }}>
              {webhook ? 'Editar Webhook' : 'Novo Webhook'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
            <span style={{ color: 'var(--color-text-muted)' }}>✕</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-main)' }}>
              Nome *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-white/10 bg-white/5"
              style={{ color: 'var(--color-text-main)' }}
              placeholder="Ex: Notificação Novo Usuário"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-main)' }}>
              URL do Endpoint *
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full p-3 rounded-xl border border-white/10 bg-white/5"
              style={{ color: 'var(--color-text-main)' }}
              placeholder="https://api.exemplo.com/webhook"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-main)' }}>
              Evento *
            </label>
            <select
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              className="w-full p-3 rounded-xl border border-white/10 bg-white/5"
              style={{ color: 'var(--color-text-main)' }}
            >
              <option value="">Selecione um evento</option>
              {WEBHOOK_EVENTS.map((ev) => (
                <option key={ev.value} value={ev.value}>{ev.label}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm" style={{ color: 'var(--color-text-main)' }}>Webhook ativo</span>
          </label>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 font-medium"
              style={{ color: 'var(--color-text-main)' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl font-medium"
              style={{ backgroundColor: 'var(--color-accent)', color: 'black' }}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};