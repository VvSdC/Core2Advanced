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

export function ControlFlow() {
  return (
    <LessonArticle>
      <Definition term="Control flow">
        <p>
          <strong className="text-white">Control flow</strong> decides which lines run and how
          often: branch with <span className="font-mono text-sm text-web-400">if</span> /{' '}
          <span className="font-mono text-sm text-web-400">switch</span>, repeat with{' '}
          <span className="font-mono text-sm text-web-400">for</span> /{' '}
          <span className="font-mono text-sm text-web-400">while</span> /{' '}
          <span className="font-mono text-sm text-web-400">for...of</span>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a choose-your-own-adventure book — conditions pick the page, loops re-read a
          chapter until done (<span className="text-web-400">flow of control</span>).
        </p>
      </Definition>

      <Callout variant="beginner" title="Top to bottom — until it is not">
        Scripts still start at the top, but control flow lets you skip, choose, or repeat blocks
        of code on purpose.
      </Callout>

      <LessonSection title="if / else and switch">
        <Flowchart
          title="Branching"
          chart={`flowchart TB
  C{Condition?}
  C -->|true| T[Run if block]
  C -->|false| E[Run else / else-if]
  T --> N[Continue]
  E --> N`}
        />
        <Example
          title="if / else if / else"
          output={`warm`}
        >
{`const temp = 22;

if (temp >= 30) {
  console.log('hot');
} else if (temp >= 20) {
  console.log('warm');
} else {
  console.log('cool');
}`}
        </Example>
        <CodeBlock title="switch for discrete cases">
{`const day = 'Mon';

switch (day) {
  case 'Mon':
  case 'Tue':
  case 'Wed':
  case 'Thu':
  case 'Fri':
    console.log('weekday');
    break;
  case 'Sat':
  case 'Sun':
    console.log('weekend');
    break;
  default:
    console.log('unknown');
}`}
        </CodeBlock>
        <Callout variant="tip" title="break matters">
          Without <span className="font-mono text-sm text-web-400">break</span>, switch{' '}
          <strong className="text-white">falls through</strong> into the next case — sometimes
          useful, often a bug.
        </Callout>
      </LessonSection>

      <LessonSection title="for and while">
        <ContentStep number={1} title="for — counted loops">
          <p className="text-slate-300">
            Best when you know how many times to repeat (index from 0 to{' '}
            <span className="font-mono text-sm text-web-400">n - 1</span>).
          </p>
        </ContentStep>
        <Example title="Classic for" output={`0
1
2`}>
{`for (let i = 0; i < 3; i++) {
  console.log(i);
}`}
        </Example>
        <ContentStep number={2} title="while — until false">
          <p className="text-slate-300">
            Keep looping while a condition stays truthy. Ensure something inside moves toward
            stopping — or you loop forever.
          </p>
        </ContentStep>
        <CodeBlock title="while countdown">
{`let n = 3;
while (n > 0) {
  console.log(n);
  n -= 1;
}
console.log('lift off');`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="for...of — walk values">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-web-400">for...of</span> walks each value in an
          iterable (arrays, strings). Prefer it when you do not need the index.
        </p>
        <Example
          title="for...of over an array"
          output={`red
green
blue`}
        >
{`const colors = ['red', 'green', 'blue'];

for (const color of colors) {
  console.log(color);
}`}
        </Example>
        <CodeBlock title="for...of over a string">
{`for (const ch of 'JS') {
  console.log(ch); // "J" then "S"
}`}
        </CodeBlock>
        <Callout variant="info" title="for...in is different">
          <span className="font-mono text-sm text-web-400">for...in</span> walks{' '}
          <strong className="text-white">keys</strong> of an object. For arrays of values, stick
          with <span className="font-mono text-sm text-web-400">for...of</span>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'if/else and switch choose which branch runs.',
          'for and while repeat; always ensure a stopping condition.',
          'for...of walks values in arrays and other iterables.',
          'Remember break in switch to avoid accidental fall-through.',
        ]}
      />
    </LessonArticle>
  )
}
