import { mockMode } from './mockMode';

export type TableName = 
  | 'profiles' 
  | 'user_roles' 
  | 'materials' 
  | 'material_assets' 
  | 'collections' 
  | 'collection_items' 
  | 'user_progress' 
  | 'collection_progress'
  | 'gamification_levels'
  | 'invite_tokens'
  | 'system_config'
  | 'app_config'
  | 'access_logs'
  | 'webhooks'
  | 'webhook_logs'
  | 'chatbot_config'
  | 'chat_logs';

export interface MockRow {
  id: string;
  [key: string]: any;
}

class InMemoryStore {
  private static instance: InMemoryStore;
  private data: Map<TableName, MockRow[]> = new Map();
  private counters: Map<TableName, number> = new Map();

  private constructor() {}

  static getInstance(): InMemoryStore {
    if (!InMemoryStore.instance) {
      InMemoryStore.instance = new InMemoryStore();
      InMemoryStore.instance.seedAll();
    }
    return InMemoryStore.instance;
  }

  private seedAll(): void {
    this.seedProfiles();
    this.seedUserRoles();
    this.seedMaterials();
    this.seedMaterialAssets();
    this.seedCollections();
    this.seedCollectionItems();
    this.seedUserProgress();
    this.seedCollectionProgress();
    this.seedGamificationLevels();
    this.seedSystemConfig();
    this.seedAppConfig();
    this.seedInviteTokens();
    this.seedAccessLogs();
    this.seedWebhooks();
    this.seedChatbotConfig();
  }

  private generateId(table: TableName): string {
    const prefix = table.slice(0, 3);
    const counter = ((this.counters.get(table) || 0) + 1);
    this.counters.set(table, counter);
    return `${prefix}-${counter.toString().padStart(6, '0')}`;
  }

  private seedProfiles() {
    const profiles: MockRow[] = [
      { id: 'mock-admin', name: 'Super Admin', email: 'admin@demo.com', role: 'super_admin', whatsapp: '11999999999', status: 'active', points: 0, preferences: { theme: 'dark', language: 'pt-br' }, allowed_types: [], created_at: '2024-01-01T00:00:00Z' },
      { id: 'mock-client', name: 'Cliente Demo', email: 'client@demo.com', role: 'client', whatsapp: '11988888888', cro: '12345', status: 'active', points: 150, preferences: { theme: 'dark', language: 'pt-br' }, allowed_types: [], created_at: '2024-01-01T00:00:00Z' },
      { id: 'mock-distrib', name: 'Distribuidor Demo', email: 'distributor@demo.com', role: 'distributor', whatsapp: '11977777777', status: 'active', points: 320, preferences: { theme: 'dark', language: 'pt-br' }, allowed_types: [], created_at: '2024-01-01T00:00:00Z' },
      { id: 'mock-consult', name: 'Consultor Demo', email: 'consultant@demo.com', role: 'consultant', whatsapp: '11966666666', status: 'active', points: 780, preferences: { theme: 'dark', language: 'pt-br' }, allowed_types: [], created_at: '2024-01-01T00:00:00Z' },
      { id: 'mock-manager', name: 'Gestor Demo', email: 'manager@demo.com', role: 'manager', whatsapp: '11955555555', status: 'active', points: 450, preferences: { theme: 'dark', language: 'pt-br' }, allowed_types: [], created_at: '2024-01-01T00:00:00Z' },
    ];
    this.data.set('profiles', profiles);
    this.counters.set('profiles', 5);
  }

  private seedUserRoles() {
    const roles: MockRow[] = [
      { user_id: 'mock-admin', role: 'super_admin' },
      { user_id: 'mock-client', role: 'client' },
      { user_id: 'mock-distrib', role: 'distributor' },
      { user_id: 'mock-consult', role: 'consultant' },
      { user_id: 'mock-manager', role: 'manager' },
    ];
    this.data.set('user_roles', roles);
    this.counters.set('user_roles', 5);
  }

