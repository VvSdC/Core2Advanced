import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Slots() {
  return (
    <LessonArticle>
      <Definition term="__slots__">
        <p>
          By default, instances store attributes in a per-object <code className="font-mono text-sm">__dict__</code>.
          <code className="font-mono text-sm">__slots__</code> fixes allowed attribute names and can reduce memory
          by eliminating <code className="font-mono text-sm">__dict__</code> per instance.
        </p>
      </Definition>

      <ContentStep number={1} title="Declaring slots">
        <Example
          title="Only listed attributes allowed"
        >{`class Point:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(1, 2)
# p.z = 3  # AttributeError`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Memory benefit">
        <p>
          Millions of small objects (e.g. graph nodes) benefit from slots — no per-instance dict overhead. Trade-off:
          cannot add arbitrary attributes dynamically.
        </p>
        <Callout variant="info">
          Interview: slots do not make attribute access faster in a meaningful way on modern CPython — memory is the
          main reason.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="Inheritance with slots">
        <p>
          Child classes need their own <code className="font-mono text-sm">__slots__</code> — parent slots are
          inherited but child attrs must be declared. Multiple inheritance with conflicting slots is painful — avoid.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          '__slots__ restricts attributes and can save memory.',
          'No __dict__ unless you include "__dict__" in slots.',
          'Cannot add undeclared attributes — less flexible.',
          'Use for many homogeneous small objects, not general classes.',
        ]}
      />
    </LessonArticle>
  )
}
