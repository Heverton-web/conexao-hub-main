import { supabase } from './supabaseClient';
import { Material, UserProfile, Role, SystemConfig, ColorScheme, UserStatus, AccessLog, Language, MaterialAsset, Collection, CollectionItem, UserProgress, ThemeModeConfig, EnvironmentThemes, Webhook, WebhookEventFilter, WebhookLog, SystemIntegrations } from '../types';
import { DEFAULT_DARK, DEFAULT_THEME_MODE, mergeScheme, DEFAULT_ENVIRONMENT_THEMES } from './themeDefaults';
import { encrypt, decrypt } from './crypto';

export interface CollectionProgress {
  id: string;
  userId: string;
  collectionId: string;
  status: 'started' | 'completed';
  startedAt: string;
  completedAt?: string;
}

export interface GamificationLevel {
  id: string;
  name: string;
  minPoints: number;
  orderIndex: number;
  color: string;
  createdAt: string;
  updatedAt: string;
}


let isMockMode = false;

const localUsers: UserProfile[] = [
    { id: 'mock-admin', name: 'Super Admin (Mock)', email: 'admin@demo.com', role: 'super_admin', whatsapp: '11999999999', status: 'active', points: 0, preferences: { theme: 'dark', language: 'pt-br' } },
    { id: 'mock-client', name: 'Cliente Exemplo', email: 'client@demo.com', role: 'client', whatsapp: '11988888888', cro: '12345', status: 'active', points: 150, preferences: { theme: 'dark', language: 'pt-br' } },
    { id: 'mock-distrib', name: 'Distribuidor Demo', email: 'distributor@demo.com', role: 'distributor', whatsapp: '11977777777', status: 'active', points: 320, preferences: { theme: 'dark', language: 'pt-br' } },
    { id: 'mock-consult', name: 'Consultor Demo', email: 'consultant@demo.com', role: 'consultant', whatsapp: '11966666666', status: 'active', points: 780, preferences: { theme: 'dark', language: 'pt-br' } },
    { id: 'mock-manager', name: 'Gestor Demo', email: 'manager@demo.com', role: 'manager', whatsapp: '11955555555', status: 'active', points: 0, preferences: { theme: 'dark', language: 'pt-br' } }
];

const localMaterials: Material[] = [
    { id: 'mat-1', type: 'video', title: { 'pt-br': 'Tutorial de Implantes', 'en-us': 'Implant Tutorial', 'es-es': 'Tutorial de Implantes' }, active: true, allowedRoles: ['client', 'distributor', 'consultant', 'manager', 'super_admin'], assets: { 'pt-br': { url: 'https://example.com/video1', subtitleUrl: '', status: 'ready' } }, createdAt: '2024-01-01', points: 10, tags: ['implante', 'tutorial'], category: 'odontologia' },
    { id: 'mat-2', type: 'pdf', title: { 'pt-br': 'Guia de Marketing', 'en-us': 'Marketing Guide', 'es-es': 'Guía de Marketing' }, active: true, allowedRoles: ['client', 'distributor', 'consultant', 'manager', 'super_admin'], assets: { 'pt-br': { url: 'https://example.com/pdf1', subtitleUrl: '', status: 'ready' } }, createdAt: '2024-01-15', points: 10, tags: ['marketing', 'vendas'], category: 'marketing' },
    { id: 'mat-3', type: 'trilha', title: { 'pt-br': 'Trilha de Vendas', 'en-us': 'Sales Trail', 'es-es': 'Trayecto de Ventas' }, active: true, allowedRoles: ['client', 'distributor', 'consultant', 'manager', 'super_admin'], assets: {}, createdAt: '2024-02-01', points: 50, tags: ['vendas', 'trilha'], category: 'vendas' },
    { id: 'mat-4', type: 'video', title: { 'pt-br': 'Apresentação comercial', 'en-us': 'Commercial Presentation', 'es-es': 'Presentación Comercial' }, active: true, allowedRoles: ['distributor', 'consultant', 'manager', 'super_admin'], assets: { 'pt-br': { url: 'https://example.com/video2', subtitleUrl: '', status: 'ready' } }, createdAt: '2024-02-10', points: 20, tags: ['vendas', 'apresentação'], category: 'vendas' },
    { id: 'mat-5', type: 'pdf', title: { 'pt-br': 'Kit Dentista', 'en-us': 'Dentist Kit', 'es-es': 'Kit Dentista' }, active: true, allowedRoles: ['client'], assets: { 'pt-br': { url: 'https://example.com/pdf2', subtitleUrl: '', status: 'ready' } }, createdAt: '2024-02-15', points: 15, tags: ['kit', 'dentista'], category: 'odontologia' },
    { id: 'mat-6', type: 'video', title: { 'pt-br': 'Estratégias de Growth', 'en-us': 'Growth Strategies', 'es-es': 'Estrategias de Crecimiento' }, active: true, allowedRoles: ['distributor', 'consultant', 'manager', 'super_admin'], assets: { 'pt-br': { url: 'https://example.com/video3', subtitleUrl: '', status: 'ready' } }, createdAt: '2024-02-20', points: 25, tags: ['growth', 'marketing'], category: 'marketing' },
    { id: 'mat-7', type: 'video', title: { 'pt-br': 'Técnicas de Vendas', 'en-us': 'Sales Techniques', 'es-es': 'Técnicas de Ventas' }, active: true, allowedRoles: ['client', 'distributor', 'consultant', 'manager', 'super_admin'], assets: { 'pt-br': { url: 'https://example.com/video4', subtitleUrl: '', status: 'ready' } }, createdAt: '2024-03-01', points: 30, tags: ['vendas', 'técnicas'], category: 'vendas' },
    { id: 'mat-8', type: 'pdf', title: { 'pt-br': 'Manual do Consultor', 'en-us': 'Consultant Manual', 'es-es': 'Manual del Consultor' }, active: true, allowedRoles: ['consultant', 'manager', 'super_admin'], assets: { 'pt-br': { url: 'https://example.com/pdf3', subtitleUrl: '', status: 'ready' } }, createdAt: '2024-03-05', points: 40, tags: ['consultor', 'manual'], category: 'gestão' },
    { id: 'mat-9', type: 'trilha', title: { 'pt-br': 'Gestão de Clínica', 'en-us': 'Clinic Management', 'es-es': 'Gestión de Clínica' }, active: true, allowedRoles: ['manager', 'super_admin'], assets: {}, createdAt: '2024-03-10', points: 100, tags: ['gestão', 'clínica'], category: 'gestão' },
    { id: 'mat-10', type: 'video', title: { 'pt-br': 'Tudo sobre Implantes', 'en-us': 'All About Implants', 'es-es': 'Todo sobre Implantes' }, active: true, allowedRoles: ['client', 'distributor', 'consultant', 'manager', 'super_admin'], assets: { 'pt-br': { url: 'https://example.com/video5', subtitleUrl: '', status: 'ready' } }, createdAt: '2024-03-15', points: 50, tags: ['implante', 'odontologia'], category: 'odontologia' },
];

