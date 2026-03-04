export interface Observer {
  observerUpdate(data: any, propertyName: string): void;
}

export interface Observable {
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  notifyObservers(data?: any, notificationType?: string): void;
}

/* OBSERVER IDENTIFIERS */
export const OBS_INVENTORY_CHANGE: string = "OBS_INVENTORY_CHANGE";
export const OBS_ORDER_COMPLETE: string = "OBS_ORDER_COMPLETE";
export const OBS_NEW_ACTIVE_ORDER: string = "OBS_NEW_ACTIVE_ORDER";
