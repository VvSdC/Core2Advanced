import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function AsyncAndAsyncio() {
  return (
    <LessonArticle>
      <Definition term="Async & asyncio">
        <p>
          <strong className="text-white">async/await</strong> enables cooperative concurrency for{' '}
          <strong className="text-white">I/O-bound</strong> work — network calls, disk, waiting on APIs. One thread
          runs many tasks by switching when a task awaits.
        </p>
        <p>
          It does <em>not</em> parallelize CPU-bound math across cores. For that, use multiprocessing (next lesson)
          or release the GIL in C extensions.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="Event loop"
          chart={`
flowchart TB
  A["async def coroutine"]
  B["await I/O"]
  C["Event loop schedules other tasks"]
  D["Resume when I/O done"]

  A --> B
  B --> C
  C --> D
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="async def and await">
        <Example
          title="Coroutine basics"
          caption="Conceptual — run with asyncio.run(main()) in a script."
        >{`import asyncio

async def fetch_data():
  await asyncio.sleep(1)   # yields control — not blocking sleep
  return {"status": "ok"}

async def main():
  result = await fetch_data()
  print(result)

asyncio.run(main())`}</Example>
        <p>
          Calling <code className="font-mono text-sm">fetch_data()</code> returns a coroutine object — it does not
          run until awaited or passed to the event loop.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Running tasks concurrently">
        <Example
          title="asyncio.gather"
          caption="Three I/O waits overlap — total time ~1s not 3s."
        >{`import asyncio

async def work(n):
  await asyncio.sleep(1)
  return n

async def main():
  results = await asyncio.gather(work(1), work(2), work(3))
  print(results)

asyncio.run(main())`}</Example>
      </ContentStep>

      <ContentStep number={4} title="Async vs threads vs processes">
        <Callout variant="insight">
          <strong className="text-white">asyncio:</strong> single-threaded, great for many I/O waits, low overhead.
          <br />
          <strong className="text-white">threading:</strong> OS threads, GIL limits CPU parallelism, OK for I/O with blocking libraries.
          <br />
          <strong className="text-white">multiprocessing:</strong> separate processes, true CPU parallelism, higher overhead.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'async/await is cooperative concurrency on one thread.',
          'await yields control — use for I/O-bound, not CPU-bound work.',
          'asyncio.run() starts the event loop; gather() runs tasks concurrently.',
          'Do not mix blocking calls (time.sleep, requests) inside async without threads.',
        ]}
      />
    </LessonArticle>
  )
}