const mapProfileFromDb = (data: any): UserProfile => ({
  id: data.id,
  name: data.name,
  email: data.email,
  role: data.user_roles?.[0]?.role || data.role || 'client',
  whatsapp: data.whatsapp,
  cro: data.cro,
  status: data.status,
  allowedTypes: data.allowed_types,
  points: data.points || 0,
  preferences: data.preferences || { theme: 'dark', language: 'pt-br' },
  rejectionReason: data.rejection_reason,
});

const mapMaterialFromDb = (data: any): Material => {
    const assetsObj: Partial<Record<Language, MaterialAsset>> = {};
    if (data.material_assets && Array.isArray(data.material_assets)) {
        data.material_assets.forEach((asset: any) => {
            assetsObj[asset.language as Language] = {
                url: asset.url,
                subtitleUrl: asset.subtitle_url,
                status: asset.status
            };
        });
    }
    return {
        id: data.id,
        title: data.title,
        type: data.type,
        allowedRoles: data.allowed_roles,
        assets: assetsObj,
        active: data.active,
        createdAt: data.created_at,
        points: data.points || 0,
        tags: data.tags || [],
        category: data.category || undefined,
    };
};

const localCollections: Collection[] = [
    { id: 'col-1', title: { 'pt-br': 'Kit Iniciante', 'en-us': 'Starter Kit', 'es-es': 'Kit de Inicio' }, description: { 'pt-br': 'Tudo que você precisa para começar', 'en-us': 'Everything you need to start', 'es-es': 'Todo lo que necesitas para comenzar' }, coverImage: '', active: true, allowedRoles: ['client', 'distributor', 'consultant', 'manager', 'super_admin'], points: 100, createdAt: '2024-01-01', updatedAt: '2024-01-15' },
    { id: 'col-2', title: { 'pt-br': 'Kit Marketing', 'en-us': 'Marketing Kit', 'es-es': 'Kit de Marketing' }, description: { 'pt-br': 'Materiais de marketing profissionais', 'en-us': 'Professional marketing materials', 'es-es': 'Materiales de marketing profesionales' }, coverImage: '', active: true, allowedRoles: ['distributor', 'consultant', 'manager', 'super_admin'], points: 150, createdAt: '2024-02-01', updatedAt: '2024-02-10' },
    { id: 'col-3', title: { 'pt-br': 'Gestão Completa', 'en-us': 'Complete Management', 'es-es': 'Gestión Completa' }, description: { 'pt-br': 'Aprenda a gerenciar sua clínica', 'en-us': 'Learn to manage your clinic', 'es-es': 'Aprende a gestionar tu clínica' }, coverImage: '', active: true, allowedRoles: ['manager', 'super_admin'], points: 200, createdAt: '2024-03-01', updatedAt: '2024-03-10' },
];

const localAccessLogs: AccessLog[] = [
    { id: 'log-1', materialId: 'mat-1', materialTitle: 'Tutorial de Implantes', userId: 'mock-client', userName: 'Cliente Exemplo', userRole: 'client', language: 'pt-br', timestamp: '2024-03-15T10:30:00Z' },
    { id: 'log-2', materialId: 'mat-2', materialTitle: 'Guia de Marketing', userId: 'mock-consult', userName: 'Consultor Demo', userRole: 'consultant', language: 'pt-br', timestamp: '2024-03-15T11:00:00Z' },
    { id: 'log-3', materialId: 'mat-4', materialTitle: 'Apresentação comercial', userId: 'mock-distrib', userName: 'Distribuidor Demo', userRole: 'distributor', language: 'pt-br', timestamp: '2024-03-15T14:00:00Z' },
    { id: 'log-4', materialId: 'mat-9', materialTitle: 'Gestão de Clínica', userId: 'mock-manager', userName: 'Gestor Demo', userRole: 'manager', language: 'pt-br', timestamp: '2024-03-15T16:00:00Z' },
];

