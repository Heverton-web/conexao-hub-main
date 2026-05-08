export type Role = 'client' | 'distributor' | 'consultant' | 'manager' | 'super_admin';
export type Language = 'pt-br' | 'en-us' | 'es-es';
export type MaterialType = 'image' | 'pdf' | 'video' | 'audio' | 'html';
export type UserStatus = 'pending' | 'active' | 'inactive' | 'rejected';
export type TranslationStatus = 'draft' | 'review' | 'published';
export type ProgressStatus = 'started' | 'completed';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  whatsapp: string;
  cro?: string;
  status: UserStatus;
  allowedTypes?: MaterialType[];
  points: number;
  preferences: {
    theme: 'dark';
    language: Language;
  };
  rejectionReason?: string;
}

export interface MaterialAsset {
  url: string;
  subtitleUrl?: string;
  status: TranslationStatus;
}

export interface Material {
  id: string;
  title: Partial<Record<Language, string>>;
  type: MaterialType;
  allowedRoles: Role[];
  assets: Partial<Record<Language, MaterialAsset>>;
  active: boolean;
  createdAt: string;
  points: number;
  tags: string[];
  category?: string;
}

export interface Collection {
  id: string;
  title: Partial<Record<Language, string>>;
  description?: Partial<Record<Language, string>>;
  coverImage?: string;
  allowedRoles: Role[];
  active: boolean;
  points: number;
  createdAt: string;
  updatedAt?: string;
  // computed fields
  itemCount?: number;
  completedCount?: number;
}

export interface CollectionItem {
  id: string;
  collectionId: string;
  materialId: string;
  orderIndex: number;
  material?: Material;
}

export interface UserProgress {
  id: string;
  userId: string;
  materialId: string;
  collectionId?: string;
  status: ProgressStatus;
  completedAt?: string;
  createdAt: string;
}

export interface AccessLog {
  id: string;
  materialId: string;
  materialTitle: string;
  userId: string;
  userName: string;
  userRole: Role;
  language: Language;
  timestamp: string;
}

export interface ColorScheme {
  // Base
  background: string;
  surface: string;
  surfaceHover: string;
  card: string;
  // Text
  textMain: string;
  textMuted: string;
  textInverted: string;
  // Border
  border: string;
  borderSubtle: string;
  // Brand
  accent: string;
  accentHover: string;
  accentForeground: string;
  accentMuted: string;
  // Feedback
  success: string;
  successBg: string;
  warning: string;
  warningBg: string;
  error: string;
  errorBg: string;
  // Components
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  badgeBg: string;
  tooltipBg: string;
  tooltipText: string;
  // Effects
  overlay: string;
  shadow: string;
  glassTint: string;
  headerBg: string;
  scrollbarThumb: string;
  scrollbarTrack: string;
  ring: string;
  // Gradients
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  // Hover
  hoverBg: string;
  hoverBorder: string;
  hoverScale: string;
  hoverShadow: string;
}

export interface ThemeModeConfig {
  mode: 'single';
  defaultTheme: 'dark';
}

export interface EnvironmentEffects {
  pageBg: string;
  blob1Color: string;
  blob2Color: string;
  blob3Color: string;
  blobOpacity: string;
  blobSize: string;
  blobBlur: string;
  grainOpacity: string;
  grainBlendMode: string;
  grainContrast: string;
  glassOpacity: string;
  glassBlur: string;
  glassBorderOpacity: string;
}

export type EnvironmentKey = 'auth' | 'client' | 'manager' | 'admin' | 'global';

export type EnvironmentThemes = Record<EnvironmentKey, EnvironmentEffects>;

export interface SystemConfig {
  appName: string;
  logoUrl?: string;
  webhookUrl?: string;
  themeDark: ColorScheme;
  themeMode: ThemeModeConfig;
  environmentThemes?: EnvironmentThemes;
  showMockLoginCards?: boolean;
}

// Gamification
export type UserLevel = 'Iniciante' | 'Bronze' | 'Prata' | 'Ouro' | 'Master';

export const LEVEL_THRESHOLDS: Record<UserLevel, number> = {
  Iniciante: 0,
  Bronze: 100,
  Prata: 300,
  Ouro: 600,
  Master: 1000,
};

export function getUserLevel(points: number): UserLevel {
  if (points >= 1000) return 'Master';
  if (points >= 600) return 'Ouro';
  if (points >= 300) return 'Prata';
  if (points >= 100) return 'Bronze';
  return 'Iniciante';
}

export function getNextLevelThreshold(points: number): number {
  if (points >= 1000) return 1000;
  if (points >= 600) return 1000;
  if (points >= 300) return 600;
  if (points >= 100) return 300;
  return 100;
}

// Webhook Events
export type WebhookEvent =
  | 'user.registered'
  | 'user.invite_used'
  | 'user.status_changed'
  | 'material.accessed'
  | 'material.completed'
  | 'collection.completed'
  | 'gamification.level_up'
  | 'invite.generated'
  | 'invite.shared';

export interface WebhookEventFilter {
  roles?: Role[];
  userId?: string;
  collectionId?: string;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  event: string;
  eventFilter?: WebhookEventFilter;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  event: string;
  payload: Record<string, unknown>;
  status: 'success' | 'error';
  responseCode?: number;
  responseBody?: string;
  createdAt: string;
}

export const WEBHOOK_EVENTS: { value: WebhookEvent; label: string }[] = [
  { value: 'user.registered', label: 'Usuário registrado' },
  { value: 'user.invite_used', label: 'Convite utilizado' },
  { value: 'user.status_changed', label: 'Status do usuário alterado' },
  { value: 'material.accessed', label: 'Material acessado' },
  { value: 'material.completed', label: 'Material concluído' },
  { value: 'collection.completed', label: 'Coleção concluída' },
  { value: 'gamification.level_up', label: 'Level-up (gamificação)' },
  { value: 'invite.generated', label: 'Convite gerado' },
  { value: 'invite.shared', label: 'Convite compartilhado' },
];

export type AIFunction = 'translate' | 'image' | 'summarize' | 'chatbot';

export interface SystemIntegrations {
  id: string;
  
  // API Keys
  geminiApiKey?: string;
  openaiApiKey?: string;
  groqApiKey?: string;
  openrouterApiKey?: string;
  
  // Function Assignment
  geminiFunction?: AIFunction;
  openaiFunction?: AIFunction;
  groqFunction?: AIFunction;
  openrouterFunction?: AIFunction;
  
  // Active Status (cost control)
  geminiActive?: boolean;
  openaiActive?: boolean;
  groqActive?: boolean;
  openrouterActive?: boolean;
  
  // Supabase
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabasePublishableKey?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
