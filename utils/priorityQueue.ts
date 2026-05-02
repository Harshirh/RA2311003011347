export interface AppNotification {
  ID: string;
  Type: 'Placement' | 'Result' | 'Event' | string;
  Message: string;
  Timestamp: string;
}

const TYPE_WEIGHT: Record<string, number> = {
  'Placement': 3,
  'Result': 2,
  'Event': 1
};

export class TopKNotifications {
  private heap: AppNotification[] = [];
  private k: number;

  constructor(k: number) {
    this.k = k;
  }

  private compare(a: AppNotification, b: AppNotification): number {
    const weightA = TYPE_WEIGHT[a.Type] || 0;
    const weightB = TYPE_WEIGHT[b.Type] || 0;

    if (weightA !== weightB) {
      return weightA - weightB;
    }

    const timeA = new Date(a.Timestamp.replace(' ', 'T')).getTime();
    const timeB = new Date(b.Timestamp.replace(' ', 'T')).getTime();
    
    return timeA - timeB;
  }

  private parent(i: number) { return Math.floor((i - 1) / 2); }
  private left(i: number) { return 2 * i + 1; }
  private right(i: number) { return 2 * i + 2; }

  private swap(i: number, j: number) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  private heapifyUp(i: number) {
    while (i > 0 && this.compare(this.heap[i], this.heap[this.parent(i)]) < 0) {
      this.swap(i, this.parent(i));
      i = this.parent(i);
    }
  }

  private heapifyDown(i: number) {
    let minIndex = i;
    const l = this.left(i);
    const r = this.right(i);

    if (l < this.heap.length && this.compare(this.heap[l], this.heap[minIndex]) < 0) {
      minIndex = l;
    }
    if (r < this.heap.length && this.compare(this.heap[r], this.heap[minIndex]) < 0) {
      minIndex = r;
    }

    if (i !== minIndex) {
      this.swap(i, minIndex);
      this.heapifyDown(minIndex);
    }
  }

  public insert(notif: AppNotification) {
    if (this.heap.length < this.k) {
      this.heap.push(notif);
      this.heapifyUp(this.heap.length - 1);
    } else if (this.heap.length === this.k) {
      if (this.compare(notif, this.heap[0]) > 0) {
        this.heap[0] = notif;
        this.heapifyDown(0);
      }
    }
  }

  public getTop(): AppNotification[] {
    return [...this.heap].sort((a, b) => this.compare(b, a));
  }
}
