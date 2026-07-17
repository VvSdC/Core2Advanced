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

export function AnyUnknownAndNever() {
  return (
    <LessonArticle>
      <Definition term="any, unknown, and never">
        <p>
          <span className="font-mono text-sm text-web-400">any</span> turns the checker off for a
          value. <span className="font-mono text-sm text-web-400">unknown</span> means &quot;I do
          not know yet — force me to narrow.&quot;{' '}
          <span className="font-mono text-sm text-web-400">never</span> means &quot;this should be
          impossible&quot; — useful for exhaustiveness.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: <span className="text-web-400">any</span> is a unmarked mystery box you open
          recklessly; <span className="text-web-400">unknown</span> is a locked box you must
          inspect first; <span className="text-web-400">never</span> is an empty shelf that should
          never hold an item.
        </p>
      </Definition>

      <Callout variant="beginner" title="Escape hatches have a cost">
        Reaching for <span className="font-mono text-sm text-web-400">any</span> silences errors —
        including real bugs. Prefer <span className="font-mono text-sm text-web-400">unknown</span>{' '}
        at boundaries, then narrow.
      </Callout>

      <LessonSection title="Why avoid any">
        <Flowchart
          title="any disables the safety net"
          chart={`flowchart TB
  ANY[Value typed as any]
  ANY --> CALL[Call any method]
  ANY --> PASS[Pass anywhere]
  CALL --> RISK[Bugs hide until runtime]
  PASS --> RISK`}
        />
        <Example title="any hides mistakes">
{`function risky(data: any) {
  // No error — even if data is a number
  return data.toUpperCase();
}

// console.log(risky(42)); // Runtime crash
console.log(risky('ok')); // OK`}
        </Example>
        <CodeBlock title="any spreads like a virus">
{`let value: any = 'hello';
const maybeNumber: number = value; // allowed — dangerous
// later you treat maybeNumber as a number even if it was a string

value = 10;
console.log(value);`}
        </CodeBlock>
        <ContentStep number={1} title="When any still appears">
          <p className="text-slate-300">
            Legacy JS interop or quick prototypes. Treat it as temporary debt — replace with real
            types or <span className="font-mono text-sm text-web-400">unknown</span>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="unknown + narrowing">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-web-400">unknown</span> accepts any value, but
          you cannot use it until you prove what it is.
        </p>
        <Example title="Safe handling of unknown">
{`function toLabel(input: unknown): string {
  if (typeof input === 'string') {
    return input.toUpperCase();
  }
  if (typeof input === 'number') {
    return String(input);
  }
  return '(unsupported)';
}

console.log(toLabel('hi'));
console.log(toLabel(7));
console.log(toLabel(true));`}
        </Example>
        <CodeBlock title="JSON.parse returns any — wrap it">
{`function parseUser(json: string): { name: string } | null {
  const data: unknown = JSON.parse(json);

  if (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    typeof (data as { name: unknown }).name === 'string'
  ) {
    return { name: (data as { name: string }).name };
  }
  return null;
}

console.log(parseUser('{"name":"Ada"}'));
console.log(parseUser('{"age":1}'));`}
        </CodeBlock>
        <Callout variant="tip" title="Boundary rule again">
          APIs, forms, and storage → start as{' '}
          <span className="font-mono text-sm text-web-400">unknown</span>, validate, then work with
          a precise type.
        </Callout>
      </LessonSection>

      <LessonSection title="never for exhaustiveness">
        <p className="text-slate-300">
          After you handle every union member, the leftover type is{' '}
          <span className="font-mono text-sm text-web-400">never</span>. Assigning to a{' '}
          <span className="font-mono text-sm text-web-400">never</span> variable fails if a case was
          forgotten — a compile-time alarm.
        </p>
        <Example title="Exhaustive switch">
{`type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number };

function assertNever(x: never): never {
  throw new Error('Unexpected: ' + String(x));
}

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.size * shape.size;
    default:
      return assertNever(shape); // errors if a new kind is added but not handled
  }
}

console.log(area({ kind: 'square', size: 4 }));`}
        </Example>
        <CodeBlock title="never as a function return">
{`function crash(message: string): never {
  throw new Error(message);
}

// const x: number = crash('stop'); // OK for types — this line never assigns
console.log('unreachable after crash only if you call it');`}
        </CodeBlock>
        <Callout variant="info" title="You now have the TS starter kit">
          Types, shapes, functions, unions, narrowing, and careful use of{' '}
          <span className="font-mono text-sm text-web-400">any</span> /{' '}
          <span className="font-mono text-sm text-web-400">unknown</span> /{' '}
          <span className="font-mono text-sm text-web-400">never</span> — enough to write solid
          everyday TypeScript on top of your JS skills.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Avoid any — it disables checking and hides bugs.',
          'Prefer unknown for untrusted data, then narrow before use.',
          'never marks impossible paths and powers exhaustive switches.',
          'Use assertNever (or default: never) so new union members force updates.',
        ]}
      />
    </LessonArticle>
  )
}
