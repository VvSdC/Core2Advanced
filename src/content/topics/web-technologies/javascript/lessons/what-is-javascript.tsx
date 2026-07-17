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

export function WhatIsJavascript() {
  return (
    <LessonArticle>
      <Definition term="JavaScript">
        <p>
          <strong className="text-white">JavaScript</strong> is the{' '}
          <strong className="text-white">language of the web</strong> — it makes pages interactive:
          buttons respond, forms validate, content updates without a full reload.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: HTML is the house frame, CSS is the paint, and{' '}
          <span className="text-web-400">JavaScript is the electricity</span> that turns lights and
          doors on.
        </p>
      </Definition>

      <Callout variant="beginner" title="Who this track is for">
        Absolute beginners. You do not need prior coding experience. We build a solid core —
        values, variables, functions, objects — before advanced topics. Type every snippet; reading
        alone is not enough.
      </Callout>

      <LessonSection title="Where JavaScript runs">
        <p className="text-slate-300">
          The same language runs in two main homes:{' '}
          <strong className="text-white">browsers</strong> (Chrome, Firefox, Edge) and{' '}
          <strong className="text-white">Node.js</strong> on servers and your laptop terminal.
          Learning the core once pays off in both places.
        </p>
        <Flowchart
          title="One language, two homes"
          chart={`flowchart TB
  JS[Your JavaScript code]
  JS --> BR[Browser — UI, DOM, fetch]
  JS --> ND[Node.js — files, servers, tools]
  BR --> US[User sees interactive pages]
  ND --> AP[APIs, scripts, build tools]`}
        />
        <ContentStep number={1} title="In the browser">
          <p className="text-slate-300">
            Scripts load with the page. They can change HTML, listen for clicks, and talk to APIs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="In Node.js">
          <p className="text-slate-300">
            Node runs JS outside the browser — useful for servers, CLIs, and tooling. Same language
            ideas; different built-in APIs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Scripting vs compiled (high level)">
        <p className="text-slate-300">
          Languages like C are often <strong className="text-white">compiled</strong> ahead of time
          into machine code. JavaScript is a{' '}
          <strong className="text-white">scripting language</strong>: you write source, and an{' '}
          <span className="text-web-400">engine</span> reads and runs it. Modern engines also use
          JIT (just-in-time) compilation under the hood — you still write plain{' '}
          <span className="font-mono text-sm text-web-400">.js</span> files.
        </p>
        <Example title="Your first runnable snippet" output="Hello, web!">
{`console.log('Hello, web!');`}
        </Example>
        <CodeBlock title="A tiny interactive idea">
{`const name = 'Ada';
const greeting = 'Hi, ' + name + '!';
console.log(greeting); // Hi, Ada!`}
        </CodeBlock>
        <Callout variant="tip" title="You do not compile by hand">
          Open a browser console or a Node terminal, paste the code, press Enter — it runs. That
          feedback loop is why JS is friendly for beginners.
        </Callout>
        <CodeBlock title="Try this in the browser console (F12)">
{`const buttonLabel = 'Click me';
console.log(buttonLabel.toUpperCase()); // CLICK ME
console.log(2 + 2 === 4);               // true`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Learning path for this JS track">
        <ContentStep number={1} title="How JS works">
          <p className="text-slate-300">
            Architecture (engine, runtime), then how a script is parsed and executed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Core language">
          <p className="text-slate-300">
            Values, types, variables, operators, control flow, and functions.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Data and habits">
          <p className="text-slate-300">
            Objects, arrays, strings, coercion, equality, strict mode, and modules — the habits
            that keep real projects readable.
          </p>
        </ContentStep>
        <Example title="Vocabulary preview">
{`script     — a JS file or inline code the host runs
engine     — V8, SpiderMonkey… reads and executes JS
runtime    — engine + APIs (DOM, fetch, fs…)
console    — place to print with console.log(...)`}
        </Example>
        <CodeBlock title="Mini checklist before you continue">
{`// 1) Open DevTools → Console
// 2) Run: console.log('ready')
// 3) Change a value and run again
const topic = 'JavaScript';
console.log('Learning ' + topic);`}
        </CodeBlock>
        <Callout variant="info" title="Pace yourself">
          Read one lesson, type the snippets, then move on. Muscle memory beats memorizing every
          keyword.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'JavaScript is the language that makes web pages interactive.',
          'It runs in browsers and in Node.js — same language, different APIs.',
          'You write scripts; an engine executes them (with JIT under the hood).',
          'This track builds from how JS works → core syntax → solid everyday habits.',
          'Practice in the console early — small experiments stick better than notes alone.',
        ]}
      />
    </LessonArticle>
  )
}
