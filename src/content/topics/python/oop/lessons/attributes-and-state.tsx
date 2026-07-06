import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function AttributesAndState() {
  return (
    <LessonArticle>
      <Definition term="Attributes & State">
        <p>
          An object's <strong className="text-white">state</strong> is the collection of its current attribute
          values — name, health, balance, whatever it remembers.{' '}
          <strong className="text-white">Instance attributes</strong> belong to one object.{' '}
          <strong className="text-white">Class attributes</strong> are shared by all instances of the class.
        </p>
      </Definition>

      <ContentStep number={1} title="Instance attributes — each object has its own">
        <Example
          title="Separate state per player"
          output={`Ada: 100 HP
Bob: 60 HP`}
        >{`class Player:
    def __init__(self, name, health):
        self.name = name
        self.health = health

ada = Player("Ada", 100)
bob = Player("Bob", 100)

bob.health -= 40
print(f"{ada.name}: {ada.health} HP")
print(f"{bob.name}: {bob.health} HP")`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Class attributes — shared across instances">
        <Example
          title="species shared by all dogs"
          output={`Buddy is a Dog
Max is a Dog`}
          caption="species lives on the class. All instances read the same value unless shadowed on an instance."
        >{`class Dog:
    species = "Canis familiaris"

    def __init__(self, name):
        self.name = name

buddy = Dog("Buddy")
max = Dog("Max")
print(f"{buddy.name} is a {buddy.species}")
print(f"{max.name} is a {max.species}")`}</Example>
        <Callout variant="beginner" title="The mutable class attribute trap">
          If a class attribute is a mutable object (like a list), all instances share that{' '}
          <em>same list</em> unless each instance gets its own in <code className="font-mono text-sm">__init__</code>.
          This is a common beginner bug — similar to mutable default arguments.
        </Callout>
        <Example
          title="Dangerous shared list"
          output={`[1]
[1]`}
        >{`class Team:
    members = []   # shared!

    def add(self, name):
        self.members.append(name)

a = Team()
b = Team()
a.add("Ada")
print(a.members)
print(b.members)   # surprise — b sees Ada too`}</Example>
        <Example
          title="Fix: create list in __init__"
        >{`class Team:
    def __init__(self):
        self.members = []   # per instance`}</Example>
      </ContentStep>

      <ContentStep number={3} title="Reading and updating state">
        <StepSequence
          steps={[
            {
              title: 'Dot notation',
              description: 'obj.attr reads; obj.attr = value writes on that instance.',
            },
            {
              title: 'Methods change state',
              description: 'Good OOP updates state through methods (deposit, take_damage) rather than raw attribute writes from outside.',
            },
            {
              title: 'hasattr and getattr',
              description: 'hasattr(obj, "x") checks existence; getattr(obj, "x", default) reads safely.',
            },
          ]}
        />
      </ContentStep>

      <KeyTakeaways
        items={[
          'Instance attributes (self.x) are unique per object.',
          'Class attributes are shared — be careful with mutable defaults.',
          'Initialize mutable data in __init__, not on the class body.',
          'Object state = all its attribute values at a moment in time.',
        ]}
      />
    </LessonArticle>
  )
}
