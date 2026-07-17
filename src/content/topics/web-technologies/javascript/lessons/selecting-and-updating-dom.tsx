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

export function SelectingAndUpdatingDom() {
  return (
    <LessonArticle>
      <Definition term="Selecting and updating">
        <p>
          To change the page you first <strong className="text-white">select</strong> a node, then{' '}
          <strong className="text-white">update</strong> its text, classes, attributes, or children.
        </p>
        <p className="mt-2 text-slate-300">
          Think: find the light switch, then flip it — not wander the whole house hoping something
          changes.
        </p>
      </Definition>

      <Callout variant="beginner" title="Core muscle memory">
        Almost every UI script starts with{' '}
        <span className="font-mono text-sm text-web-400">querySelector</span> or{' '}
        <span className="font-mono text-sm text-web-400">getElementById</span>, then a property write.
      </Callout>

      <LessonSection title="Finding elements">
        <Flowchart
          title="Select → change → paint"
          chart={`flowchart LR
  A[CSS/ID selector] --> B[Element reference]
  B --> C[Update text/class/DOM]
  C --> D[Browser paints]`}
        />
        <CodeBlock title="querySelector and getElementById">
{`const byId = document.getElementById("status");
const firstBtn = document.querySelector("button.primary");
const allItems = document.querySelectorAll("ul.todo li");

console.log(byId, firstBtn, allItems.length);`}
        </CodeBlock>
        <ContentStep number={1} title="getElementById">
          <p className="text-slate-300">
            Fast and clear when the element has a unique{' '}
            <span className="font-mono text-sm text-web-400">id</span>. Returns{' '}
            <span className="font-mono text-sm text-web-400">null</span> if missing — always check.
          </p>
        </ContentStep>
        <ContentStep number={2} title="querySelector">
          <p className="text-slate-300">
            Uses CSS selectors:{' '}
            <span className="font-mono text-sm text-web-400">.class</span>,{' '}
            <span className="font-mono text-sm text-web-400">#id</span>,{' '}
            <span className="font-mono text-sm text-web-400">div &gt; span</span>. Returns the first
            match (or null).
          </p>
        </ContentStep>
        <ContentStep number={3} title="querySelectorAll">
          <p className="text-slate-300">
            Returns a static NodeList. Loop with{' '}
            <span className="font-mono text-sm text-web-400">forEach</span> or convert with{' '}
            <span className="font-mono text-sm text-web-400">[...list]</span>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="textContent vs innerHTML">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-web-400">textContent</span> sets plain text.
          <span className="font-mono text-sm text-web-400"> innerHTML</span> parses HTML strings —
          powerful, but unsafe with untrusted input.
        </p>
        <CodeBlock title="Prefer textContent for user-facing strings">
{`const label = document.querySelector("#msg");
label.textContent = "Saved!";           // safe plain text

// Dangerous if 'name' comes from a user:
// label.innerHTML = "<b>" + name + "</b>";

const safe = document.createElement("b");
safe.textContent = name;                // still escaped as text
label.replaceChildren(safe);`}
        </CodeBlock>
        <Callout variant="insight" title="XSS caution">
          Never pipe raw user input into{' '}
          <span className="font-mono text-sm text-web-400">innerHTML</span>. Attackers can inject
          scripts. Prefer text APIs or carefully sanitized libraries.
        </Callout>
      </LessonSection>

      <LessonSection title="Classes, create, append">
        <CodeBlock title="classList helpers">
{`const card = document.querySelector(".card");
card.classList.add("is-open");
card.classList.remove("is-hidden");
card.classList.toggle("is-active");
console.log(card.classList.contains("is-open")); // true`}
        </CodeBlock>
        <Example title="Build a list item in JS">
{`const list = document.querySelector("#todos");
const li = document.createElement("li");
li.textContent = "Learn DOM updates";
li.classList.add("todo-item");
list.append(li);          // modern
// list.appendChild(li);  // older, still fine`}
        </Example>
        <ContentStep number={1} title="createElement">
          <p className="text-slate-300">
            Makes a new element that is not on the page yet until you insert it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="append / prepend">
          <p className="text-slate-300">
            Attach nodes (or strings) at the end or start of a parent. Prefer these over building
            giant HTML strings.
          </p>
        </ContentStep>
        <CodeBlock title="Small interactive update">
{`const input = document.querySelector("#title");
const out = document.querySelector("#preview");

function syncPreview() {
  out.textContent = input.value.trim() || "(empty)";
}

syncPreview();
input.addEventListener("input", syncPreview);`}
        </CodeBlock>
        <Callout variant="tip" title="Null checks">
          If a selector fails, calling methods on{' '}
          <span className="font-mono text-sm text-web-400">null</span> throws. Guard with{' '}
          <span className="font-mono text-sm text-web-400">if (!el) return;</span> while learning.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Select with getElementById, querySelector, or querySelectorAll.',
          'Use textContent for plain text; treat innerHTML as a careful tool.',
          'classList toggles styles without rewriting className strings.',
          'createElement + append builds UI nodes without HTML string soup.',
        ]}
      />
    </LessonArticle>
  )
}
