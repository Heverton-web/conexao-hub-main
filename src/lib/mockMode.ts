export type MockModeConfig = {
  enabled: boolean;
  simulateNetworkDelay: number;
};

const defaultConfig: MockModeConfig = {
  enabled: import.meta.env.DEV, // Default to true in DEV, false in PROD
  simulateNetworkDelay: 50,
};

class MockModeManager {
  private config: MockModeConfig = { ...defaultConfig };
  private listeners: Set<(enabled: boolean) => void> = new Set();

  get enabled(): boolean {
    return this.config.enabled;
  }

  get configValue(): MockModeConfig {
    return { ...this.config };
  }

  setEnabled(value: boolean): void {
    this.config.enabled = value;
    this.notifyListeners();
    console.log(`🔄 Mock Mode: ${value ? 'ATIVADO' : 'DESATIVADO'}`);
  }

  enable(): void {
    this.setEnabled(true);
  }

  disable(): void {
    this.setEnabled(false);
  }

  setConfig(newConfig: Partial<MockModeConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  simulateDelay(): Promise<void> {
    if (!this.config.enabled || this.config.simulateNetworkDelay === 0) {
      return Promise.resolve();
    }
    return new Promise(resolve => setTimeout(resolve, this.config.simulateNetworkDelay));
  }

  subscribe(listener: (enabled: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config.enabled));
  }
}

export const mockMode = new MockModeManager();

export const isMockMode = () => mockMode.enabled;

export const enableMockMode = () => mockMode.enable();

export const disableMockMode = () => mockMode.disable();

export const toggleMockMode = () => mockMode.setEnabled(!mockMode.enabled);