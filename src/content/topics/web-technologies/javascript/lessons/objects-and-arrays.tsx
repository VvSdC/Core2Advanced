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

export function ObjectsAndArrays() {
  return (
    <LessonArticle>
      <Definition term="Objects and arrays">
        <p>
          An <strong className="text-white">object</strong> stores named properties (keys →
          values). An <strong className="text-white">array</strong> stores an ordered list of
          values with numeric indexes.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: an object is a labeled locker; an array is a{' '}
          <span className="text-web-400">numbered shelf</span> of boxes.
        </p>
      </Definition>

      <Callout variant="beginner" title="Everyday data">
        Almost every app is objects and arrays: a user profile (object), a todo list (array of
        objects).
      </Callout>

      <LessonSection title="Object literals and property access">
        <Example
          title="Create and read"
          output={`Ada
42
Ada`}
        >
{`const user = {
  name: 'Ada',
  score: 42,
};

console.log(user.name);     // dot access
console.log(user['score']); // bracket access
console.log(user['name']);`}
        </Example>
        <CodeBlock title="Add, update, nest">
{`const book = { title: 'JS Basics' };
book.pages = 120;           // add
book.title = 'JS Core';     // update

const cart = {
  item: { id: 1, name: 'Mug' },
  qty: 2,
};
console.log(cart.item.name); // Mug`}
        </CodeBlock>
        <Flowchart
          title="Object vs array"
          chart={`flowchart TB
  D{Named fields or ordered list?}
  D -->|Named| O[Object — keys]
  D -->|Ordered| A[Array — indexes 0..n]`}
        />
      </LessonSection>

      <LessonSection title="Arrays and map / filter / find">
        <ContentStep number={1} title="Basics">
          <p className="text-slate-300">
            Indexes start at <span className="font-mono text-sm text-web-400">0</span>. Use{' '}
            <span className="font-mono text-sm text-web-400">.length</span> for count.
          </p>
        </ContentStep>
        <Example
          title="Array essentials"
          output={`red
3
green
blue`}
        >
{`const colors = ['red', 'green', 'blue'];
console.log(colors[0]);
console.log(colors.length);

colors.push('yellow'); // add at end
console.log(colors[1]);
console.log(colors[2]);`}
        </Example>
        <CodeBlock title="map, filter, find (intro)">
{`const nums = [1, 2, 3, 4, 5];

const doubled = nums.map((n) => n * 2);
// [2, 4, 6, 8, 10]

const evens = nums.filter((n) => n % 2 === 0);
// [2, 4]

const firstBig = nums.find((n) => n > 3);
// 4

console.log(doubled, evens, firstBig);`}
        </CodeBlock>
        <Callout variant="tip" title="Mental model">
          <span className="font-mono text-sm text-web-400">map</span> transforms each item,{' '}
          <span className="font-mono text-sm text-web-400">filter</span> keeps some,{' '}
          <span className="font-mono text-sm text-web-400">find</span> returns the first match (or{' '}
          <span className="font-mono text-sm text-web-400">undefined</span>).
        </Callout>
      </LessonSection>

      <LessonSection title="Destructuring basics">
        <p className="text-slate-300">
          <strong className="text-white">Destructuring</strong> unpacks values from objects or
          arrays into variables in one line.
        </p>
        <Example
          title="Object and array destructuring"
          output={`Ada
London
first=1
second=2`}
        >
{`const user = { name: 'Ada', city: 'London' };
const { name, city } = user;
console.log(name);
console.log(city);

const pair = [1, 2, 3];
const [first, second] = pair;
console.log('first=' + first);
console.log('second=' + second);`}
        </Example>
        <CodeBlock title="Rename while destructuring">
{`const product = { id: 7, title: 'Mug' };
const { title: productName } = product;
console.log(productName); // Mug`}
        </CodeBlock>
        <Callout variant="info" title="Practice tip">
          Start with reading properties, then rewrite one access using destructuring — same
          result, cleaner unpacking.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Objects map string keys to values; use dot or bracket access.',
          'Arrays are ordered lists; indexes start at 0.',
          'map / filter / find are everyday tools for transforming lists.',
          'Destructuring unpacks object fields or array slots into variables.',
        ]}
      />
    </LessonArticle>
  )
}