  private seedMaterials() {
    const materials: MockRow[] = [
      { id: 'mat-1', title: { 'pt-br': 'Tutorial de Implantes', 'en-us': 'Implants Tutorial' }, description: { 'pt-br': 'Aprenda os conceitos básicos' }, type: 'pdf', points: 50, tags: ['implantes', 'básico'], allowed_roles: ['client', 'distributor', 'consultant', 'manager'], active: true, category: 'odontologia', created_at: '2024-01-01T00:00:00Z' },
      { id: 'mat-2', title: { 'pt-br': 'Guia de Marketing Dental', 'en-us': 'Dental Marketing Guide' }, description: { 'pt-br': 'Estratégias de marketing' }, type: 'video', points: 100, tags: ['marketing', 'vendas'], allowed_roles: ['client', 'distributor', 'consultant', 'manager'], active: true, category: 'marketing', created_at: '2024-01-05T00:00:00Z' },
      { id: 'mat-3', title: { 'pt-br': 'Protocolos Cirúrgicos', 'en-us': 'Surgical Protocols' }, description: { 'pt-br': 'Protocolos passo a passo' }, type: 'pdf', points: 75, tags: ['cirurgia'], allowed_roles: ['consultant', 'manager'], active: true, category: 'clinica', created_at: '2024-01-10T00:00:00Z' },
      { id: 'mat-4', title: { 'pt-br': 'Apresentação Comercial', 'en-us': 'Commercial Presentation' }, description: { 'pt-br': 'Modelo de apresentação' }, type: 'html', points: 25, tags: ['vendas'], allowed_roles: ['client', 'distributor', 'consultant'], active: true, category: 'vendas', created_at: '2024-01-15T00:00:00Z' },
      { id: 'mat-5', title: { 'pt-br': 'Gestão Financeira', 'en-us': 'Financial Management' }, description: { 'pt-br': 'Finanças do consultório' }, type: 'video', points: 80, tags: ['gestão'], allowed_roles: ['manager'], active: true, category: 'gestao', created_at: '2024-01-20T00:00:00Z' },
    ];
    this.data.set('materials', materials);
    this.counters.set('materials', 5);
  }

  private seedMaterialAssets() {
    const assets: MockRow[] = [
      { id: 'ast-1', material_id: 'mat-1', language: 'pt-br', url: 'https://exemplo.com/material1.pdf', subtitle_url: null, status: 'published' },
      { id: 'ast-2', material_id: 'mat-2', language: 'pt-br', url: 'https://exemplo.com/material2.mp4', subtitle_url: null, status: 'published' },
    ];
    this.data.set('material_assets', assets);
    this.counters.set('material_assets', 2);
  }

  private seedCollections() {
    const collections: MockRow[] = [
      { id: 'col-1', title: { 'pt-br': 'Kit Iniciante', 'en-us': 'Starter Kit' }, description: { 'pt-br': 'Tudo para começar' }, points: 100, active: true, cover_image: null, created_at: '2024-01-01T00:00:00Z' },
      { id: 'col-2', title: { 'pt-br': 'Marketing Dental', 'en-us': 'Dental Marketing' }, description: { 'pt-br': 'Aprenda a vender mais' }, points: 150, active: true, cover_image: null, created_at: '2024-01-10T00:00:00Z' },
    ];
    this.data.set('collections', collections);
    this.counters.set('collections', 2);
  }

  private seedCollectionItems() {
    const items: MockRow[] = [
      { collection_id: 'col-1', material_id: 'mat-1', order_index: 1 },
      { collection_id: 'col-1', material_id: 'mat-3', order_index: 2 },
      { collection_id: 'col-2', material_id: 'mat-2', order_index: 1 },
      { collection_id: 'col-2', material_id: 'mat-4', order_index: 2 },
    ];
    this.data.set('collection_items', items);
    this.counters.set('collection_items', 4);
  }

