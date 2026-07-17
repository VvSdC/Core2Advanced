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

export function ErrorHandling() {
  return (
    <LessonArticle>
      <Definition term="Error handling">
        <p>
          When something goes wrong, JavaScript can <span className="font-mono text-sm text-web-400">throw</span>{' '}
          an error. <span className="font-mono text-sm text-web-400">try / catch / finally</span>{' '}
          lets you recover, log, or clean up instead of crashing the whole script.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: try the recipe; if the oven fails, catch the problem and decide whether to
          retry, alert the user, or stop — finally turn off the oven either way.
        </p>
      </Definition>

      <Callout variant="beginner" title="Goal">
        Fail loudly in development, fail gracefully for users, and never swallow errors silently
        without logging.
      </Callout>

      <LessonSection title="throw and try/catch/finally">
        <Flowchart
          title="Control flow"
          chart={`flowchart TB
  A[try block] -->|ok| B[continue]
  A -->|throw| C[catch]
  C --> D[handle / rethrow]
  A --> E[finally always]
  C --> E
  B --> E`}
        />
        <CodeBlock title="Basic pattern">
{`function parseAge(raw) {
  const n = Number(raw);
  if (Number.isNaN(n)) {
    throw new Error("Age must be a number");
  }
  if (n < 0) {
    throw new Error("Age cannot be negative");
  }
  return n;
}

try {
  const age = parseAge("twenty");
  console.log(age);
} catch (err) {
  console.error(err.message);
} finally {
  console.log("parse attempt finished");
}`}
        </CodeBlock>
        <ContentStep number={1} title="throw">
          <p className="text-slate-300">
            Stops normal flow and jumps to the nearest catch (or becomes an uncaught error).
          </p>
        </ContentStep>
        <ContentStep number={2} title="catch">
          <p className="text-slate-300">
            Receives the thrown value — usually an Error object with{' '}
            <span className="font-mono text-sm text-web-400">message</span> and{' '}
            <span className="font-mono text-sm text-web-400">stack</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="finally">
          <p className="text-slate-300">
            Runs whether you succeeded or failed — close resources, hide loaders, unlock buttons.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Error objects">
        <CodeBlock title="Built-in Error types">
{`throw new Error("Something went wrong");
throw new TypeError("Expected a string");
throw new RangeError("Index out of range");

try {
  JSON.parse("{bad");
} catch (err) {
  console.log(err.name);    // SyntaxError
  console.log(err.message);
  console.log(err.stack);   // where it happened
}`}
        </CodeBlock>
        <Example title="Custom error class">
{`class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

try {
  throw new ValidationError("Email required");
} catch (err) {
  if (err instanceof ValidationError) {
    console.log("Fix the form:", err.message);
  } else {
    throw err; // unknown — let it bubble
  }
}`}
        </Example>
        <Callout variant="tip" title="Rethrow unknowns">
          Catch what you can handle. If the error is unexpected,{' '}
          <span className="font-mono text-sm text-web-400">throw err</span> again so higher layers
          or tools can see it.
        </Callout>
      </LessonSection>

      <LessonSection title="Async errors">
        <CodeBlock title="Promises and async functions">
{`async function load() {
  try {
    const res = await fetch("/missing.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (err) {
    console.error("load failed", err);
    return null;
  }
}

Promise.reject(new Error("nope")).catch((err) => {
  console.error(err.message);
});`}
        </CodeBlock>
        <Callout variant="insight" title="Uncaught vs handled">
          An error with no catch crashes the current turn and logs in the console. Always decide
          who owns recovery: the function, the caller, or a global reporter.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'throw signals failure; try/catch handles it; finally cleans up.',
          'Prefer Error objects with clear messages over bare strings.',
          'instanceof and custom Error subclasses help branch on failure types.',
          'Async code needs catch on Promises or try/catch around await.',
        ]}
      />
    </LessonArticle>
  )
}
