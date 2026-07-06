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

export function ClassesAndObjects() {
  return (
    <LessonArticle>
      <Definition term="Classes & Objects">
        <p>
          A <strong className="text-white">class</strong> is a blueprint — it describes what attributes and
          methods every instance will have. An <strong className="text-white">object</strong> (also called an{' '}
          <strong className="text-white">instance</strong>) is one real thing built from that blueprint.
        </p>
        <p>
          Analogy: <code className="font-mono text-sm">class Car</code> is the design on paper. The red Toyota in
          your driveway is an object. You can build many cars from one design.
        </p>
      </Definition>

      <Callout variant="beginner" title="Words to remember">
        <ul className="list-inside list-disc space-y-1">
          <li><strong className="text-white">Class</strong> — the template (defined once with <code className="font-mono text-sm">class</code>)</li>
          <li><strong className="text-white">Object / instance</strong> — one actual thing (created with <code className="font-mono text-sm">ClassName()</code>)</li>
          <li><strong className="text-white">Instantiate</strong> — to create an object from a class</li>
        </ul>
      </Callout>

      <ContentStep number={1} title="The flow">
        <Flowchart
          title="From class to object"
          chart={`
flowchart TB
  A["Write class Dog"]
  B["Define attributes and methods"]
  C["Call Dog()"]
  D["Python creates object"]
  E["Use the object"]

  A --> B
  B --> C
  C --> D
  D --> E
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Your first class">
        <Example
          title="A minimal Dog class"
          output={`Buddy says Woof!
<class 'Dog'>`}
          caption="We create an object with Dog(). type() confirms it is a Dog instance."
        >{`class Dog:
    pass   # empty for now — still a valid class

buddy = Dog()
print(type(buddy))`}</Example>
        <p>
          <code className="font-mono text-sm">class Dog:</code> starts the definition. The indented body holds
          attributes and methods. <code className="font-mono text-sm">pass</code> means "nothing here yet."
        </p>
      </ContentStep>

      <ContentStep number={3} title="Adding attributes after creation">
        <p>Python lets you attach attributes to objects dynamically:</p>
        <Example
          title="Attributes on instances"
          output={`Buddy is 3 years old`}
        >{`class Dog:
    pass

buddy = Dog()
buddy.name = "Buddy"
buddy.age = 3

print(f"{buddy.name} is {buddy.age} years old")`}</Example>
        <Callout variant="beginner">
          This works, but we will soon learn <code className="font-mono text-sm">__init__</code> to set attributes
          properly when the object is created — so every Dog is born with a name and age.
        </Callout>
      </ContentStep>

      <ContentStep number={4} title="Multiple objects from one class">
        <Example
          title="Two separate objects"
          output={`Buddy
Max`}
          caption="buddy and max are different objects in memory. Changing one does not affect the other."
        >{`class Dog:
    pass

buddy = Dog()
max = Dog()

buddy.name = "Buddy"
max.name = "Max"

print(buddy.name)
print(max.name)
print(buddy is max)   # False`}</Example>
        <StepSequence
          steps={[
            {
              title: 'One class, many objects',
              description: 'Dog is defined once. Each call to Dog() creates a fresh, independent object.',
            },
            {
              title: 'Each object has its own attributes',
              description: 'buddy.name and max.name are stored separately — even though both are Dog instances.',
            },
            {
              title: 'Classes are objects too',
              description: 'In Python, the class Dog is itself an object (of type type). You will see more of this in the Object Model lesson.',
            },
          ]}
        />
      </ContentStep>

      <KeyTakeaways
        items={[
          'class defines a blueprint; ClassName() creates an instance.',
          'Each object is independent — its own attributes in memory.',
          'Attributes are accessed with dot notation: obj.attribute.',
          'Next lesson: __init__ to initialize objects properly at birth.',
        ]}
      />
    </LessonArticle>
  )
}