  private seedUserProgress() {
    const progress: MockRow[] = [
      { id: 'up-1', user_id: 'mock-client', material_id: 'mat-1', collection_id: 'col-1', status: 'completed', created_at: '2024-01-05T10:00:00Z', completed_at: '2024-01-10T10:00:00Z' },
      { id: 'up-2', user_id: 'mock-client', material_id: 'mat-2', collection_id: 'col-1', status: 'completed', created_at: '2024-01-07T10:00:00Z', completed_at: '2024-01-08T10:00:00Z' },
      { id: 'up-3', user_id: 'mock-client', material_id: 'mat-4', status: 'started', created_at: '2024-02-01T10:00:00Z', completed_at: null },
    ];
    this.data.set('user_progress', progress);
    this.counters.set('user_progress', 3);
  }

  private seedCollectionProgress() {
    const progress: MockRow[] = [
      { id: 'cp-1', user_id: 'mock-client', collection_id: 'col-1', status: 'completed', started_at: '2024-01-01', completed_at: '2024-01-10' },
    ];
    this.data.set('collection_progress', progress);
    this.counters.set('collection_progress', 1);
  }

  private seedGamificationLevels() {
    const levels: MockRow[] = [
      { id: 'gl-1', name: 'Iniciante', min_points: 0, color: '#888888', order_index: 0, created_at: new Date().toISOString() },
      { id: 'gl-2', name: 'Bronze', min_points: 100, color: '#cd7f32', order_index: 1, created_at: new Date().toISOString() },
      { id: 'gl-3', name: 'Prata', min_points: 300, color: '#c0c0c0', order_index: 2, created_at: new Date().toISOString() },
      { id: 'gl-4', name: 'Ouro', min_points: 600, color: '#ffd700', order_index: 3, created_at: new Date().toISOString() },
      { id: 'gl-5', name: 'Master', min_points: 1000, color: '#c9a655', order_index: 4, created_at: new Date().toISOString() },
    ];
    this.data.set('gamification_levels', levels);
    this.counters.set('gamification_levels', 5);
  }

  private seedSystemConfig() {
    const config: MockRow[] = [
      { id: 1, app_name: 'Conexão Hub', app_logo: null, theme_dark: {}, theme_mode: {}, environment_themes: {}, show_mock_login_cards: true, created_at: new Date().toISOString() },
    ];
    this.data.set('system_config', config);
  }

  private seedAppConfig() {
    const config: MockRow[] = [
      { id: 'cfg-1', key: 'webhook_url', value: '', created_at: new Date().toISOString() },
      { id: 'cfg-2', key: 'gemini_api_key', value: '', created_at: new Date().toISOString() },
      { id: 'cfg-3', key: 'n8n_url', value: '', created_at: new Date().toISOString() },
    ];
    this.data.set('app_config', config);
    this.counters.set('app_config', 3);
  }

  private seedInviteTokens() {
    const tokens: MockRow[] = [
      { id: 'inv-1', token: 'abc123', role: 'client', used_by: null, used_at: null, expires_at: '2026-06-01T00:00:00Z', created_at: '2026-05-01T00:00:00Z', status: 'active' },
    ];
    this.data.set('invite_tokens', tokens);
    this.counters.set('invite_tokens', 1);
  }

  private seedAccessLogs() {
    const logs: MockRow[] = [
      { id: 'log-1', material_id: 'mat-1', user_id: 'mock-client', language: 'pt-br', created_at: '2024-03-15T10:30:00Z' },
    ];
    this.data.set('access_logs', logs);
    this.counters.set('access_logs', 1);
  }

  private seedWebhooks() {
    const webhooks: MockRow[] = [];
    this.data.set('webhooks', webhooks);
    this.counters.set('webhooks', 0);
  }

