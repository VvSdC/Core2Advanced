import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Multiprocessing() {
  return (
    <LessonArticle>
      <Definition term="Multiprocessing">
        <p>
          The <strong className="text-white">multiprocessing</strong> module spawns separate OS processes — each
          with its own Python interpreter and GIL. This is how you achieve true{' '}
          <strong className="text-white">CPU-bound parallelism</strong> in CPython.
        </p>
        <p>
          Complements the GIL lesson: threads share one GIL; processes do not.
        </p>
      </Definition>

      <ContentStep number={1} title="Process vs thread — recap">
        <Callout variant="info">
          Threads share memory → fast communication, GIL limits CPU work. Processes have separate memory → need
          IPC (queues, pipes) but scale across cores.
        </Callout>
      </ContentStep>

      <ContentStep number={2} title="ProcessPoolExecutor">
        <Example
          title="Parallel CPU work"
          caption="Simplified pattern — guard with if __name__ == '__main__' on Windows."
        >{`from concurrent.futures import ProcessPoolExecutor

def square(n):
    return n * n

if __name__ == "__main__":
    with ProcessPoolExecutor() as pool:
        results = list(pool.map(square, range(5)))
    print(results)`}</Example>
      </ContentStep>

      <ContentStep number={3} title="When to choose what">
        <ul className="space-y-2 text-slate-300">
          <li><strong className="text-white">I/O-bound, many connections:</strong> asyncio or threading.</li>
          <li><strong className="text-white">CPU-bound, heavy computation:</strong> multiprocessing or ProcessPoolExecutor.</li>
          <li><strong className="text-white">Mixed workloads:</strong> often asyncio + process pool for CPU chunks.</li>
        </ul>
      </ContentStep>

      <ContentStep number={4} title="Interview pitfalls">
        <Callout variant="insight">
          Pickling overhead — child processes must pickle arguments. Large data → use shared memory or pass
          file paths. On Windows, spawn requires <code className="font-mono text-sm">if __name__ == &quot;__main__&quot;</code>{' '}
          guard or infinite respawn loops occur.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'multiprocessing bypasses the GIL — one interpreter per process.',
          'Use ProcessPoolExecutor for parallel CPU-bound map-style work.',
          'Processes do not share memory — use Queue, Pipe, or shared state carefully.',
          'Pair with asyncio lesson: I/O async, CPU multiprocess.',
        ]}
      />
    </LessonArticle>
  )
}
