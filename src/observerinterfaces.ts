export interface Observer {
  observerUpdate(data: any, propertyName: string): void;
}

export interface Observable {
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  notifyObservers(data?: any, notificationType?: string): void;
}

/* OBSERVER IDENTIFIERS */
/** The player's inventory has changed */
export const OBS_INVENTORY_CHANGE: string = "OBS_INVENTORY_CHANGE";
/** The active order at the front of the queue has been complete */
export const OBS_ORDER_COMPLETE: string = "OBS_ORDER_COMPLETE";
/** A new active order is now at the front of the queue */
export const OBS_NEW_ACTIVE_ORDER: string = "OBS_NEW_ACTIVE_ORDER";