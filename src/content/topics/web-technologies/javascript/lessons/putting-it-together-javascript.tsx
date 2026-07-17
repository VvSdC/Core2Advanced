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

export function PuttingItTogetherJavascript() {
  return (
    <LessonArticle>
      <Definition term="JavaScript mastery map">
        <p>
          You now connect four layers: <strong className="text-white">language</strong> (scope,
          this, prototypes, classes) → <strong className="text-white">DOM</strong> (select, update,
          events) → <strong className="text-white">closures</strong> (remembered state) →{' '}
          <strong className="text-white">async</strong> (callbacks, Promises, fetch).
        </p>
        <p className="mt-2 text-slate-300">
          This lesson is a final mental model — a small interactive page that uses all four.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to use this page">
        Skim the map. Anything fuzzy → revisit that lesson and retype one code sample from memory.
      </Callout>

      <LessonSection title="Mastery map">
        <Flowchart
          title="Language → DOM → closures → async"
          chart={`flowchart TB
  A[Language: scope this prototypes] --> B[DOM: query update events]
  B --> C[Closures: handlers + private state]
  C --> D[Async: promises await fetch]
  D --> E[Interactive page]`}
        />
        <ContentStep number={1} title="Language">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>let/const scopes; lexical lookup</li>
            <li>
              <span className="font-mono text-sm text-web-400">this</span> by call site; arrows
              inherit
            </li>
            <li>Prototypes and class sugar</li>
          </ul>
        </ContentStep>
        <ContentStep number={2} title="DOM">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>
              <span className="font-mono text-sm text-web-400">querySelector</span>, textContent,
              classList
            </li>
            <li>addEventListener + delegation</li>
            <li>createElement / append for dynamic UI</li>
          </ul>
        </ContentStep>
        <ContentStep number={3} title="Closures">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>Handlers close over setup variables</li>
            <li>Factories hide counters and config</li>
          </ul>
        </ContentStep>
        <ContentStep number={4} title="Async">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>Promises + async/await + try/catch</li>
            <li>
              <span className="font-mono text-sm text-web-400">fetch</span> +{' '}
              <span className="font-mono text-sm text-web-400">JSON</span>
            </li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Mini mental model: note board">
        <p className="text-slate-300">
          Imagine a page: an input, an Add button, a list, and a Load button that pulls sample
          notes from an API. One parent listener deletes items. A small module holds state.
        </p>
        <CodeBlock title="Sketch you could type in a single HTML file">
{`function createNotesApp(root) {
  let notes = []; // closed-over state

  const list = root.querySelector("[data-list]");
  const input = root.querySelector("[data-input]");

  function render() {
    list.replaceChildren(
      ...notes.map((text, index) => {
        const li = document.createElement("li");
        li.textContent = text;
        li.dataset.index = String(index);
        const btn = document.createElement("button");
        btn.textContent = "×";
        btn.dataset.action = "delete";
        li.append(" ", btn);
        return li;
      })
    );
  }

  root.addEventListener("click", (event) => {
    const t = event.target;
    if (t.matches("[data-action='add']")) {
      const value = input.value.trim();
      if (!value) return;
      notes.push(value);
      input.value = "";
      render();
    }
    if (t.matches("[data-action='delete']")) {
      const index = Number(t.closest("li").dataset.index);
      notes.splice(index, 1);
      render();
    }
  });

  async function loadRemote() {
    try {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=3"
      );
      if (!res.ok) throw new Error("HTTP " + res.status);
      const rows = await res.json();
      notes = rows.map((r) => r.title);
      render();
    } catch (err) {
      console.error(err);
    }
  }

  root.querySelector("[data-action='load']")
    ?.addEventListener("click", () => loadRemote());

  render();
}

createNotesApp(document.querySelector("#app"));`}
        </CodeBlock>
        <Example title="What each part practiced">
{`closure     → notes array private to createNotesApp
DOM         → query, createElement, replaceChildren
delegation  → one click listener for add/delete
async       → fetch + await + try/catch
JSON        → res.json() into plain objects`}
        </Example>
        <Callout variant="insight" title="Frameworks reuse these ideas">
          React and friends still select concepts (components), update trees, close over state, and
          fetch async data — with different APIs on top of the same browser platform.
        </Callout>
      </LessonSection>

      <LessonSection title="You are ready when…">
        <Callout variant="tip" title="Self-check">
          You can explain the DOM tree, wire events with delegation, sketch a closure counter,
          chain a Promise or async function, and fetch JSON without freezing the UI.
        </Callout>
        <Callout variant="info" title="Next: TypeScript / React">
          TypeScript adds types on top of this JavaScript. React builds UIs with components and
          state — your DOM and async mental models transfer directly.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Path: language → DOM → closures → async → interactive pages.</>,
          <>Select and update the DOM; delegate events on stable parents.</>,
          <>Closures keep state for handlers and factories.</>,
          <>async/await + fetch load remote JSON safely with try/catch.</>,
          <>Next up: TypeScript for safety, React for component UIs.</>,
        ]}
      />
    </LessonArticle>
  )
}
