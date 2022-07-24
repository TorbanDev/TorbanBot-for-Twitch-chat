class Queue {
  constructor() {
    this.items = [];
  }
  enqueue(element) {
    // adding element to the queue
    this.items.push(element);
  }

  // dequeue function
  dequeue() {
    if (this.isEmpty()) return;
    return this.items.shift();
  }
  front() {
    // returns the Front element of
    // the queue without removing it.
    if (this.isEmpty()) return;
    return this.items[0];
  }

  // isEmpty function
  isEmpty() {
    // return true if the queue is empty.
    return this.items.length == 0;
  }
}

module.exports = { Queue };
