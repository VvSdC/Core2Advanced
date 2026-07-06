import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function TheGil() {
  return (
    <LessonArticle>
      <Definition term="The GIL & Concurrency">
        <p>
          Modern computers have multiple CPU cores, so it seems natural to use{' '}
          <strong className="text-white">threads</strong> to do many things at once. In Python, threading works —
          but not the way most beginners expect.
        </p>
        <p>
          CPython has a mechanism called the <strong className="text-white">Global Interpreter Lock (GIL)</strong>.
          It is a lock that ensures only <em>one thread at a time</em> can execute Python code within a single
          process. Even if you create 8 threads on an 8-core machine, only one runs Python bytecode at any given
          moment.
        </p>
        <p>
          This lesson explains what the GIL is, why it exists, and what to use instead when you need real
          parallelism.
        </p>
      </Definition>

      <Callout variant="beginner" title="Thread vs process — what's the difference?">
        <p>
          <strong className="text-white">Thread:</strong> a lightweight worker inside your program. All threads
          share the same memory. Cheap to create.
        </p>
        <p className="mt-2">
          <strong className="text-white">Process:</strong> a separate instance of your program with its own memory.
          Heavier to create, but truly independent — each gets its own Python interpreter and its own GIL.
        </p>
      </Callout>

      <ContentStep number={1} title="The flow">
        <p>When multiple threads try to run Python code simultaneously, they queue up at the GIL:</p>
        <Flowchart
          title="Threads and the GIL"
          chart={`
flowchart TB
  T1["Thread 1"]
  T2["Thread 2"]
  T3["Thread 3"]
  GIL["GIL lock"]
  VM["One thread runs bytecode"]

  T1 --> T2
  T2 --> T3
  T3 --> GIL
  GIL --> VM

  style GIL fill:#1a2540,stroke:#f87171,color:#f8fafc
  style VM fill:#1a2540,stroke:#38bdf8,color:#f8fafc
        `}
        />
        <Callout variant="beginner">
          Analogy: imagine one microphone in a room. Three people (threads) want to speak (run Python code), but only
          the person holding the microphone can talk. They take turns passing it around. That microphone is the GIL.
        </Callout>
      </ContentStep>

      <ContentStep number={2} title="Walking through the flow">
        <StepSequence
          steps={[
            {
              title: 'Why does the GIL exist?',
              description: (
                <>
                  <p>
                    Python's reference counting updates memory on nearly every operation. If two threads modified
                    the same object's count simultaneously, memory could corrupt. The GIL prevents this by letting
                    only one thread run Python code at a time.
                  </p>
                  <p className="mt-2">
                    It also protects thousands of existing C extensions that were written assuming single-threaded
                    access. Removing the GIL is possible (Python 3.13+ experiments with this) but requires reworking
                    much of the ecosystem.
                  </p>
                </>
              ),
            },
            {
              title: 'What happens with CPU-bound work?',
              description: (
                <>
                  <p>
                    <strong className="text-white">CPU-bound</strong> means your code spends most of its time
                    computing (math, loops, data processing) — not waiting. Threads take turns on the GIL, so they
                    do <em>not</em> run in parallel on multiple cores. Eight threads doing heavy math on eight
                    cores will not be 8× faster. Often it is the same speed or slower.
                  </p>
                </>
              ),
            },
            {
              title: 'What happens with I/O-bound work?',
              description: (
                <>
                  <p>
                    <strong className="text-white">I/O-bound</strong> means your code spends time waiting — for a
                    website to respond, a file to read, a database query. While waiting, Python{' '}
                    <strong className="text-white">releases the GIL</strong>. Another thread can run during that
                    wait. This is why threads <em>do</em> help for downloading multiple files or handling many
                    network connections.
                  </p>
                </>
              ),
            },
            {
              title: 'The solution for CPU-bound parallelism',
              description: (
                <>
                  <p>
                    Use <code className="font-mono text-sm">multiprocessing</code> instead of{' '}
                    <code className="font-mono text-sm">threading</code>. Each process gets its own Python
                    interpreter and its own GIL, so they truly run on separate CPU cores simultaneously.
                  </p>
                </>
              ),
            },
            {
              title: 'asyncio — another option for I/O',
              description: (
                <>
                  <p>
                    <code className="font-mono text-sm">asyncio</code> runs many I/O tasks on a single thread using
                    an event loop. While one task waits for a network response, another runs — no thread switching
                    overhead. It does not help CPU-bound work, but it is great for handling thousands of concurrent
                    connections efficiently.
                  </p>
                </>
              ),
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={3} title="In practice">
        <p>Let us see the difference between CPU-bound and I/O-bound with real code patterns:</p>
        <Example
          title="CPU-bound: threading does NOT speed things up"
          caption="Both threads compete for the GIL. The total time is roughly the same as running one after the other — you pay extra overhead for thread switching."
        >{`import threading, time

def heavy_compute():
    total = 0
    for i in range(10_000_000):
        total += i
    return total

start = time.time()
t1 = threading.Thread(target=heavy_compute)
t2 = threading.Thread(target=heavy_compute)
t1.start(); t2.start()
t1.join(); t2.join()
print(f"Threads: {time.time() - start:.2f}s")
# Compare with running heavy_compute() twice sequentially`}</Example>
        <Example
          title="I/O-bound: threading DOES help"
          caption="While one thread waits for a network response, another thread can run. Total time drops because waiting overlaps."
        >{`import threading, urllib.request, time

def fetch(url):
    return urllib.request.urlopen(url, timeout=5).read()

urls = ["https://example.com"] * 5
start = time.time()
threads = [threading.Thread(target=fetch, args=(u,)) for u in urls]
for t in threads: t.start()
for t in threads: t.join()
print(f"5 fetches: {time.time() - start:.2f}s")`}</Example>
        <Example
          title="CPU-bound fix: use multiprocessing"
          output={`4 processes working in parallel
Each has its own GIL → real speedup on multi-core CPUs`}
          caption="multiprocessing spawns separate Python processes. Communication between them is slower than threads, but for heavy computation the parallelism wins."
        >{`from multiprocessing import Pool
import time

def square(n):
    return n * n

if __name__ == "__main__":
    start = time.time()
    with Pool(4) as pool:
        results = pool.map(square, range(5_000_000))
    print(f"Done in {time.time() - start:.2f}s")`}</Example>
        <Callout variant="beginner" title="Quick decision guide">
          <ul className="list-inside list-disc space-y-1">
            <li>
              <strong className="text-white">Waiting on network/files?</strong> → use{' '}
              <code className="font-mono text-sm">threading</code> or{' '}
              <code className="font-mono text-sm">asyncio</code>
            </li>
            <li>
              <strong className="text-white">Heavy math/loops?</strong> → use{' '}
              <code className="font-mono text-sm">multiprocessing</code> or a library like NumPy
            </li>
            <li>
              <strong className="text-white">Not sure?</strong> → start simple (no threads). Add concurrency only
              when you measure a bottleneck.
            </li>
          </ul>
        </Callout>
      </ContentStep>

      <Callout variant="insight">
        Python 3.13+ offers an experimental free-threaded build (nogil) that removes the GIL. It is not the default
        yet, and not all libraries support it. For now, assume the GIL exists and plan accordingly.
      </Callout>

      <KeyTakeaways
        items={[
          'The GIL lets only one thread execute Python bytecode at a time per process.',
          'It exists to protect reference counting and keep C extensions safe.',
          'Threads help I/O-bound work (network, files) because the GIL is released while waiting.',
          'CPU-bound work needs multiprocessing or specialized libraries for true parallelism.',
        ]}
      />
    </LessonArticle>
  )
}
