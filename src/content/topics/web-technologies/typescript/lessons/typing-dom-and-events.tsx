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

export function TypingDomAndEvents() {
  return (
    <LessonArticle>
      <Definition term="DOM types in TypeScript">
        <p>
          The DOM API is typed: elements are <span className="font-mono text-sm text-web-400">HTMLElement</span>{' '}
          (or more specific like <span className="font-mono text-sm text-web-400">HTMLInputElement</span>),
          and events are <span className="font-mono text-sm text-web-400">MouseEvent</span>,{' '}
          <span className="font-mono text-sm text-web-400">KeyboardEvent</span>, and friends.
        </p>
        <p className="mt-2 text-slate-300">
          TypeScript knows what properties exist — and warns when something might be{' '}
          <span className="font-mono text-sm text-web-400">null</span>.
        </p>
      </Definition>

      <Callout variant="beginner" title="null is real">
        <span className="font-mono text-sm text-web-400">querySelector</span> can return{' '}
        <span className="font-mono text-sm text-web-400">null</span>. Always check before use.
      </Callout>

      <LessonSection title="HTMLElement types">
        <Flowchart
          title="More specific = more fields"
          chart={`flowchart TB
  A[Element] --> B[HTMLElement]
  B --> C[HTMLInputElement]
  B --> D[HTMLButtonElement]
  B --> E[HTMLAnchorElement]`}
        />
        <CodeBlock title="Narrow the element type">
{`const el = document.getElementById("title");
// el: HTMLElement | null

if (el) {
  el.textContent = "Hello";
  el.classList.add("active");
}

const input = document.querySelector<HTMLInputElement>("#email");
if (input) {
  console.log(input.value); // value exists on HTMLInputElement
}`}
        </CodeBlock>
        <ContentStep number={1} title="Generic querySelector">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">querySelector&lt;HTMLInputElement&gt;(…)</span>{' '}
            tells TS the element kind — you still must handle{' '}
            <span className="font-mono text-sm text-web-400">null</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Assertions carefully">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">as HTMLInputElement</span> skips the
            null check in your head — only use when you are sure the node exists.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Event typing">
        <CodeBlock title="Mouse and keyboard events">
{`const btn = document.querySelector("button");

btn?.addEventListener("click", (event: MouseEvent) => {
  console.log(event.clientX, event.clientY);
  event.preventDefault();
});

window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    console.log("close dialog");
  }
});`}
        </CodeBlock>
        <Example title="Form submit">
{`const form = document.querySelector<HTMLFormElement>("#signup");

form?.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const data = new FormData(form);
  const email = String(data.get("email") ?? "");
  console.log(email);
});`}
        </Example>
        <Callout variant="tip" title="Inference often works">
          Inside <span className="font-mono text-sm text-web-400">addEventListener(&quot;click&quot;, …)</span>,
          TypeScript usually infers <span className="font-mono text-sm text-web-400">MouseEvent</span>{' '}
          for you — explicit annotations help when extracting handlers.
        </Callout>
        <CodeBlock title="Safe cast only when sure">
{`// Prefer null check
const box = document.getElementById("box");
if (!(box instanceof HTMLDivElement)) {
  throw new Error("#box missing or wrong tag");
}
box.style.padding = "8px";

// Assertion — only if you control the HTML
const force = document.getElementById("box") as HTMLDivElement;
force.style.margin = "4px";`}
        </CodeBlock>
        <ContentStep number={3} title="instanceof narrows">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">instanceof HTMLDivElement</span> is a
            runtime check and a type guard — safer than a bare assertion.
          </p>
        </ContentStep>
        <Example title="Change handler on an input">
{`const search = document.querySelector<HTMLInputElement>("#search");

search?.addEventListener("input", (event) => {
  const target = event.currentTarget;
  if (!(target instanceof HTMLInputElement)) return;
  console.log(target.value.trim());
});`}
        </Example>
        <Callout variant="insight" title="currentTarget vs target">
          Prefer <span className="font-mono text-sm text-web-400">currentTarget</span> when you
          attached the listener — it is the element you registered on. Narrow it before reading{' '}
          <span className="font-mono text-sm text-web-400">.value</span>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>DOM nodes are typed; prefer specific types like HTMLInputElement when needed.</>,
          <>querySelector may return null — check or use optional chaining.</>,
          <>Events have typed objects: MouseEvent, KeyboardEvent, SubmitEvent.</>,
          <>Generics help querySelector; assertions are a last resort when you know the truth.</>,
        ]}
      />
    </LessonArticle>
  )
}
