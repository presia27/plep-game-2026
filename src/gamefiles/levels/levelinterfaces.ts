export interface LevelResult {
  success: boolean;
  reason?: string; // fail reason
}

export interface LevelSummary {
  quota: number;
  ordersFulfilled: number;
  avgAccuracy: number;
  bossSatisfaction: number;
  playerHealth: number;
  playerMaxHealth: number;
}

export interface ILevelParams {
  duration: number;
  orderPromptVariability: number;
  totalOrders: number;
}
