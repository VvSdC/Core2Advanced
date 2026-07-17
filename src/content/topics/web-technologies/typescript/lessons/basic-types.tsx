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

export function BasicTypes() {
  return (
    <LessonArticle>
      <Definition term="Basic types">
        <p>
          TypeScript names the familiar JS primitives —{' '}
          <strong className="text-white">string, number, boolean, null, undefined, bigint,
          symbol</strong> — and lets you annotate variables so the checker knows what belongs
          where.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: JS already had the ingredients; TS adds{' '}
          <span className="text-web-400">clear labels on the jars</span>.
        </p>
      </Definition>

      <Callout variant="beginner" title="You already know these values">
        Same runtime values as in the JS track. The new skill is telling TypeScript{' '}
        <em>which</em> value you intend — or letting it infer that for you.
      </Callout>

      <LessonSection title="The seven primitives">
        <Flowchart
          title="Primitive types in TypeScript"
          chart={`flowchart TB
  P[Primitives]
  P --> S[string]
  P --> N[number]
  P --> B[boolean]
  P --> NU[null]
  P --> U[undefined]
  P --> BI[bigint]
  P --> SY[symbol]`}
        />
        <Example title="Annotating each primitive">
{`const name: string = 'Ada';
const age: number = 36;
const active: boolean = true;
const empty: null = null;
const notSet: undefined = undefined;
const big: bigint = 9007199254740993n;
const id: symbol = Symbol('user');

console.log(name, age, active);
console.log(empty, notSet, big, id.description);`}
        </Example>
        <CodeBlock title="number covers integers and floats">
{`const count: number = 3;
const price: number = 9.99;
const weird: number = NaN; // still typed as number

console.log(count + price);`}
        </CodeBlock>
        <Callout variant="tip" title="null and undefined">
          With <span className="font-mono text-sm text-web-400">strict</span> on,{' '}
          <span className="font-mono text-sm text-web-400">null</span> and{' '}
          <span className="font-mono text-sm text-web-400">undefined</span> are not assignable to
          every type — that prevents many &quot;cannot read property of null&quot; bugs.
        </Callout>
      </LessonSection>

      <LessonSection title="Type annotations on variables">
        <p className="text-slate-300">
          Write the name, a colon, then the type:{' '}
          <span className="font-mono text-sm text-web-400">let x: number = 1</span>.
        </p>
        <ContentStep number={1} title="let and const">
          <p className="text-slate-300">
            Same rules as JS for reassignment. The type constrains what you may assign later.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Mismatch = error">
          <p className="text-slate-300">
            Assigning a string to a <span className="font-mono text-sm text-web-400">number</span>{' '}
            variable fails the type check — even if JS would have allowed it at runtime.
          </p>
        </ContentStep>
        <Example title="Annotation stops the wrong assignment">
{`let score: number = 10;
score = 20; // OK
// score = 'high'; // Error: Type 'string' is not assignable to type 'number'

let label: string = 'player';
label = label.toUpperCase();
console.log(score, label);`}
        </Example>
        <CodeBlock title="Union teaser for optional absence">
{`let nickname: string | null = null;
nickname = 'Ace';
console.log(nickname);`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Type inference — let the compiler help">
        <p className="text-slate-300">
          If you write <span className="font-mono text-sm text-web-400">let x = 1</span>, TypeScript
          infers <span className="font-mono text-sm text-web-400">number</span>. You do not need a
          colon on every line.
        </p>
        <Example title="Inference in action">
{`let x = 1;          // inferred: number
const greeting = 'hi'; // inferred: "hi" (literal) or string depending on context
let flag = false;   // inferred: boolean

// x = 'nope'; // Error — still typed as number
console.log(x, greeting, flag);`}
        </Example>
        <CodeBlock title="When annotations still help">
{`// Empty array — help TS know the element type
const scores: number[] = [];
scores.push(95);

// Function parameters — usually annotate these
function shout(msg: string): string {
  return msg.toUpperCase();
}

console.log(shout('go'), scores);`}
        </CodeBlock>
        <Callout variant="info" title="Practical habit">
          Annotate function inputs/outputs and public APIs. Let inference handle obvious locals
          like <span className="font-mono text-sm text-web-400">const n = 3</span>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'TS primitives match JS: string, number, boolean, null, undefined, bigint, symbol.',
          'Annotations look like let x: number = 1 and block wrong assignments.',
          'Inference often fills in types: let x = 1 is already a number.',
          'Prefer annotations on function boundaries; trust inference for clear locals.',
        ]}
      />
    </LessonArticle>
  )
}
