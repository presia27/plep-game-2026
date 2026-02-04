/**
 * Represents a game item
 * 
 * @author Preston Sia
 */
export class Item {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }
}