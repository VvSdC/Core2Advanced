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

export function FetchAndJson() {
  return (
    <LessonArticle>
      <Definition term="fetch and JSON">
        <p>
          The browser <span className="font-mono text-sm text-web-400">fetch</span> API requests
          resources over the network and returns a Promise. <strong className="text-white">JSON</strong>{' '}
          is a text format for structured data; JavaScript converts with{' '}
          <span className="font-mono text-sm text-web-400">JSON.parse</span> and{' '}
          <span className="font-mono text-sm text-web-400">JSON.stringify</span>.
        </p>
        <p className="mt-2 text-slate-300">
          Most modern APIs speak JSON. fetch + JSON is how frontends load remote data.
        </p>
      </Definition>

      <Callout variant="beginner" title="Two layers">
        Network: get bytes from a URL. Data: turn JSON text into objects you can use in JS.
      </Callout>

      <LessonSection title="JSON.parse and JSON.stringify">
        <CodeBlock title="Round-trip a plain object">
{`const user = { name: "Ada", roles: ["admin"] };

const text = JSON.stringify(user);
console.log(text); // '{"name":"Ada","roles":["admin"]}'

const back = JSON.parse(text);
console.log(back.name); // Ada

// Pretty print for debugging:
console.log(JSON.stringify(user, null, 2));`}
        </CodeBlock>
        <Example title="What JSON cannot store directly">
{`undefined, functions, Symbols → dropped or nullified
Dates → become strings (unless you revive them)
Maps/Sets → need custom conversion`}
        </Example>
        <Callout variant="tip" title="Validate carefully">
          <span className="font-mono text-sm text-web-400">JSON.parse</span> throws on invalid
          text. Wrap in try/catch when the string might be corrupt.
        </Callout>
      </LessonSection>

      <LessonSection title="fetch basics (GET)">
        <Flowchart
          title="Typical GET flow"
          chart={`flowchart LR
  A[fetch url] --> B[Response]
  B --> C[check ok]
  C --> D["response.json()"]
  D --> E[use data]`}
        />
        <CodeBlock title="Simple GET with async/await">
{`async function loadTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");

  if (!response.ok) {
    throw new Error("HTTP " + response.status);
  }

  const data = await response.json(); // parses JSON body
  console.log(data.title);
  return data;
}

loadTodos().catch((err) => console.error(err));`}
        </CodeBlock>
        <ContentStep number={1} title="fetch returns Response">
          <p className="text-slate-300">
            Headers, status, and body streams live on the Response. A 404 still resolves the
            Promise — check <span className="font-mono text-sm text-web-400">response.ok</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="response.json()">
          <p className="text-slate-300">
            Reads the body and parses JSON into a JS value. Also a Promise — await it.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Errors">
          <p className="text-slate-300">
            Network failures reject. HTTP error statuses need your own{' '}
            <span className="font-mono text-sm text-web-400">ok</span> check.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="POST sketch and headers">
        <CodeBlock title="Send JSON to an API">
{`async function createNote(text) {
  const response = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) throw new Error("Save failed");
  return response.json();
}`}
        </CodeBlock>
        <Callout variant="insight" title="CORS note">
          Browsers block some cross-origin responses unless the server allows your origin. Failed
          demos are often CORS or wrong URL — not your JSON skills.
        </Callout>
        <Example title="parse vs response.json">
{`// Manual:
const text = await response.text();
const data = JSON.parse(text);

// Same idea, built-in:
const data2 = await response.json();`}
        </Example>
        <Callout variant="tip" title="Practice drill">
          Open DevTools → Network. Run a fetch in the Console, inspect the Response tab, then log
          the parsed JSON. Seeing bytes become objects locks the idea in.
        </Callout>
        <CodeBlock title="Abort a slow request (optional peek)">
{`const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 2000);

try {
  const res = await fetch("/api/slow", { signal: controller.signal });
  console.log(await res.json());
} catch (err) {
  console.error("aborted or failed", err.name);
} finally {
  clearTimeout(timeout);
}`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          'JSON.stringify turns objects into text; JSON.parse reverses it.',
          'fetch(url) returns a Promise for a Response.',
          'Check response.ok, then await response.json() for JSON APIs.',
          'HTTP errors do not auto-reject — you must handle status codes.',
        ]}
      />
    </LessonArticle>
  )
}
