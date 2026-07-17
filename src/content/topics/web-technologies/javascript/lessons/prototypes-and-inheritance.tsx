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

export function PrototypesAndInheritance() {
  return (
    <LessonArticle>
      <Definition term="Prototype">
        <p>
          Almost every object in JavaScript has an internal link to another object called its{' '}
          <strong className="text-white">prototype</strong> (often written{' '}
          <span className="font-mono text-sm text-web-400">[[Prototype]]</span>). If a property is
          missing, the engine walks that link — the <strong className="text-white">prototype
          chain</strong>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: your notebook might say &quot;see the shared team handbook.&quot; Look locally
          first; if blank, follow the arrow to the handbook.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why care">
        Methods like <span className="font-mono text-sm text-web-400">array.push</span> live on
        shared prototypes so every array does not carry its own copy of{' '}
        <span className="font-mono text-sm text-web-400">push</span>.
      </Callout>

      <LessonSection title="The prototype chain">
        <Flowchart
          title="Property lookup"
          chart={`flowchart TB
  A[Read obj.x] --> B{Own property x?}
  B -->|yes| C[Use it]
  B -->|no| D[Follow [[Prototype]]]
  D --> E{Found on prototype?}
  E -->|yes| C
  E -->|no| F[Continue or undefined]`}
        />
        <CodeBlock title="See the link">
{`const animal = {
  eat() {
    console.log(this.name + " eats");
  },
};

const dog = Object.create(animal);
dog.name = "Rex";
dog.eat(); // Rex eats — found on prototype

console.log(Object.getPrototypeOf(dog) === animal); // true`}
        </CodeBlock>
        <ContentStep number={1} title="Own vs inherited">
          <p className="text-slate-300">
            Own properties sit on the object. Inherited ones are found by walking the chain.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Object.create">
          <p className="text-slate-300">
            Builds a new object with a chosen prototype — a clear way to see inheritance without
            classes.
          </p>
        </ContentStep>
        <Example title="Constructor functions (older style)">
{`function Person(name) {
  this.name = name;
}
Person.prototype.hello = function () {
  console.log("Hi, " + this.name);
};

const p = new Person("Ada");
p.hello(); // method lives on Person.prototype`}
        </Example>
      </LessonSection>

      <LessonSection title="class is syntactic sugar">
        <p className="text-slate-300">
          Modern <span className="font-mono text-sm text-web-400">class</span> syntax still uses
          prototypes under the hood. It is nicer spelling for the same linking idea.
        </p>
        <CodeBlock title="class and extends">
{`class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(this.name + " makes a sound");
  }
}

class Dog extends Animal {
  speak() {
    console.log(this.name + " barks");
  }
}

const rex = new Dog("Rex");
rex.speak(); // Rex barks
console.log(rex instanceof Dog);    // true
console.log(rex instanceof Animal); // true`}
        </CodeBlock>
        <Callout variant="insight" title="What extends wires up">
          <span className="font-mono text-sm text-web-400">Dog.prototype</span> links to{' '}
          <span className="font-mono text-sm text-web-400">Animal.prototype</span>. Instance methods
          are shared; instance fields from the constructor are per object.
        </Callout>
        <CodeBlock title="super calls the parent">
{`class Cat extends Animal {
  speak() {
    super.speak();
    console.log("(it was a meow)");
  }
}

new Cat("Miso").speak();`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Practical tips">
        <ContentStep number={1} title="Do not reinvent arrays">
          <p className="text-slate-300">
            Prefer composition and built-ins over deep custom prototype trees unless you need them.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Check prototypes carefully">
          <p className="text-slate-300">
            Use <span className="font-mono text-sm text-web-400">Object.getPrototypeOf</span> in
            learning/debug — avoid relying on the non-standard{' '}
            <span className="font-mono text-sm text-web-400">__proto__</span> in modern code.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Next step">
          Once this clicks, class fields, static methods, and private{' '}
          <span className="font-mono text-sm text-web-400">#</span> fields become easier — they still
          sit on top of this model.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Objects link to a prototype; missing properties walk the chain.',
          'Shared methods on prototypes keep memory lighter.',
          'class / extends is clearer syntax over the same prototype system.',
          'Object.create and instanceof help you see and test the links.',
        ]}
      />
    </LessonArticle>
  )
}
