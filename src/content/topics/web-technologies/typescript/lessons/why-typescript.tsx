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

export function WhyTypescript() {
  return (
    <LessonArticle>
      <Definition term="Why TypeScript">
        <p>
          Teams adopt TypeScript to <strong className="text-white">catch bugs earlier</strong>, get{' '}
          <strong className="text-white">better editor help</strong>, and{' '}
          <strong className="text-white">refactor with confidence</strong> — especially as codebases
          grow beyond a few files.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a spell-checker will not write your essay, but it{' '}
          <span className="text-web-400">flags typos before you publish</span>. Types do that for
          shape-of-data mistakes.
        </p>
      </Definition>

      <Callout variant="beginner" title="The pain TypeScript targets">
        In plain JS,{' '}
        <span className="font-mono text-sm text-web-400">user.name.toUpperCase()</span> crashes at
        runtime if <span className="font-mono text-sm text-web-400">name</span> is missing. TS can
        warn you while you type.
      </Callout>

      <LessonSection title="Catch bugs before runtime">
        <Flowchart
          title="When the mistake is found"
          chart={`flowchart TB
  JS[Plain JS — bug found when user clicks]
  TS[TypeScript — bug found in editor or build]
  JS --> LATE[Late: production / QA]
  TS --> EARLY[Early: while coding]`}
        />
        <Example title="A classic silent-until-runtime mistake">
{`// Without types — looks fine until it runs
function getLength(value) {
  return value.length;
}

getLength('hello'); // 5
getLength(42);      // Runtime error: value.length is undefined

// With TypeScript
function getLengthTs(value: string): number {
  return value.length;
}

getLengthTs('hello'); // OK
// getLengthTs(42);  // Error at compile time`}
        </Example>
        <CodeBlock title="Wrong property name — caught early">
{`type User = { id: number; email: string };

function printEmail(user: User) {
  console.log(user.email);
}

const me = { id: 1, email: 'a@b.com' };
printEmail(me);

// printEmail({ id: 1, mail: 'a@b.com' });
// Error: 'mail' does not exist — did you mean 'email'?`}
        </CodeBlock>
        <ContentStep number={1} title="Wrong types">
          <p className="text-slate-300">
            Passing a number where a string is expected fails the type check, not the user&apos;s
            session.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Missing fields">
          <p className="text-slate-300">
            Objects that omit required properties are flagged before they reach production.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Better autocomplete and refactoring">
        <p className="text-slate-300">
          When the editor knows a value is a{' '}
          <span className="font-mono text-sm text-web-400">User</span>, it suggests{' '}
          <span className="font-mono text-sm text-web-400">email</span> and{' '}
          <span className="font-mono text-sm text-web-400">id</span> — not random guesses. Renaming a
          property can update every usage safely.
        </p>
        <CodeBlock title="Editor knows what comes next">
{`type Product = {
  title: string;
  price: number;
  inStock: boolean;
};

function format(product: Product): string {
  // After typing "product." your IDE lists title, price, inStock
  return product.title + ' — $' + product.price;
}

console.log(format({ title: 'Mug', price: 12, inStock: true }));`}
        </CodeBlock>
        <Callout variant="tip" title="Refactoring confidence">
          Changing a function&apos;s return type lights up every call site that breaks. That is the
          opposite of &quot;hope nothing else used this.&quot;
        </Callout>
        <Example title="Rename-friendly structure">
{`type CartItem = { sku: string; qty: number };

function totalQty(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

const cart: CartItem[] = [
  { sku: 'A1', qty: 2 },
  { sku: 'B2', qty: 1 },
];
console.log(totalQty(cart)); // 3`}
        </Example>
      </LessonSection>

      <LessonSection title="When plain JavaScript is still fine">
        <p className="text-slate-300">
          TypeScript is a tool, not a religion. Small scripts, quick experiments, and one-off
          console snippets often stay as JS — less setup, same runtime behavior.
        </p>
        <ContentStep number={1} title="Tiny throwaways">
          <p className="text-slate-300">
            A 10-line Node one-liner or a browser console experiment does not need a{' '}
            <span className="font-mono text-sm text-web-400">tsconfig</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Learning JS itself">
          <p className="text-slate-300">
            When you are still learning language basics, plain JS keeps the mental load lower —
            then add types once the ideas click.
          </p>
        </ContentStep>
        <Callout variant="info" title="Rule of thumb">
          Prefer TypeScript when the code will live, be shared, or grow. Prefer JS when speed of
          exploration matters more than long-term structure.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Types catch many bugs in the editor or build — before runtime.',
          'Autocomplete and safe renames get better when shapes are known.',
          'Refactoring is safer: broken call sites show up immediately.',
          'Plain JS is still fine for tiny scripts and quick experiments.',
        ]}
      />
    </LessonArticle>
  )
}
