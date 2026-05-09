import { useState, useEffect } from 'react';
import { badgeMockStore, Badge } from '../../src/badges';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export default function BadgeManager() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [newBadge, setNewBadge] = useState<Partial<Badge>>({
    name: '',
    description: '',
    iconName: 'star',
    color: '#c9a655',
    pointsReward: 0,
    triggerType: 'xp',
    triggerValue: 0,
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await badgeMockStore.getAllBadges();
    setBadges(data);
  };

  const handleCreate = async () => {
    await badgeMockStore.create(newBadge as any);
    setNewBadge({ name: '', description: '', iconName: 'star', color: '#c9a655', pointsReward: 0, triggerType: 'xp', triggerValue: 0 });
    load();
  };

  const handleDelete = async (id: string) => {
    await badgeMockStore.delete(id);
    load();
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Gerenciar Badges</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="Nome" value={newBadge.name || ''} onChange={e => setNewBadge({ ...newBadge, name: e.target.value })} />
        <Input placeholder="Descrição" value={newBadge.description || ''} onChange={e => setNewBadge({ ...newBadge, description: e.target.value })} />
        <Input placeholder="Icone" value={newBadge.iconName || ''} onChange={e => setNewBadge({ ...newBadge, iconName: e.target.value })} />
        <Input placeholder="Valor de disparo" type="number" value={newBadge.triggerValue?.toString() || ''} onChange={e => setNewBadge({ ...newBadge, triggerValue: Number(e.target.value) })} />
        <Input placeholder="Tipo (xp, streak, collection)" value={newBadge.triggerType || ''} onChange={e => setNewBadge({ ...newBadge, triggerType: e.target.value as any })} />
        <Button onClick={handleCreate}>Criar Badge</Button>
      </div>
      <ul className="space-y-2">
        {badges.map(b => (
          <li key={b.id} className="flex justify-between items-center p-2 border rounded">
            <span>{b.name} ({b.triggerType}: {b.triggerValue})</span>
            <Button variant="destructive" onClick={() => handleDelete(b.id)}>Excluir</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
