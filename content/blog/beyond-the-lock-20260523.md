---
title: "beyond the lock"
date: "2026-05-23"
description: "why go's concurrency model stands out, how goroutines differ from traditional threads, and the patterns for safe concurrent execution"
tags: ["golang", "concurrency", "system-design"]
---

concurrency in modern software is often impressive when it works, but incredibly dangerous if you slip up. in most traditional programming languages, handling concurrent operations means dealing with heavy operating system threads, manual memory locks, and a constant fear of deadlocks.

go changes the game. it was designed from the ground up to make concurrency a first-class citizen, introducing a model that is both highly performant and remarkably simple to reason about.

let's demystify how go concurrency works, how it compares to traditional systems, and what proper concurrent design looks like in practice.

## threads vs. goroutines: the lightweight revolution

to understand why go's concurrency model is so powerful, we have to look at how traditional languages (like java, c++, or c#) handle concurrency compared to go.

### 1. traditional concurrency (os threads)

in traditional languages, concurrency is usually mapped 1:1 to operating system (os) threads.

- **memory footprint**: each os thread is heavy, allocating a large, fixed-size stack (usually around 1mb of ram). if you want to run 10,000 concurrent tasks, you need 10gb of ram just to keep the threads alive.
- **context switching**: switching between os threads requires transitioning into the os kernel space to save and restore cpu registers. this is computationally expensive and introduces significant latency.
- **creation cost**: creating and destroying os threads is slow, which is why traditional systems require complex thread pools to recycle them.

### 2. go concurrency (goroutines)

go does not map concurrency 1:1 to os threads. instead, it introduces **goroutines**, lightweight threads managed by the go runtime scheduler, not the operating system.

- **memory footprint**: a goroutine starts with an incredibly small stack size (only 2kb). more importantly, the stack grows and shrinks dynamically in the heap as needed. you can easily run hundreds of thousands of goroutines on a standard laptop without running out of memory.
- **context switching**: the go runtime multiplexes thousands of goroutines onto a much smaller number of physical os threads (an M:N scheduler model). context switches happen entirely in user space, taking only a few nanoseconds because they don't involve the os kernel.
- **cheap creation**: launching a goroutine is as simple as prefixing any function call with the `go` keyword.

---

## the go philosophy: share by communicating

in traditional multi-threaded programming, threads coordinate by **sharing memory**. multiple threads access the same variables, and developers use locks (mutexes) or semaphores to prevent them from reading and writing at the same time.

this approach is notoriously error-prone. if you forget a lock, you get a data race. if you lock in the wrong order, your program deadlocks and freezes.

go flips this paradigm with its core concurrency philosophy, coined by rob pike:

> "do not communicate by sharing memory; instead, share memory by communicating."

instead of using a lock to guard a shared variable, go encourages you to pass the variable (or data) back and forth through a thread-safe pipe called a **channel**. by sending data through a channel, only one goroutine owns that data at any given millisecond. ownership is transferred safely through communication.

---

## bad practice: sharing memory and hoping for the best

let's look at an example of the traditional way of sharing memory, but written in go. suppose we want to concurrently increment a shared counter across multiple background tasks.

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	counter := 0

	// launch 1,000 goroutines to increment the counter
	for i := 0; i < 1000; i++ {
		go func() {
			counter++ // ❌ data race! multiple goroutines write to the same memory
		}()
	}

	// ❌ naive sleep: waiting and hoping all goroutines finish in time
	time.Sleep(1 * time.Second)
	fmt.Printf("final counter value: %d\n", counter)
}
```

**why this is bad**

1. **data race**: the statement `counter++` is not atomic. under the hood, it performs a read, an increment, and a write. when 1,000 goroutines do this simultaneously, they overwrite each other's work. if you run this program with `go run -race main.go`, it will immediately alert you of a data race, and the final printed number will almost certainly be less than 1,000.
2. **unreliable synchronisation**: using `time.Sleep` to wait for concurrent tasks is a major anti-pattern. if the machine is slow, 1 second might not be enough. if it's fast, we waste time waiting for a sleep timer.

---

## good practice: the idiomatic go way

now, let's write the same task using go's idiomatic concurrency primitives: `sync.WaitGroup` to coordinate lifecycles, and a **channel** to safely collect results by communicating.

we'll spin up a pool of workers to process jobs concurrently, passing data safely through channels.

```go
package main

import (
	"fmt"
	"sync"
)

// job represents the task to be processed
type job struct {
	id    int
	value int
}

// result represents the processed output
type result struct {
	jobID  int
	square int
}

// worker processes incoming jobs and communicates results back
func worker(id int, jobs <-chan job, results chan<- result, wg *sync.WaitGroup) {
	defer wg.Done() // signal completion when this worker is finished

	for j := range jobs {
		fmt.Printf("worker %d processing job %d\n", id, j.id)

		// calculate square (our "work")
		squaredVal := j.value * j.value

		// share the result by communicating through the channel
		results <- result{
			jobID:  j.id,
			square: squaredVal,
		}
	}
}

func main() {
	const numJobs = 5
	const numWorkers = 3

	// initialize channels for safe communication
	jobs := make(chan job, numJobs)
	results := make(chan result, numJobs)

	var wg sync.WaitGroup

	// 1. spin up a pool of workers
	for w := 1; w <= numWorkers; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	// 2. send jobs to the queue
	for i := 1; i <= numJobs; i++ {
		jobs <- job{id: i, value: i}
	}
	close(jobs) // closing tells workers no more jobs are coming

	// 3. orchestrate the cleanup in a separate thread
	go func() {
		wg.Wait()      // wait for all workers to finish
		close(results) // close the results channel once workers are done
	}()

	// 4. collect and print results safely as they arrive
	for res := range results {
		fmt.Printf("job %d completed. result: %d\n", res.jobID, res.square)
	}
}
```

**why this is correct**

1. **zero data races**: the jobs and results are passed by value through channels. there is no shared memory or variable that multiple goroutines can modify at the same time.
2. **proper coordination**: `sync.WaitGroup` ensures we wait exactly as long as necessary for all workers to complete, eliminating arbitrary sleep timers.
3. **clean termination**: closing the channels triggers the `for range` loops to terminate gracefully, avoiding goroutine leaks _(where threads stay active in the background forever)._

---

## key takeaways

- **goroutines are incredibly cheap**: they start at 2kb, are multiplexed onto physical threads, and are context-switched in user space.
- **channels are the glue**: they allow safe coordination and data transfer between goroutines without manual lock management.
- **always coordinate lifecycles**: use `sync.WaitGroup` or context cancellation to manage the lifecycle of your goroutines rather than guessing with sleeps.

by shifting our mindset from **locking shared memory** to **communicating over channels**, writing high-performance, concurrent backend systems in go becomes not only safer, but infinitely more enjoyable.

## credits / more info

- https://go.dev/doc/effective_go#concurrency
- https://go.dev/blog/codelab-share
- https://gobyexample.com/goroutines
