import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function ContextManagers() {
  return (
    <LessonArticle>
      <Definition term="Context Managers">
        <p>
          A <strong className="text-white">context manager</strong> guarantees setup and teardown around a block of
          code — even when exceptions occur. The <code className="font-mono text-sm">with</code> statement calls{' '}
          <code className="font-mono text-sm">__enter__</code> at the start and <code className="font-mono text-sm">__exit__</code>{' '}
          at the end.
        </p>
        <p>
          Files, locks, database connections, and temporary state changes are the classic use cases. Interviewers
          ask what happens when an exception fires inside <code className="font-mono text-sm">with</code>.
        </p>
      </Definition>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="with statement lifecycle"
          chart={`
flowchart TB
  A["__enter__()"]
  B["Run with block"]
  C{"Exception?"}
  D["__exit__(exc_type, exc, tb)"]
  E["Propagate or suppress"]

  A --> B
  B --> C
  C --> D
  D --> E
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="with open() — the classic">
        <Example
          title="File always closes"
          output={`hello`}
        >{`with open("data.txt", "w") as f:
    f.write("hello")
# f closed here — even if write raised an error`}</Example>
        <p>
          Without <code className="font-mono text-sm">with</code>, you need try/finally to close. Context managers
          encode that pattern once.
        </p>
      </ContentStep>

      <ContentStep number={3} title="Writing your own — class-based">
        <Example
          title="__enter__ and __exit__"
          output={`Entering
Inside block
Exiting`}

        >{`class Timer:
    def __enter__(self):
        print("Entering")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        print("Exiting")
        return False  # do not suppress exceptions

with Timer():
    print("Inside block")`}</Example>
        <Callout variant="info">
          Returning <code className="font-mono text-sm">True</code> from <code className="font-mono text-sm">__exit__</code>{' '}
          suppresses the exception. Rare — use deliberately.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="contextlib — generator style">
        <Example
          title="@contextmanager decorator"
          output={`setup
work
teardown`}
        >{`from contextlib import contextmanager

@contextmanager
def managed_resource():
    print("setup")
    try:
        yield "resource"
    finally:
        print("teardown")

with managed_resource() as r:
    print("work")`}</Example>
        <p>
          Code before <code className="font-mono text-sm">yield</code> is <code className="font-mono text-sm">__enter__</code>;
          the <code className="font-mono text-sm">finally</code> block is <code className="font-mono text-sm">__exit__</code>.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'with guarantees cleanup via __enter__ / __exit__.',
          'Exceptions inside with still trigger __exit__ — finally-like behavior.',
          'Use contextlib.contextmanager for simple generator-based managers.',
          'Files, locks, and DB connections should almost always use with.',
        ]}
      />
    </LessonArticle>
  )
}
