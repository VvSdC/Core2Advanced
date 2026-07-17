import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ClassesAndOopStyle() {
  return (
    <LessonArticle>
      <Definition term="Classes">
        <p>
          A <span className="font-mono text-sm text-web-400">class</span> is a blueprint for
          creating objects with shared methods and per-instance data. The{' '}
          <span className="font-mono text-sm text-web-400">constructor</span> runs when you{' '}
          <span className="font-mono text-sm text-web-400">new</span> an instance.
        </p>
        <p className="mt-2 text-slate-300">
          JavaScript classes sit on prototypes — OOP style with friendlier syntax for methods,
          inheritance, and (optionally) private fields.
        </p>
      </Definition>

      <Callout variant="beginner" title="When classes help">
        Multiple objects sharing behavior (UI widgets, game entities, service clients) often read
        clearer as classes than as ad-hoc object literals.
      </Callout>

      <LessonSection title="class, constructor, methods">
        <Flowchart
          title="new ClassName()"
          chart={`flowchart LR
  A[new Dog] --> B[Create object]
  B --> C[Run constructor]
  C --> D[Link to Dog.prototype]
  D --> E[Return instance]`}
        />
        <CodeBlock title="A small class">
{`class BankAccount {
  constructor(owner, balance = 0) {
    this.owner = owner;
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
    return this.balance;
  }

  describe() {
    return this.owner + ": $" + this.balance;
  }
}

const a = new BankAccount("Ada", 100);
a.deposit(40);
console.log(a.describe()); // Ada: $140`}
        </CodeBlock>
        <ContentStep number={1} title="constructor">
          <p className="text-slate-300">
            Initialize instance fields. Called automatically by{' '}
            <span className="font-mono text-sm text-web-400">new</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="methods">
          <p className="text-slate-300">
            Functions on the prototype — shared by all instances, using{' '}
            <span className="font-mono text-sm text-web-400">this</span> for per-object data.
          </p>
        </ContentStep>
        <ContentStep number={3} title="static">
          <p className="text-slate-300">
            Belong to the class itself, not an instance — helpers and factories.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="static and inheritance">
        <CodeBlock title="static + extends">
{`class Vehicle {
  constructor(speed) {
    this.speed = speed;
  }
  static describeType() {
    return "Vehicle";
  }
}

class Bike extends Vehicle {
  ring() {
    console.log("ring ring at", this.speed);
  }
}

console.log(Vehicle.describeType());
const b = new Bike(12);
b.ring();`}
        </CodeBlock>
        <Example title="Factory with static">
{`class Color {
  constructor(hex) {
    this.hex = hex;
  }
  static fromRGB(r, g, b) {
    const hex =
      "#" +
      [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
    return new Color(hex);
  }
}

console.log(Color.fromRGB(255, 0, 128).hex);`}
        </Example>
      </LessonSection>

      <LessonSection title="Private fields # (briefly)">
        <p className="text-slate-300">
          Names starting with <span className="font-mono text-sm text-web-400">#</span> are truly
          private to the class body — outside code cannot read them.
        </p>
        <CodeBlock title="Encapsulated counter">
{`class Counter {
  #count = 0;

  next() {
    this.#count += 1;
    return this.#count;
  }

  get value() {
    return this.#count;
  }
}

const c = new Counter();
console.log(c.next(), c.value); // 1, 1
// console.log(c.#count); // SyntaxError outside the class`}
        </CodeBlock>
        <Callout variant="insight" title="OOP style, JS flavor">
          Prefer clear data and small methods over deep inheritance trees. Composition
          (&quot;has-a&quot;) often beats tall &quot;is-a&quot; hierarchies.
        </Callout>
        <Callout variant="tip" title="this in callbacks">
          Passing <span className="font-mono text-sm text-web-400">this.method</span> as a listener
          can lose <span className="font-mono text-sm text-web-400">this</span>. Use an arrow
          wrapper, <span className="font-mono text-sm text-web-400">bind</span>, or a class field
          arrow.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'class + constructor + methods define shared behavior for instances.',
          'static members hang on the class; use new for instances.',
          'extends inherits; private #fields hide internal state.',
          'Classes are sugar over prototypes — same runtime model underneath.',
        ]}
      />
    </LessonArticle>
  )
}
