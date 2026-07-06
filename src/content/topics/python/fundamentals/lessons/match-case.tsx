import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function MatchCase() {
  return (
    <LessonArticle>
      <Definition term="match / case">
        <p>
          Python 3.10+ adds <strong className="text-white">structural pattern matching</strong> with{' '}
          <code className="font-mono text-sm">match</code> / <code className="font-mono text-sm">case</code> — like
          switch on steroids. It matches values, types, and unpacks structures.
        </p>
      </Definition>

      <ContentStep number={1} title="Basic match">
        <Example
          title="Replace long if/elif chains"
          output={`two
many`}
        >{`def describe(n):
    match n:
        case 0:
            return "zero"
        case 1:
            return "one"
        case 2:
            return "two"
        case _:
            return "many"

print(describe(2))
print(describe(99))`}</Example>
        <p><code className="font-mono text-sm">case _:</code> is the wildcard — like default.</p>
      </ContentStep>

      <ContentStep number={2} title="Matching structures">
        <Example
          title="Unpack dicts and tuples"
          output={`Point at (3, 4)
Error: disk full`}
        >{`def handle(event):
    match event:
        case {"type": "click", "x": x, "y": y}:
            return f"Click at ({x}, {y})"
        case ("point", x, y):
            return f"Point at ({x}, {y})"
        case {"type": "error", "msg": msg}:
            return f"Error: {msg}"
        case _:
            return "unknown"

print(handle(("point", 3, 4)))
print(handle({"type": "error", "msg": "disk full"}))`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Guards and OR patterns">
        <Example
          title="case with if guard"
        >{`match value:
    case n if n < 0:
        print("negative")
    case 0 | 1 | 2:
        print("small")
    case _:
        print("other")`}</Example>
        <Callout variant="info">
          Interview note: match uses <em>structural</em> matching, not just equality. Order matters — first match wins.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'match/case (3.10+) replaces verbose if/elif for value dispatch.',
          'case _ is the default wildcard.',
          'Patterns can unpack dicts, tuples, and use guards (if).',
          'First matching case wins — order carefully.',
        ]}
      />
    </LessonArticle>
  )
}