const localCollectionProgress: CollectionProgress[] = [
    { id: 'cp-1', userId: 'mock-client', collectionId: 'col-1', status: 'completed', startedAt: '2024-01-01', completedAt: '2024-01-10' },
    { id: 'cp-2', userId: 'mock-client', collectionId: 'col-2', status: 'started', startedAt: '2024-02-01' },
    { id: 'cp-3', userId: 'mock-consult', collectionId: 'col-1', status: 'completed', startedAt: '2024-01-05', completedAt: '2024-01-20' },
    { id: 'cp-4', userId: 'mock-manager', collectionId: 'col-1', status: 'completed', startedAt: '2024-02-01', completedAt: '2024-02-15' },
    { id: 'cp-5', userId: 'mock-manager', collectionId: 'col-3', status: 'started', startedAt: '2024-03-01' },
];

const localCollectionItems: CollectionItem[] = [
    { id: 'item-1', collectionId: 'col-1', materialId: 'mat-1', orderIndex: 1, material: localMaterials[0] },
    { id: 'item-2', collectionId: 'col-1', materialId: 'mat-2', orderIndex: 2, material: localMaterials[1] },
    { id: 'item-3', collectionId: 'col-1', materialId: 'mat-7', orderIndex: 3, material: localMaterials[6] },
    { id: 'item-4', collectionId: 'col-2', materialId: 'mat-2', orderIndex: 1, material: localMaterials[1] },
    { id: 'item-5', collectionId: 'col-2', materialId: 'mat-6', orderIndex: 2, material: localMaterials[5] },
    { id: 'item-6', collectionId: 'col-3', materialId: 'mat-8', orderIndex: 1, material: localMaterials[7] },
    { id: 'item-7', collectionId: 'col-3', materialId: 'mat-9', orderIndex: 2, material: localMaterials[8] },
];

const localUserProgress: UserProgress[] = [
    { id: 'up-1', userId: 'mock-client', materialId: 'mat-1', collectionId: 'col-1', status: 'completed', completedAt: '2024-01-10T10:00:00Z', createdAt: '2024-01-05T10:00:00Z' },
    { id: 'up-2', userId: 'mock-client', materialId: 'mat-2', collectionId: 'col-1', status: 'completed', completedAt: '2024-01-08T10:00:00Z', createdAt: '2024-01-07T10:00:00Z' },
    { id: 'up-3', userId: 'mock-client', materialId: 'mat-7', status: 'started', createdAt: '2024-02-01T10:00:00Z' },
    { id: 'up-4', userId: 'mock-consult', materialId: 'mat-1', collectionId: 'col-1', status: 'completed', completedAt: '2024-01-20T10:00:00Z', createdAt: '2024-01-10T10:00:00Z' },
    { id: 'up-5', userId: 'mock-consult', materialId: 'mat-4', status: 'completed', completedAt: '2024-02-15T10:00:00Z', createdAt: '2024-02-10T10:00:00Z' },
    { id: 'up-6', userId: 'mock-distrib', materialId: 'mat-2', status: 'completed', completedAt: '2024-02-20T10:00:00Z', createdAt: '2024-02-15T10:00:00Z' },
    { id: 'up-7', userId: 'mock-manager', materialId: 'mat-1', collectionId: 'col-1', status: 'completed', completedAt: '2024-02-15T10:00:00Z', createdAt: '2024-02-01T10:00:00Z' },
    { id: 'up-8', userId: 'mock-manager', materialId: 'mat-8', collectionId: 'col-3', status: 'completed', completedAt: '2024-03-05T10:00:00Z', createdAt: '2024-03-01T10:00:00Z' },
    { id: 'up-9', userId: 'mock-manager', materialId: 'mat-9', collectionId: 'col-3', status: 'started', createdAt: '2024-03-10T10:00:00Z' },
];

