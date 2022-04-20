class ListNode<T> {
  value: T;
  next: ListNode<T> | null;
  prev: ListNode<T> | null;

  constructor(value: T, prev: ListNode<T> | null, next: ListNode<T> | null) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }
}

export default class LinkedList<T> {
  head: ListNode<T> | null;
  tail: ListNode<T> | null;
  size: number;

  //   pushCount: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
    // this.pushCount = 0;
  }

  push(value: T) {
    // this.pushCount++;
    if (!this.head) {
      this.head = new ListNode<T>(value, null, null);
      this.tail = this.head;
      this.size += 1;
      return this;
    }

    const newNode = new ListNode<T>(value, this.tail, null);
    this.tail!.next = newNode;
    // this.tail!.prev = this.tail;
    this.tail = newNode;
    this.size += 1;
    return this;
  }
}
