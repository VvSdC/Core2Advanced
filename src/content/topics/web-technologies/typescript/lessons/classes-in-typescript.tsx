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

export function ClassesInTypescript() {
  return (
    <LessonArticle>
      <Definition term="Classes in TypeScript">
        <p>
          TypeScript classes add <strong className="text-white">visibility</strong> (
          <span className="font-mono text-sm text-web-400">public</span> /{' '}
          <span className="font-mono text-sm text-web-400">private</span> /{' '}
          <span className="font-mono text-sm text-web-400">protected</span>),{' '}
          <span className="font-mono text-sm text-web-400">readonly</span>, parameter properties,
          and compile-time checks for <span className="font-mono text-sm text-web-400">implements</span>.
        </p>
        <p className="mt-2 text-slate-300">
          At runtime they are still JavaScript classes — types and visibility checks erase when
          you compile (except native <span className="font-mono text-sm text-web-400">#</span>{' '}
          private fields).
        </p>
      </Definition>

      <Callout variant="beginner" title="public is the default">
        If you write no modifier, the member is public — anyone can read and call it.
      </Callout>

      <LessonSection title="Visibility and readonly">
        <Flowchart
          title="Who can access?"
          chart={`flowchart TB
  A[public] --> B[Anywhere]
  C[protected] --> D[Class + subclasses]
  E[private] --> F[Only this class]`}
        />
        <CodeBlock title="Modifiers in action">
{`class BankAccount {
  readonly id: string;
  private balance: number;
  protected owner: string;

  constructor(id: string, owner: string, balance = 0) {
    this.id = id;
    this.owner = owner;
    this.balance = balance;
  }

  deposit(amount: number): number {
    this.balance += amount;
    return this.balance;
  }

  getBalance(): number {
    return this.balance;
  }
}

const a = new BankAccount("acc-1", "Ada", 100);
a.deposit(40);
// a.balance; // error — private
// a.id = "x"; // error — readonly`}
        </CodeBlock>
        <ContentStep number={1} title="readonly">
          <p className="text-slate-300">
            Set in the constructor (or at declaration); cannot reassign later.
          </p>
        </ContentStep>
        <ContentStep number={2} title="private vs #">
          <p className="text-slate-300">
            TypeScript <span className="font-mono text-sm text-web-400">private</span> is
            compile-time. JS <span className="font-mono text-sm text-web-400">#field</span> is
            runtime-enforced.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Parameter properties">
        <p className="text-slate-300">
          Declare and assign fields in one step inside the constructor parameter list.
        </p>
        <CodeBlock title="Short form">
{`class User {
  constructor(
    public readonly id: string,
    public name: string,
    private passwordHash: string
  ) {}

  display(): string {
    return this.name + " (" + this.id + ")";
  }
}

const u = new User("u1", "Ada", "hash…");
console.log(u.display());`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="implements, extends, abstract">
        <CodeBlock title="implements an interface">
{`interface Printable {
  print(): string;
}

class Invoice implements Printable {
  constructor(private total: number) {}

  print(): string {
    return "Total: $" + this.total;
  }
}`}
        </CodeBlock>
        <Example title="extends + protected">
{`class Animal {
  constructor(protected name: string) {}
  speak(): string {
    return this.name + " makes a sound";
  }
}

class Dog extends Animal {
  bark(): string {
    return this.name + " says woof"; // name is protected
  }
}

const d = new Dog("Rex");
console.log(d.bark());`}
        </Example>
        <CodeBlock title="abstract briefly">
{`abstract class Shape {
  abstract area(): number;

  describe(): string {
    return "area = " + this.area();
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

// new Shape(); // error — cannot instantiate abstract
const c = new Circle(2);
console.log(c.describe());`}
        </CodeBlock>
        <Callout variant="tip" title="Prefer composition">
          Interfaces + small classes beat deep abstract hierarchies for most app code.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>public / private / protected control who may use a member (at compile time).</>,
          <>readonly and parameter properties cut boilerplate.</>,
          <><span className="font-mono text-sm text-web-400">implements</span> checks a shape; <span className="font-mono text-sm text-web-400">extends</span> inherits.</>,
          <>abstract classes force subclasses to fill in required methods.</>,
        ]}
      />
    </LessonArticle>
  )
}
