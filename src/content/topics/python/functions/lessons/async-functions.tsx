import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function AsyncFunctions() {
  return (
    <LessonArticle>
      <Definition term="Async Functions">
        <p>
          An <code className="font-mono text-sm">async def</code> function defines a <strong className="text-white">coroutine</strong>.
          <code className="font-mono text-sm">await</code> suspends until an awaitable completes. This lesson focuses
          on the function layer — see Introduction → Async & asyncio for the event loop.
        </p>
      </Definition>

      <ContentStep number={1} title="Coroutine vs regular function">
        <Example
          title="Calling async def does not run it"
        >{`import asyncio

async def hello():
    return "hi"

coro = hello()          # coroutine object — not "hi"
result = asyncio.run(coro)
print(result)`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Async generators">
        <Example
          title="async for with async yield"
          caption="Requires async iteration in caller."
        >{`import asyncio

async def stream():
    for i in range(3):
        await asyncio.sleep(0.1)
        yield i

async def main():
    async for value in stream():
        print(value)

asyncio.run(main())`}</Example>
        <p>Combines generator laziness with async I/O — common in web frameworks and streaming APIs.</p>
      </ContentStep>

      <ContentStep number={3} title="Mixing sync and async — trap">
        <Callout variant="insight">
          Never call <code className="font-mono text-sm">time.sleep()</code> or blocking HTTP inside{' '}
          <code className="font-mono text-sm">async def</code> — it blocks the entire event loop. Use{' '}
          <code className="font-mono text-sm">await asyncio.sleep()</code> or run blocking code in{' '}
          <code className="font-mono text-sm">asyncio.to_thread()</code>.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'async def returns a coroutine — must be awaited or run via asyncio.',
          'async generators use async for / async yield.',
          'Do not block the event loop with sync I/O inside async code.',
          'Pairs with Introduction lesson on asyncio event loop.',
        ]}
      />
    </LessonArticle>
  )
}
