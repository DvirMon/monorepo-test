import { BehaviorSubject, filter, map, Observable } from "rxjs";

interface QueueConfig<T = any> {
  enqueue(item: T): void;
  dequeue(): T | null;
  size(): number;
}

export class Queue<T = any> implements QueueConfig<T>{

  private items: T[];

  constructor(...params: T[]) {
    this.items = [...params];
  }

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | null {
    if (this.items.length > 0) {
      return this.items.shift()!;
    } else {
      return null
    }
  }

  size(): number {
    return this.items.length
  }

}
