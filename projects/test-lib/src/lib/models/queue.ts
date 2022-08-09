import { BehaviorSubject, concatAll, filter, map, mergeMap, Observable, Subject } from "rxjs";

interface QueueConfig<T = any> {
  enqueue(item: T): void;
  dequeue(): T | null;
  size(): number;
}

export class Queue<T = any> implements QueueConfig<T>{

  private _items: T[];
  private _queue = new Subject<Observable<T>>();
  private _items$!: Observable<T>


  constructor(...params: T[]) {
    this._items = [...params];
    this._items$ = this._setItems()
  }

  private _setItems() {
    return this._queue.pipe(concatAll());
  }

  addToQueue(item: Observable<T>): void {
    this._queue.next(item);
  }

  getItems(): Observable<T> {
    return this._items$
  }

  enqueue(item: T): void {
    this._items.push(item);
  }

  dequeue(): T | null {
    if (this._items.length > 0) {
      return this._items.shift()!;
    } else {
      return null
    }
  }



  size(): number {
    return this._items.length
  }

}
