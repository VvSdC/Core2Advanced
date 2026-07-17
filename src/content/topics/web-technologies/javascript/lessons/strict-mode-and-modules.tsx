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

export function StrictModeAndModules() {
  return (
    <LessonArticle>
      <Definition term="Strict mode and modules">
        <p>
          <span className="font-mono text-sm text-web-400">&apos;use strict&apos;</span> turns on a
          safer dialect of JavaScript. <strong className="text-white">ES modules</strong> split
          code into files that <span className="font-mono text-sm text-web-400">export</span> and{' '}
          <span className="font-mono text-sm text-web-400">import</span> values.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: strict mode is seatbelts; modules are labeled drawers so tools are not dumped
          in one giant <span className="text-web-400">toolbox pile</span>.
        </p>
      </Definition>

      <Callout variant="beginner" title="Good news">
        Module files are automatically in strict mode. Learning both together is natural.
      </Callout>

      <LessonSection title="'use strict'">
        <p className="text-slate-300">
          Put <span className="font-mono text-sm text-web-400">&apos;use strict&apos;;</span> at the
          top of a script (or function) to catch silent mistakes — like assigning to a misspelled
          variable and accidentally creating a global.
        </p>
        <Example title="Strict catches bad assignment">
{`'use strict';

// mistypedVariable = 10; // ReferenceError in strict mode
// (in sloppy mode this might create a global — bad!)

const score = 10;
console.log(score);`}
        </Example>
        <CodeBlock title="Other strict protections (examples)">
{`'use strict';

function demo(a, a) { // SyntaxError in strict — duplicate params
  return a;
}

// Deleting plain variables / some silent fails become errors
const user = { name: 'Ada' };
console.log(user.name);`}
        </CodeBlock>
        <Callout variant="tip" title="Mental model">
          Strict mode does not change how most correct code works — it fails louder when you do
          something fragile.
        </Callout>
      </LessonSection>

      <LessonSection title="ES modules: import / export">
        <Flowchart
          title="Module flow"
          chart={`flowchart TB
  M[math.js exports add]
  A[app.js imports add]
  M --> A
  A --> R[Run add in app]`}
        />
        <ContentStep number={1} title="Named export">
          <p className="text-slate-300">
            Mark values with <span className="font-mono text-sm text-web-400">export</span>, then
            pull them in with matching names.
          </p>
        </ContentStep>
        <Example title="math.js and app.js">
{`// math.js
export function add(a, b) {
  return a + b;
}

export const PI = 3.14;

// app.js
import { add, PI } from './math.js';

console.log(add(2, 3)); // 5
console.log(PI);`}
        </Example>
        <ContentStep number={2} title="Default export">
          <p className="text-slate-300">
            One main value per file with{' '}
            <span className="font-mono text-sm text-web-400">export default</span> — import name is
            up to you.
          </p>
        </ContentStep>
        <CodeBlock title="Default export / import">
{`// greeter.js
export default function greet(name) {
  return 'Hi, ' + name;
}

// app.js
import greet from './greeter.js';
console.log(greet('Sam'));`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title='script type="module"'>
        <p className="text-slate-300">
          In the browser, load modules with{' '}
          <span className="font-mono text-sm text-web-400">type=&quot;module&quot;</span>. They
          defer by default, use strict mode, and resolve{' '}
          <span className="font-mono text-sm text-web-400">import</span> paths.
        </p>
        <Example title="index.html wiring">
{`<!-- index.html -->
<!DOCTYPE html>
<html>
  <body>
    <h1>Modules demo</h1>
    <script type="module" src="./app.js"></script>
  </body>
</html>`}
        </Example>
        <CodeBlock title="Quick checklist">
{`// ✔ Use .js extensions in browser imports: from './math.js'
// ✔ Serve over http(s) — file:// often blocks modules
// ✔ Modules are deferred — DOM is usually ready
//'use strict' is implied inside modules`}
        </CodeBlock>
        <Callout variant="info" title="Node note">
          Node supports ESM via <span className="font-mono text-sm text-web-400">.mjs</span> or{' '}
          <span className="font-mono text-sm text-web-400">&quot;type&quot;: &quot;module&quot;</span>{' '}
          in package.json. Same import/export ideas.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          "'use strict' makes silent mistakes into loud errors.",
          'ES modules export / import keep code split and reusable.',
          'Browser: <script type="module" src="app.js"> loads ESM.',
          'Module code is strict by default — seatbelts are already on.',
        ]}
      />
    </LessonArticle>
  )
}