  private seedChatbotConfig() {
    const config: MockRow[] = [
      { id: 'cb-1', enabled: true, webhook_url: '', allowed_roles: ['client', 'distributor', 'consultant', 'manager'], created_at: new Date().toISOString() },
    ];
    this.data.set('chatbot_config', config);
  }

  get(table: TableName): MockRow[] {
    return this.data.get(table) || [];
  }

  find(table: TableName, filter: (row: MockRow) => boolean): MockRow | undefined {
    return this.get(table).find(filter);
  }

  filter(table: TableName, filter: (row: MockRow) => boolean): MockRow[] {
    return this.get(table).filter(filter);
  }

  insert(table: TableName, row: Omit<MockRow, 'id'>): MockRow {
    const newRow = { ...row, id: this.generateId(table) };
    const rows = [...this.get(table), newRow];
    this.data.set(table, rows);
    return newRow;
  }

  update(table: TableName, id: string, updates: Partial<MockRow>): MockRow | undefined {
    const rows = this.get(table);
    const index = rows.findIndex(r => r.id === id);
    if (index === -1) return undefined;
    rows[index] = { ...rows[index], ...updates };
    this.data.set(table, rows);
    return rows[index];
  }

  upsert(table: TableName, row: MockRow, keys: string[]): MockRow {
    const existing = this.find(table, r => keys.every(k => r[k] === row[k]));
    if (existing) {
      return this.update(table, existing.id, row) || row;
    }
    return this.insert(table, row);
  }

  delete(table: TableName, id: string): boolean {
    const rows = this.get(table);
    const index = rows.findIndex(r => r.id === id);
    if (index === -1) return false;
    rows.splice(index, 1);
    this.data.set(table, rows);
    return true;
  }

  query(table: TableName) {
    const self = this;
    return {
      select: (fields?: string) => {
        return {
          eq: (col: string, val: any) => ({
            single: async () => {
              await mockMode.simulateDelay();
              const row = self.find(table, r => r[col] === val);
              return { data: row || null, error: row ? null : { message: 'Not found' } };
            },
            then: (resolve: any, reject: any) => {
              mockMode.simulateDelay().then(() => {
                const rows = self.filter(table, r => r[col] === val);
                resolve({ data: rows, error: null });
              });
            }
          }),
          in: (col: string, vals: any[]) => ({
            then: (resolve: any, reject: any) => {
              mockMode.simulateDelay().then(() => {
                const rows = self.filter(table, r => vals.includes(r[col]));
                resolve({ data: rows, error: null });
              });
            }
          }),
          then: (resolve: any, reject: any) => {
            mockMode.simulateDelay().then(() => {
              resolve({ data: self.get(table), error: null });
            });
          }
        };
      },
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            await mockMode.simulateDelay();
            const row = self.insert(table, data);
            return { data: row, error: null };
          }
        }),
        then: (resolve: any, reject: any) => {
          mockMode.simulateDelay().then(() => {
            const row = self.insert(table, data);
            resolve({ data: row, error: null });
          });
        }
      }),
      update: () => ({
        eq: (col: string, val: any) => ({
          update: async (data: any) => {
            await mockMode.simulateDelay();
            const row = self.find(table, r => r[col] === val);
            if (!row) return { error: { message: 'Not found' } };
            const updated = self.update(table, row.id, data);
            return { error: null, data: updated };
          }
        })
      }),
      delete: () => ({
        eq: (col: string, val: any) => ({
          then: (resolve: any, reject: any) => {
            mockMode.simulateDelay().then(() => {
              const row = self.find(table, r => r[col] === val);
              if (row) self.delete(table, row.id);
              resolve({ error: null });
            });
          }
        })
      }),
      upsert: (data: any, opts: { onConflict: string }) => ({
        then: (resolve: any, reject: any) => {
          mockMode.simulateDelay().then(() => {
            const row = self.upsert(table, data, opts.onConflict.split(','));
            resolve({ data: row, error: null });
          });
        }
      })
    };
  }
}

export const mockStore = InMemoryStore.getInstance();