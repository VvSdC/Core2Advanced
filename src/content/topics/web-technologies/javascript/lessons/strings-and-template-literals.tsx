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

export function StringsAndTemplateLiterals() {
  return (
    <LessonArticle>
      <Definition term="Strings">
        <p>
          A <strong className="text-white">string</strong> is text data — wrapped in single quotes,
          double quotes, or backticks. Template literals (backticks) let you embed expressions
          with <span className="font-mono text-sm text-web-400">${'{'}...{'}'}</span>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a string is a necklace of characters; template literals are necklaces with{' '}
          <span className="text-web-400">charm slots</span> you fill at runtime.
        </p>
      </Definition>

      <Callout variant="beginner" title="Quotes">
        <span className="font-mono text-sm text-web-400">&apos;hi&apos;</span>,{' '}
        <span className="font-mono text-sm text-web-400">&quot;hi&quot;</span>, and{' '}
        <span className="font-mono text-sm text-web-400">`hi`</span> are all strings. Prefer
        backticks when you need interpolation or multi-line text.
      </Callout>

      <LessonSection title="Common string methods">
        <Flowchart
          title="String pipeline idea"
          chart={`flowchart TB
  S[Raw string]
  S --> T[trim / toLowerCase]
  T --> C[includes / startsWith]
  C --> R[slice / replace / split]`}
        />
        <Example
          title="Length, case, trim"
          output={`5
hello
HI
hello`}
        >
{`const raw = '  Hello  ';
console.log('Hello'.length);
console.log('Hello'.toLowerCase());
console.log('hi'.toUpperCase());
console.log(raw.trim()); // "Hello"`}
        </Example>
        <CodeBlock title="Search, slice, replace, split">
{`const msg = 'JavaScript rocks';

console.log(msg.includes('Script')); // true
console.log(msg.startsWith('Java')); // true
console.log(msg.slice(0, 4));        // "Java"
console.log(msg.replace('rocks', 'rules'));

const parts = 'a,b,c'.split(',');
console.log(parts); // ["a", "b", "c"]
console.log(parts.join('-')); // "a-b-c"`}
        </CodeBlock>
        <ContentStep number={1} title="Strings are immutable">
          <p className="text-slate-300">
            Methods return <strong className="text-white">new</strong> strings. The original stays
            unchanged unless you reassign.
          </p>
        </ContentStep>
        <Example title="Immutability" output={`Hello
HELLO`}>
{`let word = 'Hello';
word.toUpperCase();      // returns "HELLO" but discarded
console.log(word);       // Hello
word = word.toUpperCase();
console.log(word);       // HELLO`}
        </Example>
      </LessonSection>

      <LessonSection title="Template literals">
        <p className="text-slate-300">
          Use backticks and <span className="font-mono text-sm text-web-400">${'{'}expression{'}'}</span>{' '}
          to build strings without messy{' '}
          <span className="font-mono text-sm text-web-400">+</span> concatenation.
        </p>
        <Example
          title="Interpolation"
          output={`Hi, Ada — score 42
Line 1
Line 2`}
        >
{`const name = 'Ada';
const score = 42;

const line = \`Hi, \${name} — score \${score}\`;
console.log(line);

const block = \`Line 1
Line 2\`;
console.log(block);`}
        </Example>
        <CodeBlock title="Expressions inside ${}">
{`const a = 3;
const b = 4;
console.log(\`Sum is \${a + b}\`);           // Sum is 7
console.log(\`Status: \${a > 0 ? 'ok' : 'no'}\`);`}
        </CodeBlock>
        <Callout variant="tip" title="When to use backticks">
          Dynamic messages, HTML snippets in small demos, multi-line text. For simple fixed
          labels, regular quotes are fine.
        </Callout>
        <Callout variant="info" title="Escape note">
          Inside a normal string you can use{' '}
          <span className="font-mono text-sm text-web-400">\\n</span> for a newline. Template
          literals can contain real line breaks instead.
        </Callout>
        <Example title="Old + vs template" output={`Ada has 3 points
Ada has 3 points`}>
{`const name = 'Ada';
const pts = 3;
console.log(name + ' has ' + pts + ' points');
console.log(\`\${name} has \${pts} points\`);`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Strings hold text; common methods: trim, includes, slice, split, replace.',
          'String methods return new strings — originals do not mutate.',
          'Template literals use backticks and ${} for clean interpolation.',
          'Prefer templates over + when building dynamic messages.',
        ]}
      />
    </LessonArticle>
  )
}
