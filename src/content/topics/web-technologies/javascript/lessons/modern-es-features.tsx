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

export function ModernEsFeatures() {
  return (
    <LessonArticle>
      <Definition term="Modern ES features">
        <p>
          Recent ECMAScript additions make everyday code safer and shorter:{' '}
          <strong className="text-white">optional chaining</strong>,{' '}
          <strong className="text-white">nullish coalescing</strong>, spread/rest, and expressive
          array methods like <span className="font-mono text-sm text-web-400">reduce</span>.
        </p>
        <p className="mt-2 text-slate-300">
          You do not need every feature — a handful appear in almost every modern codebase.
        </p>
      </Definition>

      <Callout variant="beginner" title="Readability first">
        Use these tools to clarify intent, not to golf the shortest line possible.
      </Callout>

      <LessonSection title="Optional chaining and nullish coalescing">
        <Flowchart
          title="Safe property access"
          chart={`flowchart LR
  A["user?.profile?.city"] --> B{Any nullish step?}
  B -->|yes| C[undefined]
  B -->|no| D[city value]`}
        />
        <CodeBlock title="?. and ??">
{`const user = { profile: { city: "Paris" } };
console.log(user?.profile?.city);     // "Paris"
console.log(user?.settings?.theme);   // undefined (no throw)

const theme = user.settings?.theme ?? "dark";
console.log(theme); // "dark"

// ?? only falls back for null/undefined — not for 0 or ""
const count = 0;
console.log(count || 10); // 10 (often surprising)
console.log(count ?? 10); // 0  (keeps zero)`}
        </CodeBlock>
        <Callout variant="tip" title="|| vs ??">
          Prefer <span className="font-mono text-sm text-web-400">??</span> when{' '}
          <span className="font-mono text-sm text-web-400">0</span>,{' '}
          <span className="font-mono text-sm text-web-400">false</span>, or{' '}
          <span className="font-mono text-sm text-web-400">&quot;&quot;</span> are valid values.
        </Callout>
      </LessonSection>

      <LessonSection title="Spread, rest, Object.assign">
        <CodeBlock title="Copy and merge">
{`const base = { a: 1, b: 2 };
const extra = { b: 9, c: 3 };

const copy = { ...base };                 // shallow copy
const merged = { ...base, ...extra };     // { a:1, b:9, c:3 }
const also = Object.assign({}, base, extra);

const nums = [1, 2, 3];
console.log([...nums, 4]);                // [1,2,3,4]
console.log(Math.max(...nums));           // 3`}
        </CodeBlock>
        <Example title="Rest parameters">
{`function sum(...parts) {
  return parts.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3, 4)); // 10

const [first, ...rest] = ["a", "b", "c"];
console.log(first, rest); // a, ["b","c"]`}
        </Example>
        <ContentStep number={1} title="Spread">
          <p className="text-slate-300">
            Expands iterables or object own enumerable props into a new list or object.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Rest">
          <p className="text-slate-300">
            Collects remaining args or elements into an array — opposite direction of spread.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Shallow only">
          <p className="text-slate-300">
            Nested objects are still shared references. Deep clones need structuredClone or careful
            libraries.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Array methods deeper — reduce">
        <CodeBlock title="reduce builds a single result">
{`const cart = [
  { name: "Book", price: 12 },
  { name: "Pen", price: 3 },
  { name: "Bag", price: 15 },
];

const total = cart.reduce((sum, item) => sum + item.price, 0);
console.log(total); // 30

const byName = cart.reduce((map, item) => {
  map[item.name] = item.price;
  return map;
}, {});
console.log(byName.Book); // 12`}
        </CodeBlock>
        <Example title="map / filter / find companions">
{`const prices = cart.map((i) => i.price);
const pricey = cart.filter((i) => i.price >= 10);
const pen = cart.find((i) => i.name === "Pen");`}
        </Example>
        <Callout variant="insight" title="Start with map/filter">
          Reach for <span className="font-mono text-sm text-web-400">reduce</span> when the output
          shape is not another array — totals, maps, grouped objects.
        </Callout>
        <CodeBlock title="Optional chaining with methods">
{`const api = { users: [{ name: "Ada" }] };
const name = api.users?.[0]?.name?.toUpperCase?.();
console.log(name); // ADA`}
        </CodeBlock>
        <Callout variant="tip" title="Destructuring cameo">
          Pair modern operators with destructuring for clear data access:{' '}
          <span className="font-mono text-sm text-web-400">
            {'const { city = "Unknown" } = user?.profile ?? {};'}
          </span>
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          '?. safely reads nested values; ?? supplies defaults for null/undefined.',
          'Spread/rest copy and collect; Object.assign merges into a target.',
          'Shallow copies do not deep-clone nested objects.',
          'reduce folds a list into one value — totals, indexes, groups.',
        ]}
      />
    </LessonArticle>
  )
}
