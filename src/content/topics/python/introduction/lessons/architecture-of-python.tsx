import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function ArchitectureOfPython() {
  return (
    <LessonArticle>
      <Definition term="Architecture of Python">
        <p>
          If you have written Python before, you probably ran a file like{' '}
          <code className="rounded bg-surface-700 px-1.5 py-0.5 font-mono text-sm">python hello.py</code> and saw
          output appear. But what actually happened between pressing Enter and seeing{' '}
          <code className="rounded bg-surface-700 px-1.5 py-0.5 font-mono text-sm">Hello, World!</code>?
        </p>
        <p>
          The <strong className="text-white">architecture of Python</strong> is the answer. It describes the layered
          system (called <strong className="text-white">CPython</strong> — the standard Python implementation) that
          takes your human-readable code and turns it into something the computer can execute.
        </p>
        <p>
          Think of it like a factory assembly line: your code enters at the top, gets transformed at each station,
          and finally reaches the operating system which talks to the actual hardware.
        </p>
      </Definition>

      <Callout variant="beginner" title="Words you will see in this lesson">
        <ul className="list-inside list-disc space-y-1">
          <li>
            <strong className="text-white">CPython</strong> — the default Python you download from python.org
          </li>
          <li>
            <strong className="text-white">Source code</strong> — the .py files you write
          </li>
          <li>
            <strong className="text-white">Bytecode</strong> — a compact, machine-oriented version of your code
          </li>
          <li>
            <strong className="text-white">Virtual Machine (VM)</strong> — the engine that runs bytecode
          </li>
          <li>
            <strong className="text-white">PyObject</strong> — the internal wrapper around every value in Python
          </li>
        </ul>
      </Callout>

      <ContentStep number={1} title="The flow">
        <p>
          Before we zoom into any single layer, here is the full journey your code takes. Read it top to bottom —
          we will explain every box in the next section.
        </p>
        <Flowchart
          title="CPython architecture"
          chart={`
flowchart TB
  A["Your Python Code"]
  B["Parser and Compiler"]
  C["Bytecode"]
  D["Virtual Machine"]
  E["Object System"]
  F["C Runtime"]
  G["Operating System"]

  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
  F --> G

  style A fill:#1a2540,stroke:#fbbf24,color:#f8fafc
  style D fill:#1a2540,stroke:#38bdf8,color:#f8fafc
  style G fill:#1a2540,stroke:#64748b,color:#f8fafc
        `}
        />
        <Callout variant="beginner">
          Analogy: your recipe (source code) gets translated into kitchen shorthand (bytecode), then a chef
          (virtual machine) follows that shorthand step by step, using pre-built tools (C runtime) in a kitchen
          (operating system).
        </Callout>
      </ContentStep>

      <ContentStep number={2} title="Walking through the flow">
        <p>
          Let us walk through each layer slowly. If anything feels unfamiliar, that is normal — we introduce
          concepts here that other lessons explore in even more depth.
        </p>
        <StepSequence
          steps={[
            {
              title: '1. Your Python Code (.py files)',
              description: (
                <>
                  <p>
                    This is what you write in VS Code, PyCharm, or any editor. It uses English-like keywords:
                    <code className="mx-1 rounded bg-surface-700 px-1.5 py-0.5 font-mono text-sm">if</code>,
                    <code className="mx-1 rounded bg-surface-700 px-1.5 py-0.5 font-mono text-sm">for</code>,
                    <code className="mx-1 rounded bg-surface-700 px-1.5 py-0.5 font-mono text-sm">def</code>, and
                    so on. Computers cannot run this text directly — it must be transformed first.
                  </p>
                </>
              ),
            },
            {
              title: '2. Parser and Compiler',
              description: (
                <>
                  <p>
                    When Python first sees your file, it <strong className="text-white">reads</strong> the text,
                    checks for syntax errors, and <strong className="text-white">compiles</strong> it into bytecode.
                    This happens automatically — you never run a separate "compile" command like in C or Java.
                  </p>
                  <p className="mt-2">
                    If you have a syntax error (missing colon, wrong indentation), Python stops here and shows an
                    error before any code runs.
                  </p>
                </>
              ),
            },
            {
              title: '3. Bytecode',
              description: (
                <>
                  <p>
                    Bytecode is a set of low-level instructions designed for Python's virtual machine. It is not
                    human-readable, but it is also not raw machine code for your CPU. It sits in the middle — a
                    portable format that any Python installation can understand.
                  </p>
                  <p className="mt-2">
                    Python may save bytecode to a{' '}
                    <code className="rounded bg-surface-700 px-1.5 py-0.5 font-mono text-sm">__pycache__</code>{' '}
                    folder so the next run is faster. We cover this in the "How Python is Compiled" lesson.
                  </p>
                </>
              ),
            },
            {
              title: '4. Virtual Machine (CEval)',
              description: (
                <>
                  <p>
                    The VM is a loop that reads bytecode instructions one at a time and performs each action: load a
                    value, add two numbers, call a function, jump to another instruction. You can think of it as a
                    tiny CPU that only understands Python.
                  </p>
                  <p className="mt-2">
                    When people say Python is "interpreted," they usually mean this step — the VM interprets
                    bytecode at runtime rather than your CPU running native machine code directly.
                  </p>
                </>
              ),
            },
            {
              title: '5. Object System',
              description: (
                <>
                  <p>
                    Every piece of data in Python — numbers, strings, lists, functions — is stored as an{' '}
                    <strong className="text-white">object</strong> with a standard internal structure (PyObject).
                    This is why you can call{' '}
                    <code className="rounded bg-surface-700 px-1.5 py-0.5 font-mono text-sm">type(42)</code> and get
                    an answer: even the number 42 is a full-fledged object with metadata attached.
                  </p>
                </>
              ),
            },
            {
              title: '6. C Runtime + Operating System',
              description: (
                <>
                  <p>
                    The heavy lifting — memory allocation, file reading, network sockets — is done by code written
                    in C, which then calls your operating system (Windows, macOS, Linux). Python itself is mostly
                    written in C under the hood.
                  </p>
                  <p className="mt-2">
                    When you open a file with{' '}
                    <code className="rounded bg-surface-700 px-1.5 py-0.5 font-mono text-sm">open()</code>, your
                    Python code triggers C code, which asks the OS to read bytes from disk.
                  </p>
                </>
              ),
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={3} title="In practice">
        <p>
          Let us trace what happens when you run a tiny program. Try typing this in a Python shell or saving it as
          a file:
        </p>
        <Example title="hello.py">{`message = "Hello, World!"
print(message)`}</Example>
        <p>Here is what each line triggers behind the scenes:</p>
        <ul className="space-y-2">
          <li className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
            <span>
              <code className="font-mono text-sm">message = "Hello, World!"</code> — Python creates a string{' '}
              <em>object</em> in memory and binds the name <code className="font-mono text-sm">message</code> to
              it.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-400" />
            <span>
              <code className="font-mono text-sm">print(message)</code> — the VM looks up the name, finds the
              string object, and calls the built-in <code className="font-mono text-sm">print</code> function
              (implemented in C), which writes to your terminal via the OS.
            </span>
          </li>
        </ul>
        <Example
          title="Seeing the object layer"
          output={`>>> type([])
<class 'list'>
>>> [].append
<built-in method append of list object at 0x...>`}
          caption="type() shows which kind of object you have. append is a method implemented in C — proof that your everyday Python code already rides the full stack."
        >{`items = []
items.append(42)
print(type(items))
print(items.append)`}</Example>
      </ContentStep>

      <Callout variant="insight" title="Why this matters for beginners">
        You do not need to memorize every layer to write Python. But when something confuses you — "Why is my app
        slow to start?" (compilation on import), "Why does my list use so much memory?" (object overhead), "Why
        don't threads make my code faster?" (the GIL in the VM layer) — the architecture tells you where to look.
      </Callout>

      <KeyTakeaways
        items={[
          'Running python file.py starts a multi-layer pipeline, not a single program.',
          'Your .py files are compiled to bytecode, then executed by a virtual machine.',
          'Every value (even numbers) is an object with a standard internal structure.',
          'C code and the operating system handle memory, files, and hardware underneath.',
        ]}
      />
    </LessonArticle>
  )
}
