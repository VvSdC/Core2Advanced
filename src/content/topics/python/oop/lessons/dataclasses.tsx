import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
} from '../../../../../components/content'

export function Dataclasses() {
  return (
    <LessonArticle>
      <Definition term="@dataclass">
        <p>
          <code className="font-mono text-sm">@dataclass</code> auto-generates <code className="font-mono text-sm">__init__</code>,{' '}
          <code className="font-mono text-sm">__repr__</code>, <code className="font-mono text-sm">__eq__</code>, and more from
          annotated fields — reducing boilerplate for data-holding classes.
        </p>
      </Definition>

      <ContentStep number={1} title="Basic dataclass">
        <Example
          title="Boilerplate gone"
          output={`Point(x=3, y=4)
True`}
        >{`from dataclasses import dataclass

@dataclass
class Point:
    x: float
    y: float

p = Point(3, 4)
q = Point(3, 4)
print(p)
print(p == q)`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Defaults and field()">
        <Example
          title="Mutable defaults need default_factory"
        >{`from dataclasses import dataclass, field

@dataclass
class Team:
    name: str
    members: list = field(default_factory=list)

t = Team("Alpha")
t.members.append("Ada")`}</Example>
        <Callout variant="insight">
          Same trap as mutable function defaults — never use <code className="font-mono text-sm">members: list = []</code>.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="frozen and slots">
        <Example
          title="Immutable dataclass"
        >{`@dataclass(frozen=True)
class Config:
    host: str
    port: int

# c.port = 8080  # FrozenInstanceError`}</Example>
        <p><code className="font-mono text-sm">frozen=True</code> makes instances hashable (if all fields hashable).</p>
      </ContentStep>

      <ContentStep number={4} title="Interview comparison">
        <ul className="space-y-2 text-slate-300">
          <li><strong className="text-white">vs namedtuple:</strong> dataclass is mutable by default, supports defaults, methods.</li>
          <li><strong className="text-white">vs plain class:</strong> less boilerplate, built-in repr/eq.</li>
          <li><strong className="text-white">vs dict:</strong> typed fields, attribute access, IDE support.</li>
        </ul>
      </ContentStep>

      <KeyTakeaways
        items={[
          '@dataclass generates __init__, __repr__, __eq__ from annotations.',
          'Use field(default_factory=list) for mutable defaults.',
          'frozen=True for immutable, hashable records.',
          'Common interview answer for "how to reduce class boilerplate".',
        ]}
      />
    </LessonArticle>
  )
}
