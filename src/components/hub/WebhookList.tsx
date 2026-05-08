import React, { useEffect, useState } from 'react';
import { Zap, Plus, Edit, Trash2 } from 'lucide-react';
import { mockDb } from '../../lib/mockDb';
import { Webhook } from '../../types';

interface WebhookListProps {
  onEdit?: (webhook: Webhook) => void;
  onNew?: () => void;
}

export const WebhookList: React.FC<WebhookListProps> = ({ onEdit, onNew }) => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);

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
    }
  };

  if (loading) {
    return <div className="p-4 text-center" style={{ color: 'var(--color-text-muted)' }}>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Configure webhooks para receber notificações em tempo real sobre eventos do sistema.
        </p>
        {onNew && (
          <button
            onClick={onNew}
            className="liquid-glass px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
            style={{ color: 'var(--color-text-main)' }}
          >
            <Zap size={16} /> Novo Webhook
          </button>
        )}
      </div>

      {webhooks.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>
          <Zap size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-sm">Nenhum webhook configurado</p>
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
              </div>
              <div className="flex gap-1">
                {onEdit && (
                  <button
                    onClick={() => onEdit(webhook)}
                    className="p-2 rounded-lg"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    <Edit size={16} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(webhook)}
                  className="p-2 rounded-lg"
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
  );
};