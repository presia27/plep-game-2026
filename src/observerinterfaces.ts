export interface Observer {
  observerUpdate(data: any, propertyName: string): void;
}

export interface Observable {
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  notifyObservers(): void;
}

/* OBSERVER IDENTIFIERS */
export const OBS_INVENTORY_CHANGE: string = "OBS_INVENTORY_CHANGE";
