# Stage 1

## Priority Inbox - Implementation Approach

To efficiently maintain the "Top 10" most important unread notifications in a highly concurrent environment where new notifications are streaming in continuously, I implemented a **Min-Heap (Priority Queue)** approach. 

### Why a Min-Heap Priority Queue?
A naive approach would be to store all notifications in an array and sort them every time a new notification arrives. This would result in an `O(N log N)` time complexity per operation, which is highly inefficient for a real-time notification stream.

Instead, I used a **Min-Heap of size K (where K = 10)**. 
- **Time Complexity:** For every incoming notification, we compare it against the root of the Min-Heap (which represents the lowest priority notification currently in the Top 10).
- If the new notification has a higher priority, we extract the minimum and insert the new one. The operation takes `O(log K)` time.
- Processing a batch of `N` notifications thus takes `O(N log K)` time. Since K is a constant (10), this reduces to an extremely efficient **`O(N)`** time complexity overall.
- **Space Complexity:** `O(K)`, as we strictly maintain only 10 elements in memory at any given time, regardless of how many thousands of notifications are fetched.

### Priority Logic (Weight & Recency)
Priority is determined using a custom comparison function:
1. **Primary Key (Weight):** `Placement` (3) > `Result` (2) > `Event` (1). 
2. **Secondary Key (Recency):** If two notifications share the exact same weight (e.g., both are `Placement`), we compare their ISO timestamps. The newer (more recent) timestamp receives the higher priority.

### Code Organization
1. **`utils/priorityQueue.ts`:** Contains the completely custom, from-scratch implementation of the `TopKNotifications` class handling the binary heap operations (`heapifyUp`, `heapifyDown`, `insert`, `getTop`).
2. **`app/notification/page.tsx`:** Contains the frontend UI that fulfills the "Output display/screenshots" deliverable. It fetches the data from the protected `/notifications` API route, pipes the raw data through the Priority Queue, and renders the guaranteed Top 10 results dynamically.
3. **Logging Integration:** `Log()` is invoked at strategic stages (Initialization, Fetched Count, Queue Processing, and Final Evaluation) replacing any and all use of `console.log`, directly adhering to the stringent tracking constraints.

## Application Screenshots

### Priority Inbox Configuration
![Priority Inbox View 1](public/Screenshot%202026-05-02%20123820.png)

### User Authentication Flow
![Priority Inbox View 2](public/Screenshot%202026-05-02%20124559.png)

### Real-Time Priority Execution
![Priority Inbox View 3](public/Screenshot%202026-05-02%20124645.png)
