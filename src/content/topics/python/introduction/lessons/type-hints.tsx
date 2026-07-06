import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function TypeHints() {
  return (
    <LessonArticle>
      <Definition term="Type Hints & typing">
        <p>
          <strong className="text-white">Type hints</strong> annotate what types functions expect and return. They
          are <em>not enforced at runtime</em> by default — tools like mypy, pyright, and IDEs use them for static
          analysis.
        </p>
        <p>
          Since Python 3.9+, use built-in generics (<code className="font-mono text-sm">list[str]</code>) instead
          of <code className="font-mono text-sm">List[str]</code> from typing when possible.
        </p>
      </Definition>

      <ContentStep number={1} title="Basic annotations">
        <Example
          title="Parameters and return types"
        >{`def greet(name: str) -> str:
    return f"Hello, {name}"

def total(prices: list[float]) -> float:
    return sum(prices)

age: int = 30
name: str | None = None   # Python 3.10+ union syntax`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Common typing constructs">
        <Example
          title="Optional, Union, Callable"
        >{`from typing import Optional, Callable

def find_user(user_id: int) -> Optional[dict]:
    ...

def apply(fn: Callable[[int, int], int], a: int, b: int) -> int:
    return fn(a, b)`}</Example>
        <p>
          <code className="font-mono text-sm">Optional[X]</code> means <code className="font-mono text-sm">X | None</code>.
          Use for values that may be missing.
        </p>
      </ContentStep>

      <ContentStep number={3} title="TypedDict, Protocol, Generic">
        <Example
          title="Structured hints for interviews"
        >{`from typing import TypedDict, Protocol, TypeVar

class UserDict(TypedDict):
    name: str
    age: int

class Drawable(Protocol):
    def draw(self) -> None: ...

T = TypeVar("T")

def first(items: list[T]) -> T:
    return items[0]`}</Example>
        <Callout variant="info">
          <code className="font-mono text-sm">Protocol</code> enables structural subtyping — duck typing with type
          checker support. Common in modern Python APIs.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="Interview notes">
        <ul className="space-y-2 text-slate-300">
          <li>Type hints do not slow production code meaningfully — they are stored in <code className="font-mono text-sm">__annotations__</code>.</li>
          <li>Runtime checking exists via third-party tools or <code className="font-mono text-sm">@dataclass</code> — not built-in enforcement.</li>
          <li>Use <code className="font-mono text-sm">from __future__ import annotations</code> to postpone evaluation (strings) in older codebases.</li>
        </ul>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Type hints document intent; static checkers enforce them.',
          'Use list[str], dict[str, int], str | None in modern Python.',
          'Optional, Callable, Protocol, TypeVar cover most interview cases.',
          'Hints are not runtime validation unless you add a checker.',
        ]}
      />
    </LessonArticle>
  )
}