export const mockDb = {

  enableMockMode: () => {
      console.log("🟡 MOCK MODE ACTIVATED");
      isMockMode = true;
  },

  disableMockMode: () => {
      isMockMode = false;
  },

  getSystemConfig: async (): Promise<SystemConfig> => {
    const { data, error } = await supabase.from('system_config').select('*').eq('id', 1).single();

    const defaults: SystemConfig = {
        appName: 'Hub Conexão',
        themeDark: DEFAULT_DARK,
        themeMode: DEFAULT_THEME_MODE,
        showMockLoginCards: true,
    };

    if (error || !data) {
        return defaults;
    }

    return {
      appName: data.app_name,
      logoUrl: data.logo_url,
      webhookUrl: data.webhook_url,
      themeDark: mergeScheme(data.theme_dark as unknown as Partial<ColorScheme>, DEFAULT_DARK),
      themeMode: (data as any).theme_mode ? { ...DEFAULT_THEME_MODE, ...(data as any).theme_mode } : DEFAULT_THEME_MODE,
      environmentThemes: (data as any).environment_themes && Object.keys((data as any).environment_themes).length > 0
        ? { ...DEFAULT_ENVIRONMENT_THEMES, ...(data as any).environment_themes }
        : DEFAULT_ENVIRONMENT_THEMES,
      showMockLoginCards: data.show_mock_login_cards ?? true,
    };
  },

  updateSystemConfig: async (config: SystemConfig): Promise<void> => {
    const { error } = await supabase
      .from('system_config')
      .update({
        app_name: config.appName,
        logo_url: config.logoUrl,
        webhook_url: config.webhookUrl,
        theme_dark: config.themeDark as any,
        theme_mode: config.themeMode as any,
        environment_themes: config.environmentThemes as any,
        show_mock_login_cards: config.showMockLoginCards,
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', 1);

    if (error) throw error;
  },

  getProfileById: async (id: string): Promise<UserProfile | null> => {
    if (id.startsWith('mock-')) {
      const user = localUsers.find(u => u.id === id) || null;
      return user;
    }

    const [profileResult, roleResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase.from('user_roles').select('role').eq('user_id', id).limit(1).single()
    ]);

    if (profileResult.error) {
        if (profileResult.error.code === 'PGRST116') return null;
        if (profileResult.error.code === '42P01') throw profileResult.error;
        console.error("DB Read Error:", profileResult.error);
        return null;
    }

    const data = {
      ...profileResult.data,
      user_roles: roleResult.data ? [roleResult.data] : []
    };
    return mapProfileFromDb(data);
  },

  updateUserStatus: async (userId: string, status: UserStatus, rejectionReason?: string): Promise<void> => {
    const updateData: any = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejection_reason = rejectionReason;
    }
    if (status === 'active') {
      updateData.rejection_reason = null;
    }
    const { error } = await supabase.from('profiles').update(updateData).eq('id', userId);
    if (error) throw error;
  },

  updateUser: async (updatedUser: UserProfile): Promise<void> => {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: updatedUser.name,
        email: updatedUser.email,
        whatsapp: updatedUser.whatsapp,
        cro: updatedUser.cro,
        status: updatedUser.status,
        allowed_types: updatedUser.allowedTypes,
        preferences: updatedUser.preferences
      })
      .eq('id', updatedUser.id);
    if (error) throw error;

    // Update role in the separate user_roles table
    const { error: roleError } = await supabase
      .from('user_roles')
      .update({ role: updatedUser.role as any })
      .eq('user_id', updatedUser.id);
    if (roleError) throw roleError;
  },

  deleteUser: async (userId: string): Promise<void> => {
    const { data, error } = await supabase.functions.invoke('delete-user', {
      body: { userId },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
  },

  createMaterial: async (material: Omit<Material, 'id' | 'createdAt'>): Promise<Material> => {
    const { data: matData, error: matError } = await supabase
      .from('materials')
      .insert({
        title: material.title,
        type: material.type,
        allowed_roles: material.allowedRoles,
        active: material.active,
        points: material.points || 0,
        tags: material.tags || [],
        category: material.category || null,
      })
      .select()
      .single();

    if (matError) throw matError;

    const assetsToInsert = Object.entries(material.assets).map(([lang, asset]) => ({
        material_id: matData.id,
        language: lang as 'pt-br' | 'en-us' | 'es-es',
        url: (asset as MaterialAsset).url,
        subtitle_url: (asset as MaterialAsset).subtitleUrl,
        status: (asset as MaterialAsset).status as 'draft' | 'review' | 'published'
    }));

    if (assetsToInsert.length > 0) {
        const { error: assetError } = await supabase.from('material_assets').insert(assetsToInsert);
        if (assetError) throw assetError;
    }

    return { ...mapMaterialFromDb(matData), assets: material.assets };
  },

  updateMaterial: async (material: Material): Promise<void> => {
    const { error: matError } = await supabase
      .from('materials')
      .update({
        title: material.title,
        type: material.type,
        allowed_roles: material.allowedRoles,
        active: material.active,
        points: material.points || 0,
        tags: material.tags || [],
        category: material.category || null,
      })
      .eq('id', material.id);

    if (matError) throw matError;

    const { error: delError } = await supabase.from('material_assets').delete().eq('material_id', material.id);
    if (delError) throw delError;

    const assetsToInsert = Object.entries(material.assets).map(([lang, asset]) => ({
        material_id: material.id,
        language: lang as 'pt-br' | 'en-us' | 'es-es',
        url: (asset as MaterialAsset).url,
        subtitle_url: (asset as MaterialAsset).subtitleUrl,
        status: (asset as MaterialAsset).status as 'draft' | 'review' | 'published'
    }));

    if (assetsToInsert.length > 0) {
        const { error: assetError } = await supabase.from('material_assets').insert(assetsToInsert);
        if (assetError) throw assetError;
    }
  },

  deleteMaterial: async (id: string): Promise<void> => {
    const { error } = await supabase.from('materials').delete().eq('id', id);
    if (error) throw error;
  },

  getUsers: async (): Promise<UserProfile[]> => {
    if (isMockMode) {
      return localUsers;
    }
    const { data: profiles, error } = await supabase.from('profiles').select('*').order('name');
    if (error) throw error;
    
    const { data: roles } = await supabase.from('user_roles').select('user_id, role');
    const roleMap = new Map((roles || []).map((r: any) => [r.user_id, r.role]));
    
    return (profiles || []).map((p: any) => mapProfileFromDb({
      ...p,
      user_roles: roleMap.has(p.id) ? [{ role: roleMap.get(p.id) }] : []
    }));
  },

  getMaterials: async (role: Role): Promise<Material[]> => {
    console.log("📦 getMaterials called with role:", role, "isMockMode:", isMockMode);
    if (isMockMode) {
      const filtered = localMaterials.filter(m => m.active && m.allowedRoles.includes(role));
      console.log("📦 Returning mock materials:", filtered.length);
      return filtered;
    }
    let query = supabase.from('materials').select(`*, material_assets (*)`).order('created_at', { ascending: false });

    if (role !== 'super_admin' && role !== 'manager') {
      query = query.eq('active', true).contains('allowed_roles', [role]);
    }

    const { data, error } = await query;
    if (error) {
       if (error.code === '42P01') throw error;
       throw error;
    }
    return (data || []).map(mapMaterialFromDb);
  },

  logAccess: async (materialId: string, userId: string, language: Language): Promise<void> => {
    const { error } = await supabase.from('access_logs').insert({ material_id: materialId, user_id: userId, language: language });
    if (error) console.error("Error logging access:", error);
  },

  getAccessLogs: async (): Promise<AccessLog[]> => {
    if (isMockMode) {
      return localAccessLogs;
    }
    const { data: logs, error } = await supabase
      .from('access_logs')
      .select('id, material_id, user_id, language, timestamp')
      .order('timestamp', { ascending: false })
      .limit(5000);

    if (error) {
        if (error.code === '42P01') throw error;
        throw error;
    }

    const rows = logs || [];
    const materialIds = Array.from(new Set(rows.map((r: any) => r.material_id).filter(Boolean)));
    const userIds = Array.from(new Set(rows.map((r: any) => r.user_id).filter(Boolean)));

    const [matsRes, profsRes, rolesRes] = await Promise.all([
      materialIds.length ? supabase.from('materials').select('id, title').in('id', materialIds) : Promise.resolve({ data: [] as any[] }),
      userIds.length ? supabase.from('profiles').select('id, name').in('id', userIds) : Promise.resolve({ data: [] as any[] }),
      userIds.length ? supabase.from('user_roles').select('user_id, role').in('user_id', userIds) : Promise.resolve({ data: [] as any[] }),
    ]);

    const matMap = new Map<string, any>((matsRes.data || []).map((m: any) => [m.id, m]));
    const profMap = new Map<string, any>((profsRes.data || []).map((p: any) => [p.id, p]));
    const roleMap = new Map<string, any>((rolesRes.data || []).map((r: any) => [r.user_id, r.role]));

    return rows.map((log: any) => {
      const mat = matMap.get(log.material_id);
      const prof = profMap.get(log.user_id);
      const title = mat?.title || {};
      return {
        id: log.id,
        materialId: log.material_id,
        materialTitle: title['pt-br'] || title['en-us'] || title['es-es'] || 'Item Excluído',
        userId: log.user_id,
        userName: prof?.name || 'Desconhecido',
        userRole: roleMap.get(log.user_id) || 'client',
        language: log.language,
        timestamp: log.timestamp,
      };
    });
  },


  // ---- Collections ----

  getCollections: async (role: Role): Promise<Collection[]> => {
    if (isMockMode) {
      return localCollections.filter(c => c.active && c.allowedRoles.includes(role));
    }
    let query = supabase.from('collections').select('*').order('created_at', { ascending: false });
    if (role !== 'super_admin' && role !== 'manager') {
      query = query.eq('active', true).contains('allowed_roles', [role]);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      coverImage: c.cover_image,
      allowedRoles: c.allowed_roles,
      active: c.active,
      points: c.points || 0,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }));
  },

  getCollectionItems: async (collectionId: string): Promise<CollectionItem[]> => {
    if (isMockMode) {
      return localCollectionItems.filter(item => item.collectionId === collectionId);
    }
    const { data, error } = await supabase
      .from('collection_items')
      .select(`*, materials(*, material_assets(*))`)
      .eq('collection_id', collectionId)
      .order('order_index');
    if (error) throw error;
    return (data || []).map((item: any) => ({
      id: item.id,
      collectionId: item.collection_id,
      materialId: item.material_id,
      orderIndex: item.order_index,
      material: item.materials ? {
        id: item.materials.id,
        title: item.materials.title,
        type: item.materials.type,
        allowedRoles: item.materials.allowed_roles,
        assets: (() => {
          const a: any = {};
          (item.materials.material_assets || []).forEach((asset: any) => { a[asset.language] = { url: asset.url, subtitleUrl: asset.subtitle_url, status: asset.status }; });
          return a;
        })(),
        active: item.materials.active,
        createdAt: item.materials.created_at,
        points: item.materials.points || 0,
        tags: item.materials.tags || [],
        category: item.materials.category,
      } : undefined,
    }));
  },

  createCollection: async (collection: Omit<Collection, 'id' | 'createdAt'>): Promise<void> => {
    const { error } = await supabase.from('collections').insert({
      title: collection.title,
      description: collection.description,
      cover_image: collection.coverImage,
      allowed_roles: collection.allowedRoles,
      active: collection.active,
      points: collection.points,
    });
    if (error) throw error;
  },

  updateCollection: async (collection: Collection): Promise<void> => {
    const { error } = await supabase.from('collections').update({
      title: collection.title,
      description: collection.description,
      cover_image: collection.coverImage,
      allowed_roles: collection.allowedRoles,
      active: collection.active,
      points: collection.points,
    }).eq('id', collection.id);
    if (error) throw error;
  },

  deleteCollection: async (id: string): Promise<void> => {
    const { error } = await supabase.from('collections').delete().eq('id', id);
    if (error) throw error;
  },

  setCollectionItems: async (collectionId: string, materialIds: string[]): Promise<void> => {
    await supabase.from('collection_items').delete().eq('collection_id', collectionId);
    if (materialIds.length === 0) return;
    const items = materialIds.map((materialId, idx) => ({ collection_id: collectionId, material_id: materialId, order_index: idx }));
    const { error } = await supabase.from('collection_items').insert(items);
    if (error) throw error;
  },

  // ---- User Progress ----

  getUserProgress: async (userId: string): Promise<UserProgress[]> => {
    if (isMockMode) {
      return localUserProgress.filter(p => p.userId === userId);
    }
    const { data, error } = await supabase.from('user_progress').select('*').eq('user_id', userId);
    if (error) throw error;
    return (data || []).map((p: any) => ({
      id: p.id,
      userId: p.user_id,
      materialId: p.material_id,
      collectionId: p.collection_id || undefined,
      status: p.status,
      completedAt: p.completed_at,
      createdAt: p.created_at,
    }));
  },

  upsertProgress: async (userId: string, materialId: string, status: 'started' | 'completed', collectionId?: string): Promise<void> => {
    const payload: any = { user_id: userId, material_id: materialId, status, collection_id: collectionId || null };
    if (status === 'completed') payload.completed_at = new Date().toISOString();
    const { error } = await supabase.from('user_progress').upsert(payload, { onConflict: 'user_id,material_id,collection_id' });
    if (error) console.error('Error upserting progress:', error);
  },

  addPoints: async (userId: string, points: number): Promise<void> => {
    const { data: profile } = await supabase.from('profiles').select('points').eq('id', userId).single();
    const currentPoints = (profile?.points || 0) + points;
    await supabase.from('profiles').update({ points: currentPoints }).eq('id', userId);
  },

  // ---- Gamification Levels ----

  getGamificationLevels: async (): Promise<GamificationLevel[]> => {
    const { data, error } = await supabase.from('gamification_levels').select('*').order('order_index');
    if (error) throw error;
    return (data || []).map((l: any) => ({
      id: l.id,
      name: l.name,
      minPoints: l.min_points,
      orderIndex: l.order_index,
      color: l.color || '#c9a655',
      createdAt: l.created_at,
      updatedAt: l.updated_at,
    }));
  },

  createGamificationLevel: async (name: string, minPoints: number, orderIndex: number, color: string = '#c9a655'): Promise<void> => {
    const { error } = await supabase.from('gamification_levels').insert({ name, min_points: minPoints, order_index: orderIndex, color });
    if (error) throw error;
  },

  updateGamificationLevel: async (id: string, name: string, minPoints: number, orderIndex: number, color?: string): Promise<void> => {
    const payload: any = { name, min_points: minPoints, order_index: orderIndex };
    if (color !== undefined) payload.color = color;
    const { error } = await supabase.from('gamification_levels').update(payload).eq('id', id);
    if (error) throw error;
  },

  deleteGamificationLevel: async (id: string): Promise<void> => {
    const { error } = await supabase.from('gamification_levels').delete().eq('id', id);
    if (error) throw error;
  },

  // ---- Collection Progress ----

  getCollectionProgress: async (userId?: string): Promise<CollectionProgress[]> => {
    let query = supabase.from('collection_progress').select('*');
    if (userId) query = query.eq('user_id', userId);
    const { data, error } = await query;
    if (error) { console.error('Error fetching collection progress:', error); return []; }
    return (data || []).map((p: any) => ({
      id: p.id,
      userId: p.user_id,
      collectionId: p.collection_id,
      status: p.status,
      startedAt: p.started_at,
      completedAt: p.completed_at,
    }));
  },

  getAllCollectionProgress: async (): Promise<CollectionProgress[]> => {
    if (isMockMode) {
      return localCollectionProgress;
    }
    const { data, error } = await supabase.from('collection_progress').select('*');
    if (error) { console.error('Error fetching all collection progress:', error); return []; }
    return (data || []).map((p: any) => ({
      id: p.id,
      userId: p.user_id,
      collectionId: p.collection_id,
      status: p.status,
      startedAt: p.started_at,
      completedAt: p.completed_at,
    }));
  },

  upsertCollectionProgress: async (userId: string, collectionId: string, status: 'started' | 'completed'): Promise<void> => {
    const payload: any = { user_id: userId, collection_id: collectionId, status };
    if (status === 'completed') payload.completed_at = new Date().toISOString();
    const { error } = await supabase.from('collection_progress').upsert(payload, { onConflict: 'user_id,collection_id' });
    if (error) console.error('Error upserting collection progress:', error);
  },

  // ---- Invite Tokens ----

  getInviteTokens: async () => {
    const { data, error } = await supabase
      .from('invite_tokens')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((t: any) => ({
      id: t.id,
      token: t.token,
      role: t.role,
      status: (t.used_at ? 'used' : new Date(t.expires_at) < new Date() ? 'expired' : 'active'),
      usedBy: t.used_by,
      usedAt: t.used_at,
      expiresAt: t.expires_at,
      createdAt: t.created_at,
      senderName: t.sender_name,
      recipientName: t.recipient_name,
      recipientPhone: t.recipient_phone,
      recipientMessage: t.recipient_message,
      sharePreparedAt: t.share_prepared_at,
      sharedAt: t.shared_at,
    }));
  },

  prepareInviteShare: async (
    tokenId: string,
    payload: { senderName: string; recipientName: string; recipientPhone: string; message: string }
  ) => {
    const { error } = await supabase
      .from('invite_tokens')
      .update({
        sender_name: payload.senderName,
        recipient_name: payload.recipientName,
        recipient_phone: payload.recipientPhone,
        recipient_message: payload.message,
        share_prepared_at: new Date().toISOString(),
      } as any)
      .eq('id', tokenId);
    if (error) throw error;
  },

  markInviteShared: async (tokenId: string) => {
    const { error } = await supabase
      .from('invite_tokens')
      .update({ shared_at: new Date().toISOString() } as any)
      .eq('id', tokenId);
    if (error) throw error;
  },

  createInviteToken: async (role: string, expiresInDays: number = 7) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    const { data, error } = await supabase
      .from('invite_tokens')
      .insert({ role: role as any, expires_at: expiresAt.toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteInviteToken: async (id: string) => {
    const { error } = await supabase.from('invite_tokens').delete().eq('id', id);
    if (error) throw error;
  },

  validateInviteToken: async (token: string) => {
    const { data, error } = await supabase
      .from('invite_tokens')
      .select('*')
      .eq('token', token)
      .eq('status', 'active')
      .is('used_at', null)
      .gt('expires_at', new Date().toISOString())
      .single();
    if (error || !data) return null;
    return { id: data.id, token: data.token, role: data.role, expiresAt: data.expires_at };
  },

  markInviteTokenUsed: async (tokenId: string, userId: string) => {
    const { error } = await supabase
      .from('invite_tokens')
      .update({ used_by: userId, used_at: new Date().toISOString(), status: 'used' } as any)
      .eq('id', tokenId);
    if (error) console.error('Error marking token as used:', error);
  },

  // Webhooks CRUD
  getWebhooks: async (): Promise<Webhook[]> => {
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((w) => ({
      id: w.id,
      name: w.name,
      url: w.url,
      event: w.event,
      eventFilter: w.event_filter || undefined,
      active: w.active,
      createdAt: w.created_at,
      updatedAt: w.updated_at,
    }));
  },

  getWebhookById: async (id: string): Promise<Webhook | null> => {
    const { data, error } = await supabase.from('webhooks').select('*').eq('id', id).single();
    if (error || !data) return null;
    return {
      id: data.id,
      name: data.name,
      url: data.url,
      event: data.event,
      eventFilter: data.event_filter || undefined,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  getWebhooksByEvent: async (event: string): Promise<Webhook[]> => {
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('event', event)
      .eq('active', true);
    if (error) throw error;
    return (data || []).map((w) => ({
      id: w.id,
      name: w.name,
      url: w.url,
      event: w.event,
      eventFilter: w.event_filter || undefined,
      active: w.active,
      createdAt: w.created_at,
      updatedAt: w.updated_at,
    }));
  },

  createWebhook: async (webhook: {
    name: string;
    url: string;
    event: string;
    eventFilter?: WebhookEventFilter;
    active?: boolean;
  }): Promise<Webhook> => {
    const { data, error } = await supabase
      .from('webhooks')
      .insert({
        name: webhook.name,
        url: webhook.url,
        event: webhook.event,
        event_filter: webhook.eventFilter || {},
        active: webhook.active ?? true,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      name: data.name,
      url: data.url,
      event: data.event,
      eventFilter: data.event_filter || undefined,
      active: data.active,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  updateWebhook: async (id: string, webhook: Partial<{
    name: string;
    url: string;
    event: string;
    eventFilter: WebhookEventFilter;
    active: boolean;
  }>): Promise<void> => {
    const updateData: Record<string, unknown> = {};
    if (webhook.name !== undefined) updateData.name = webhook.name;
    if (webhook.url !== undefined) updateData.url = webhook.url;
    if (webhook.event !== undefined) updateData.event = webhook.event;
    if (webhook.eventFilter !== undefined) updateData.event_filter = webhook.eventFilter;
    if (webhook.active !== undefined) updateData.active = webhook.active;
    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase.from('webhooks').update(updateData).eq('id', id);
    if (error) throw error;
  },

  deleteWebhook: async (id: string): Promise<void> => {
    const { error } = await supabase.from('webhooks').delete().eq('id', id);
    if (error) throw error;
  },

  getWebhookLogs: async (webhookId: string): Promise<WebhookLog[]> => {
    const { data, error } = await supabase
      .from('webhook_logs')
      .select('*')
      .eq('webhook_id', webhookId)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data || []).map((l) => ({
      id: l.id,
      webhookId: l.webhook_id,
      event: l.event,
      payload: l.payload || {},
      status: l.status,
      responseCode: l.response_code,
      responseBody: l.response_body,
      createdAt: l.created_at,
    }));
  },

  createWebhookLog: async (log: {
    webhookId: string;
    event: string;
    payload: Record<string, unknown>;
    status: 'success' | 'error';
    responseCode?: number;
    responseBody?: string;
  }): Promise<WebhookLog> => {
    const { data, error } = await supabase
      .from('webhook_logs')
      .insert({
        webhook_id: log.webhookId,
        event: log.event,
        payload: log.payload,
        status: log.status,
        response_code: log.responseCode,
        response_body: log.responseBody,
      })
      .select()
      .single();
    if (error) throw error;
    return {
      id: data.id,
      webhookId: data.webhook_id,
      event: data.event,
      payload: data.payload || {},
      status: data.status,
      responseCode: data.response_code,
      responseBody: data.response_body,
      createdAt: data.created_at,
    };
  },

  getSystemIntegrations: async (): Promise<SystemIntegrations> => {
    const { data, error } = await supabase
      .from('system_integrations')
      .select('*')
      .limit(1)
      .single();

    if (error || !data) {
      return {
        id: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      id: data.id,
      geminiApiKey: data.gemini_api_key_encrypted ? await decrypt(data.gemini_api_key_encrypted) : undefined,
      openaiApiKey: data.openai_api_key_encrypted ? await decrypt(data.openai_api_key_encrypted) : undefined,
      groqApiKey: data.groq_api_key_encrypted ? await decrypt(data.groq_api_key_encrypted) : undefined,
      openrouterApiKey: data.openrouter_api_key_encrypted ? await decrypt(data.openrouter_api_key_encrypted) : undefined,
      geminiFunction: data.gemini_function || 'translate',
      openaiFunction: data.openai_function || 'image',
      groqFunction: data.groq_function || 'summarize',
      openrouterFunction: data.openrouter_function || 'chatbot',
      geminiActive: data.gemini_active ?? true,
      openaiActive: data.openai_active ?? true,
      groqActive: data.groq_active ?? true,
      openrouterActive: data.openrouter_active ?? true,
      supabaseUrl: data.supabase_url || undefined,
      supabaseAnonKey: data.supabase_anon_key_encrypted ? await decrypt(data.supabase_anon_key_encrypted) : undefined,
      supabasePublishableKey: data.supabase_publishable_key_encrypted ? await decrypt(data.supabase_publishable_key_encrypted) : undefined,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  updateSystemIntegrations: async (integrations: Partial<SystemIntegrations>): Promise<void> => {
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (integrations.geminiApiKey !== undefined) {
      updateData.gemini_api_key_encrypted = integrations.geminiApiKey ? await encrypt(integrations.geminiApiKey) : null;
    }
    if (integrations.openaiApiKey !== undefined) {
      updateData.openai_api_key_encrypted = integrations.openaiApiKey ? await encrypt(integrations.openaiApiKey) : null;
    }
    if (integrations.groqApiKey !== undefined) {
      updateData.groq_api_key_encrypted = integrations.groqApiKey ? await encrypt(integrations.groqApiKey) : null;
    }
    if (integrations.openrouterApiKey !== undefined) {
      updateData.openrouter_api_key_encrypted = integrations.openrouterApiKey ? await encrypt(integrations.openrouterApiKey) : null;
    }
    if (integrations.supabaseUrl !== undefined) {
      updateData.supabase_url = integrations.supabaseUrl || null;
    }
    if (integrations.supabaseAnonKey !== undefined) {
      updateData.supabase_anon_key_encrypted = integrations.supabaseAnonKey ? await encrypt(integrations.supabaseAnonKey) : null;
    }
    if (integrations.supabasePublishableKey !== undefined) {
      updateData.supabase_publishable_key_encrypted = integrations.supabasePublishableKey ? await encrypt(integrations.supabasePublishableKey) : null;
    }

    // Function assignments
    if (integrations.geminiFunction !== undefined) {
      updateData.gemini_function = integrations.geminiFunction;
    }
    if (integrations.openaiFunction !== undefined) {
      updateData.openai_function = integrations.openaiFunction;
    }
    if (integrations.groqFunction !== undefined) {
      updateData.groq_function = integrations.groqFunction;
    }
    if (integrations.openrouterFunction !== undefined) {
      updateData.openrouter_function = integrations.openrouterFunction;
    }

    // Active status
    if (integrations.geminiActive !== undefined) {
      updateData.gemini_active = integrations.geminiActive;
    }
    if (integrations.openaiActive !== undefined) {
      updateData.openai_active = integrations.openaiActive;
    }
    if (integrations.groqActive !== undefined) {
      updateData.groq_active = integrations.groqActive;
    }
    if (integrations.openrouterActive !== undefined) {
      updateData.openrouter_active = integrations.openrouterActive;
    }

    const { data: existing } = await supabase
      .from('system_integrations')
      .select('id')
      .limit(1)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('system_integrations')
        .update(updateData)
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('system_integrations')
        .insert(updateData);
      if (error) throw error;
    }
  },

  login: async () => {},
  register: async () => {},
  loginMock: async () => {},
};

