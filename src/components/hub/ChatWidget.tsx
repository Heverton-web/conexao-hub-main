import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { Send, X, Bot, Trash2, Loader2, FileText, Layers } from 'lucide-react';
import { colorMix } from '../../lib/utils';

interface ChatWidgetProps {
  className?: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    await sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'material': return <FileText size={14} />;
      case 'collection': return <Layers size={14} />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Botão flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-gradient-end) 100%)',
            color: 'var(--color-accent-foreground)',
          }}
        >
          <Bot size={20} />
          <span className="font-medium text-sm">Assistente</span>
        </button>
      )}

      {/* Chat container */}
      {isOpen && (
        <div
          className="w-[380px] h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-gradient-end) 100%)',
              color: 'var(--color-accent-foreground)',
            }}
          >
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <span className="font-semibold">Assistente IA</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                title="Limpar conversa"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot size={48} className="mx-auto mb-3 opacity-50" style={{ color: 'var(--color-text-muted)' }} />
                <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  Olá! Como posso ajudar?
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  Pergunte sobre materiais, trilhas ou conteúdos da plataforma
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'rounded-br-md'
                      : 'rounded-bl-md'
                  }`}
                  style={{
                    backgroundColor: msg.role === 'user'
                      ? 'var(--color-accent)'
                      : 'var(--color-card)',
                    color: msg.role === 'user'
                      ? 'var(--color-accent-foreground)'
                      : 'var(--color-text-main)',
                  }}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Resultados da busca */}
                  {msg.materials && msg.materials.length > 0 && (
                    <div className="mt-3 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Materiais relacionados:
                      </p>
                      <div className="space-y-1">
                        {msg.materials.map((mat) => (
                          <a
                            key={mat.id}
                            href={mat.url}
                            className="flex items-center gap-2 p-2 rounded-lg text-xs transition-colors hover:opacity-80"
                            style={{ backgroundColor: 'var(--color-surface-hover)' }}
                          >
                            <span style={{ color: 'var(--color-accent)' }}>{getIconForType('material')}</span>
                            <span className="truncate">{mat.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.collections && msg.collections.length > 0 && (
                    <div className="mt-3 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                      <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
                        Trilhas relacionadas:
                      </p>
                      <div className="space-y-1">
                        {msg.collections.map((col) => (
                          <a
                            key={col.id}
                            href={col.url}
                            className="flex items-center gap-2 p-2 rounded-lg text-xs transition-colors hover:opacity-80"
                            style={{ backgroundColor: 'var(--color-surface-hover)' }}
                          >
                            <span style={{ color: 'var(--color-success)' }}>{getIconForType('collection')}</span>
                            <span className="truncate">{col.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl rounded-bl-md px-4 py-3"
                  style={{ backgroundColor: 'var(--color-card)' }}
                >
                  <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">Buscando...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{ backgroundColor: 'var(--color-error-bg)', color: 'var(--color-error)' }}
              >
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua pergunta..."
                className="flex-1 resize-none rounded-xl px-3 py-2 text-sm outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-input-bg)',
                  border: '1px solid var(--color-input-border)',
                  color: 'var(--color-text-main)',
                }}
                rows={1}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-accent)',
                  color: 'var(--color-accent-foreground)',
                }}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;