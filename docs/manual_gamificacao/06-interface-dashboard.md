# 06. Interface no Dashboard

## Visão Geral

O sistema de gamificação está integrado ao Dashboard do usuário através de diversos elementos visuais que mostram progressão, pontos e conquistas.

---

## 1. Card de Gamificação Principal

### Localização

Presente no topo do Dashboard, após o menu lateral.

### Visual

```
┌─────────────────────────────────────────────────────────────┐
│  🏆 SEU PROGRESSO                                          │
│                                                             │
│  NÍVEL OURO        ───────────────────────  650 XP          │
│  ══════════════════════════════════════ 85%                │
│                                                             │
│  Próximo nível: Master (1000 XP)                            │
└─────────────────────────────────────────────────────────────┘
```

### Componente

```tsx
// Dashboard.tsx - dentro do return
<div className="liquid-glass rounded-2xl p-6 mb-6">
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs font-bold uppercase tracking-wider" 
          style={{ color: 'var(--color-text-muted)' }}>
      Nível {userLevel}
    </span>
    <span className="ml-auto text-xs font-bold" 
          style={{ color: 'var(--color-accent)' }}>
      {user.points} XP
    </span>
  </div>
  
  <Progress value={levelProgress} className="h-1.5" />
  
  {nextThreshold > user.points && (
    <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
      Próximo nível: {getUserLevel(user.points + (nextThreshold - user.points))} ({nextThreshold} XP)
    </p>
  )}
</div>
```

### Estilo CSS

```css
.gamification-card {
  background: linear-gradient(135deg, 
    rgba(201,166,85,0.1) 0%, 
    rgba(201,166,85,0.05) 100%);
  border: 1px solid rgba(201,166,85,0.2);
}
```

---

## 2. Indicador de XP nos Materiais

### Card de Material (Lista)

```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Kit Iniciante                         ⭐ 50 XP           │
│ PDF • Português • Ativo                                     │
└─────────────────────────────────────────────────────────────┘
```

### Código

```tsx
// Dashboard.tsx - no card do material
{mat.points > 0 && (
  <div className="flex items-center gap-1">
    <Star size={10} style={{ fill: 'var(--color-warning)', color: 'var(--color-warning)' }} />
    <span className="text-xs font-bold" style={{ color: 'var(--color-accent)' }}>
      {mat.points} XP
    </span>
  </div>
)}
```

---

## 3. Indicador de XP nas Trilhas

### Card de Trilha

```
┌─────────────────────────────────────────────────────────────┐
│ 📖 Kit Iniciante                              ⭐ 100 XP     │
│                                                             │
│ 5 materiais • 2 concluídos                                 │
│ ████████████░░░░░░░░ 40%                                   │
│                                                             │
│ 💰 Complete e ganhe +100 XP!                               │
└─────────────────────────────────────────────────────────────┘
```

### Código

```tsx
// CollectionCard.tsx
<div className="flex items-center gap-2">
  {collection.points > 0 && (
    <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
         style={{ 
           backgroundColor: 'var(--color-accent)', 
           color: 'var(--color-bg)' 
         }}>
      <Star size={10} style={{ fill: 'currentColor', color: 'currentColor' }} />
      {collection.points} XP
    </div>
  )}
</div>
```

### Detalhe da Trilha

```tsx
// Dashboard.tsx - collection detail
{selectedCollection.points > 0 && (
  <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm" 
       style={{ 
         backgroundColor: colorMix('var(--color-accent)', 15, 'rgba(201,166,85,0.15)'), 
         color: 'var(--color-accent)' 
       }}>
    <Star size={16} style={{ fill: 'var(--color-warning)', color: 'var(--color-warning)' }} />
    {selectedCollection.points} XP ao concluir
  </div>
)}
```

---

## 4. Componente de Celebração

### Quando Aparece

Ao completar uma trilha (todos os materiais com status `completed`).

### Visual

```
╔═══════════════════════════════════════════════════╗
║                                                   ║
║              🎉 TRILHA COMPLETADA! 🎉             ║
║                                                   ║
║         ┌─────────────────────────────────┐        ║
║         │     📖 Kit Iniciante            │        ║
║         │                                 │        ║
║         │         +100 XP                 │        ║
║         │                                 │        ║
║         │    ┌───────────────────┐       │        ║
║         │    │         OK         │       │        ║
║         │    └───────────────────┘       │        ║
║         └─────────────────────────────────┘        ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

### Código

```tsx
// Dashboard.tsx
const [celebration, setCelebration] = useState<{ 
  trailName: string; 
  bonusXp: number 
} | null>(null);

// No return:
<TrailCompletionCelebration
  isOpen={!!celebration}
  trailName={celebration?.trailName || ''}
  bonusXp={celebration?.bonusXp || 0}
  onClose={() => setCelebration(null)}
/>
```

### Implementação do Componente

```tsx
// TrailCompletionCelebration.tsx
export function TrailCompletionCelebration({ 
  isOpen, 
  trailName, 
  bonusXp, 
  onClose 
}: Props) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-[var(--color-bg-surface)] rounded-3xl p-8 max-w-sm mx-4 text-center border-2 border-[var(--color-accent)]">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-accent)' }}>
          TRILHA COMPLETADA!
        </h2>
        <p className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text-main)' }}>
          {trailName}
        </p>
        <p className="text-3xl font-bold mb-6" style={{ color: 'var(--color-accent)' }}>
          +{bonusXp} XP
        </p>
        <button onClick={onClose} className="btn-primary">
          OK
        </button>
      </div>
    </div>
  );
}
```

### Timer

A celebração some automaticamente após 5 segundos:

```typescript
setTimeout(() => setCelebration(null), 5000);
```

---

## 5. Badge de Nível no Perfil

### Visual (futuro)

```
┌─────────────────────────────┐
│  👤 João Silva              │
│  🥇 Ouro • 650 XP           │
└─────────────────────────────┘
```

---

## 6. Ícones e Cores

| Elemento | Ícone | Cor |
|----------|-------|-----|
| Nível Iniciante | 🌱 | `#888888` |
| Nível Bronze | 🥉 | `#cd7f32` |
| Nível Prata | 🥈 | `#c0c0c0` |
| Nível Ouro | 🥇 | `#ffd700` |
| Nível Master | 👑 | `#c9a655` |
| Pontos (estrela) | ⭐ | `#c9a655` (dourado) |
| Bônus trilha | 💰 | `#c9a655` |

---

## 7. Responsividade

### Desktop (≥1024px)

- Card de gamificação: 300px de largura
- Itens em linha

### Tablet (768px-1023px)

- Card de gamificação: 100% da largura
- Itens em linha

### Mobile (<768px)

- Card de gamificação: 100% da largura
- Itens empilhados
- Celebração: tela cheia

---

*Próximo: [07-testes.md](./07-testes.md) - Testes*