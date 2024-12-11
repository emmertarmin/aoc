interface ListNode<T> {
  value: T;
  next: ListNode<T> | null;
  prev: ListNode<T> | null;
}

function createNode<T>(value: T): ListNode<T> {
  return {
    value,
    next: null,
    prev: null
  };
}

export class LinkedList<T> {
  head: ListNode<T> | null;
  tail: ListNode<T> | null;
  size: number;
  current: ListNode<T> | null;

  constructor(fromArray?: T[]) {
    this.head = null;
    this.tail = null;
    this.size = 0;
    this.current = null;

    if (fromArray) {
      fromArray.forEach(value => this.append(value));
    }
  }

  print(): void {
    let node = this.head;
    while (node) {
      console.log(node.value);
      node = node.next;
    }
    console.log('---');
  }

  prepend(value: T): void {
    const node = createNode(value);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.head.prev = node;
      node.next = this.head;
      this.head = node;
    }
    this.size++;
  }

  append(value: T): void {
    const node = createNode(value);
    if (this.head === null) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.size++;
  }

  insertBeforeCurrent(value: T): void {
    if (!this.current) {
      throw new Error('Current node is not set');
    }
    if (this.current === this.head) {
      this.prepend(value);
      return;
    }
    const node = createNode(value);
    node.prev = this.current.prev;
    node.next = this.current;
    if (this.current.prev) {
      this.current.prev.next = node;
    }
    this.current.prev = node;
    this.size++;
  }

  insertAfterCurrent(value: T): void {
    if (!this.current) {
      throw new Error('Current node is not set');
    }
    if (this.current === this.tail) {
      this.append(value);
      return;
    }
    const node = createNode(value);
    node.next = this.current.next;
    node.prev = this.current;
    if (this.current.next) {
      this.current.next.prev = node;
    }
    this.current.next = node;
    this.size++;
  }

  updateCurrent(value: T): void {
    if (this.current) {
      this.current.value = value;
    }
  }

  toArray(): T[] {
    const result: T[] = [];
    let node = this.head;
    while (node) {
      result.push(node.value);
      node = node.next;
    }
    return result;
  }
}