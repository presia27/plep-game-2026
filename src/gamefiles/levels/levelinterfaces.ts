export interface LevelResult {
  success: boolean;
  reason?: string;
}

export interface ILevelParams {
  duration: number;
  orderPromptVariability: number;
  totalOrders: number;
}
