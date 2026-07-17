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

export function WhatIsTheDom() {
  return (
    <LessonArticle>
      <Definition term="DOM">
        <p>
          The <strong className="text-white">Document Object Model</strong> is a live tree of
          objects that represents your HTML page in memory. JavaScript talks to this tree — not
          to the raw <span className="font-mono text-sm text-web-400">.html</span> file — when it
          reads or changes the page.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: HTML is the blueprint; the DOM is the house you can walk through and rearrange
          after it is built.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why this matters">
        Every button click, text update, or show/hide animation on a webpage goes through the DOM.
        Learn the tree first — selectors and events build on it.
      </Callout>

      <LessonSection title="HTML becomes a tree">
        <p className="text-slate-300">
          The browser parses your markup into nested nodes: elements, text, and attributes. Parents
          hold children. That nesting is the DOM tree.
        </p>
        <Flowchart
          title="HTML → DOM tree"
          chart={`flowchart TB
  A["HTML file"] --> B[Browser parser]
  B --> C["document root"]
  C --> D[html]
  D --> E[head]
  D --> F[body]
  F --> G["h1 Hello"]
  F --> H["button Click"]`}
        />
        <Example title="Same idea as nested objects">
{`// Rough mental model (not exact API):
{
  tag: "body",
  children: [
    { tag: "h1", text: "Hello" },
    { tag: "button", text: "Click" }
  ]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="document and window">
        <ContentStep number={1} title="document">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">document</span> is the entry point to
            the page tree. You use it to find elements, create nodes, and read titles.
          </p>
        </ContentStep>
        <ContentStep number={2} title="window">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-web-400">window</span> is the browser tab
            global. It owns <span className="font-mono text-sm text-web-400">document</span>,
            timers, location, and more. In browsers, top-level{' '}
            <span className="font-mono text-sm text-web-400">var</span> and many APIs hang off it.
          </p>
        </ContentStep>
        <CodeBlock title="Peek at the page from the console">
{`console.log(window.document === document); // true
console.log(document.title);
console.log(document.body);
console.log(document.documentElement); // <html>`}
        </CodeBlock>
        <Callout variant="tip" title="Open DevTools">
          Press F12 → Console. Type{' '}
          <span className="font-mono text-sm text-web-400">document.body</span> and explore. Seeing
          the live object beats memorizing definitions.
        </Callout>
      </LessonSection>

      <LessonSection title="Nodes you will touch often">
        <ContentStep number={1} title="Element nodes">
          <p className="text-slate-300">
            Tags like <span className="font-mono text-sm text-web-400">&lt;div&gt;</span> and{' '}
            <span className="font-mono text-sm text-web-400">&lt;button&gt;</span> become element
            objects with properties such as{' '}
            <span className="font-mono text-sm text-web-400">id</span>,{' '}
            <span className="font-mono text-sm text-web-400">className</span>, and{' '}
            <span className="font-mono text-sm text-web-400">children</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Text nodes">
          <p className="text-slate-300">
            The words inside tags are text nodes. Updating visible copy usually means changing an
            element&apos;s text through the parent element API.
          </p>
        </ContentStep>
        <CodeBlock title="Walk a tiny tree">
{`const heading = document.querySelector("h1");
console.log(heading.tagName);      // "H1"
console.log(heading.textContent);  // visible text
console.log(heading.parentElement); // often <body> or a wrapper`}
        </CodeBlock>
        <Example title="Relationship words">
{`parentElement  — node one level up
children       — element children only
firstChild     — first child node (may be text/whitespace)
querySelector  — find one match anywhere under a root`}
        </Example>
      </LessonSection>

      <LessonSection title="The DOM is live">
        <p className="text-slate-300">
          When JavaScript changes the tree, the screen updates. You do not rewrite the HTML file on
          disk — you mutate the in-memory model, and the browser paints the result.
        </p>
        <CodeBlock title="Change the page in one line">
{`document.title = "Learning the DOM";
document.body.style.backgroundColor = "#0f172a";`}
        </CodeBlock>
        <Callout variant="insight" title="Separate layers">
          HTML describes structure. CSS styles it. JavaScript changes behavior and content through
          the DOM. Keeping those jobs clear makes debugging easier.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'The DOM is a live object tree representing the page.',
          'document is your API into that tree; window is the browser global.',
          'Browsers parse HTML into nested nodes you can read and update.',
          'JS changes the DOM in memory — the screen follows those changes.',
        ]}
      />
    </LessonArticle>
  )
}
