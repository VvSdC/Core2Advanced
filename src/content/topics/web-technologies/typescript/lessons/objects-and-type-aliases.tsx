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

export function ObjectsAndTypeAliases() {
  return (
    <LessonArticle>
      <Definition term="Objects and type aliases">
        <p>
          You describe an object&apos;s <strong className="text-white">shape</strong> with property
          names and types. A <strong className="text-white">type alias</strong> gives that shape a
          reusable name with the <span className="font-mono text-sm text-web-400">type</span>{' '}
          keyword.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a blueprint for a house form — rooms labeled{' '}
          <span className="text-web-400">kitchen, bedroom</span> — reused for every house you
          build.
        </p>
      </Definition>

      <Callout variant="beginner" title="Same curly braces as JS">
        Objects still use curly braces and key/value pairs like in JavaScript. TypeScript only
        adds a description of which keys and value kinds are allowed.
      </Callout>

      <LessonSection title="Object type annotations">
        <Flowchart
          title="Value must match the shape"
          chart={`flowchart TB
  SHAPE[Type: name string, age number]
  VAL[Object value]
  OK[Assign if shapes match]
  BAD[Error if property missing or wrong type]
  SHAPE --> OK
  VAL --> OK
  VAL --> BAD`}
        />
        <Example title="Inline object type">
{`const user: { name: string; age: number } = {
  name: 'Sam',
  age: 28,
};

console.log(user.name);
// user.age = '28'; // Error
// user.city = 'Pune'; // Error — property does not exist`}
        </Example>
        <CodeBlock title="Nested objects">
{`const order: {
  id: number;
  item: { title: string; price: number };
} = {
  id: 101,
  item: { title: 'Notebook', price: 4.5 },
};

console.log(order.item.title);`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Type aliases — name the shape once">
        <p className="text-slate-300">
          Inline types get noisy. Alias them:{' '}
          <span className="font-mono text-sm text-web-400">type User = {'{'} ... {'}'}</span>.
        </p>
        <Example title="Reusable User type">
{`type User = {
  name: string;
  age: number;
};

const a: User = { name: 'Ada', age: 36 };
const b: User = { name: 'Lin', age: 22 };

function greet(user: User): string {
  return 'Hi, ' + user.name;
}

console.log(greet(a), greet(b));`}
        </Example>
        <CodeBlock title="Aliases for unions and primitives too">
{`type ID = string | number;
type Mode = 'light' | 'dark';

const userId: ID = 'u_42';
const theme: Mode = 'dark';
console.log(userId, theme);`}
        </CodeBlock>
        <ContentStep number={1} title="One source of truth">
          <p className="text-slate-300">
            Change the alias once; every function that uses{' '}
            <span className="font-mono text-sm text-web-400">User</span> updates together.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Optional properties and readonly">
        <p className="text-slate-300">
          Mark a property optional with{' '}
          <span className="font-mono text-sm text-web-400">?</span>. Mark it{' '}
          <span className="font-mono text-sm text-web-400">readonly</span> so callers cannot
          reassign it after creation.
        </p>
        <Example title="Optional ?">
{`type Profile = {
  username: string;
  bio?: string; // may be missing
};

const p1: Profile = { username: 'neo' };
const p2: Profile = { username: 'trinity', bio: 'hacker' };

function showBio(p: Profile) {
  console.log(p.bio ?? '(no bio)');
}

showBio(p1);
showBio(p2);`}
        </Example>
        <CodeBlock title="readonly properties">
{`type Config = {
  readonly apiUrl: string;
  retries: number;
};

const config: Config = {
  apiUrl: 'https://api.example.com',
  retries: 3,
};

config.retries = 5; // OK
// config.apiUrl = 'https://evil.com'; // Error — readonly

console.log(config);`}
        </CodeBlock>
        <Callout variant="tip" title="Optional vs undefined">
          With strict settings,{' '}
          <span className="font-mono text-sm text-web-400">bio?: string</span> means the key may be
          absent. Reading it may yield{' '}
          <span className="font-mono text-sm text-web-400">undefined</span> — handle that before
          using string methods.
        </Callout>
        <Callout variant="info" title="Next up">
          <span className="font-mono text-sm text-web-400">interface</span> is another way to name
          object shapes — often preferred for public object APIs and class contracts.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Object types list property names and value types.',
          'type aliases reuse shapes (and unions) under a clear name.',
          'Optional properties use ?: they may be missing.',
          'readonly blocks reassignment after the object is created.',
        ]}
      />
    </LessonArticle>
  )
}
