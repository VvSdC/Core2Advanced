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

export function HowPythonIsCompiled() {
  return (
    <LessonArticle>
      <Definition term="How Python is Compiled">
        <p>
          You may have heard that "Python is an interpreted language" and "C++ is a compiled language." This is
          misleading. Python <em>does</em> compile your code — it just compiles to something different than what C++
          produces.
        </p>
        <p>
          <strong className="text-white">Compilation</strong> simply means transforming code from one form into
          another. C++ compiles to <strong className="text-white">machine code</strong> (instructions your CPU runs
          directly). Python compiles to <strong className="text-white">bytecode</strong> (instructions Python's
          virtual machine runs).
        </p>
        <p>
          The important takeaway for beginners: when you run a .py file, Python does real compilation work before
          your first line executes. You just do not see a separate "build" step like in other languages.
        </p>
      </Definition>

      <Callout variant="beginner" title="Compiled vs interpreted — what's the difference?">
        <p>
          <strong className="text-white">Compiled (e.g. C++):</strong> all code is translated to machine code{' '}
          <em>before</em> running. The result is a standalone executable.
        </p>
        <p className="mt-2">
          <strong className="text-white">Interpreted (e.g. Python):</strong> code is translated to bytecode first,
          then a virtual machine reads and executes bytecode <em>while your program runs</em>.
        </p>
        <p className="mt-2">
          Python is often called "interpreted" because there is no .exe file — but bytecode compilation still
          happens. It is just hidden from you.
        </p>
      </Callout>

      <ContentStep number={1} title="The flow">
        <p>
          From the moment Python opens your file, it goes through these stages. None of this requires any action
          from you — it is fully automatic.
        </p>
        <Flowchart
          title="Compilation pipeline"
          chart={`
flowchart TB
  A["Source file .py"]
  B["Tokenizer"]
  C["Parser"]
  D["AST"]
  E["Compiler"]
  F["Bytecode .pyc"]
  G["CEval executes"]

  A --> B
  B --> C
  C --> D
  D --> E
  E --> F
  F --> G

  style F fill:#1a2540,stroke:#38bdf8,color:#f8fafc
  style G fill:#1a2540,stroke:#fbbf24,color:#f8fafc
        `}
        />
      </ContentStep>

      <ContentStep number={2} title="Walking through the flow">
        <p>Let us understand each stage with a concrete example. Consider this single line:</p>
        <Example title="Our example line">{`result = 2 + 3`}</Example>
        <StepSequence
          steps={[
            {
              title: 'Tokenizer — breaking code into pieces',
              description: (
                <>
                  <p>
                    The tokenizer scans your file character by character and groups them into{' '}
                    <strong className="text-white">tokens</strong> — the smallest meaningful units.
                  </p>
                  <p className="mt-2 font-mono text-sm text-slate-400">
                    result = 2 + 3 → [NAME, EQUALS, NUMBER, PLUS, NUMBER]
                  </p>
                  <p className="mt-2">
                    Just like breaking a sentence into words before understanding grammar.
                  </p>
                </>
              ),
            },
            {
              title: 'Parser — checking grammar and building a tree',
              description: (
                <>
                  <p>
                    The parser checks that tokens follow Python's grammar rules (correct syntax), then builds an{' '}
                    <strong className="text-white">Abstract Syntax Tree (AST)</strong> — a tree structure
                    representing what your code <em>means</em>.
                  </p>
                  <p className="mt-2">
                    For <code className="font-mono text-sm">result = 2 + 3</code>, the tree says: "assign the
                    result of adding 2 and 3 to the variable result." If you wrote{' '}
                    <code className="font-mono text-sm">result = 2 +</code> (incomplete), the parser catches it
                    here with a <code className="font-mono text-sm">SyntaxError</code>.
                  </p>
                </>
              ),
            },
            {
              title: 'Compiler — generating bytecode',
              description: (
                <>
                  <p>
                    The compiler walks the AST and emits bytecode instructions. These are compact numeric
                    operations the virtual machine understands — like assembly language, but for Python.
                  </p>
                  <p className="mt-2">
                    You never write bytecode yourself. It is an internal representation Python uses to run your
                    code efficiently.
                  </p>
                </>
              ),
            },
            {
              title: 'Bytecode cache — saving for next time',
              description: (
                <>
                  <p>
                    After compiling, Python may write the bytecode to a{' '}
                    <code className="rounded bg-surface-700 px-1.5 py-0.5 font-mono text-sm">__pycache__</code>{' '}
                    folder as a <code className="font-mono text-sm">.pyc</code> file. Next time you run the same
                    file (if unchanged), Python skips tokenizing, parsing, and compiling — it loads the cached
                    bytecode directly.
                  </p>
                  <p className="mt-2">
                    This is why the <em>second</em> run of a large project often feels faster than the first.
                  </p>
                </>
              ),
            },
            {
              title: 'CEval — executing bytecode',
              description: (
                <>
                  <p>
                    The CEval loop (Python's main interpreter loop) fetches each bytecode instruction, executes it,
                    moves to the next. For <code className="font-mono text-sm">result = 2 + 3</code>, it loads 2,
                    loads 3, adds them, stores the result in the variable <code className="font-mono text-sm">result</code>.
                  </p>
                  <p className="mt-2">This is where your program actually "runs."</p>
                </>
              ),
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={3} title="In practice">
        <p>Let us see bytecode with our own eyes using Python's built-in <code className="font-mono text-sm">dis</code> module (short for "disassemble"):</p>
        <Example title="Step 1 — write a function">{`def greet(name):
    message = "Hello, " + name
    return message`}</Example>
        <Example
          title="Step 2 — disassemble it"
          output={`  0 LOAD_CONST    1 ('Hello, ')
  2 LOAD_FAST     0 (name)
  4 BINARY_OP     0 (+)
  8 STORE_FAST    1 (message)
 10 LOAD_FAST     1 (message)
 12 RETURN_VALUE`}
          caption="Reading bytecode: LOAD_CONST pushes a constant onto the stack. LOAD_FAST pushes a variable. BINARY_OP adds them. STORE_FAST saves to a variable. RETURN_VALUE sends the result back."
        >{`import dis

def greet(name):
    message = "Hello, " + name
    return message

dis.dis(greet)`}</Example>
        <p className="pt-2">What is "the stack"? A temporary holding area the VM uses while computing. It pushes values on, operates on them, and pops results off — like a stack of plates.</p>
        <Example
          title="Finding cached bytecode on disk"
          output={`myproject/
  app.py
  __pycache__/
    app.cpython-312.pyc    ← cached bytecode`}
          caption="After running app.py once, look for __pycache__. The .pyc file is bytecode, not machine code. Delete it anytime — Python will regenerate it."
        >{`# Run your script once, then check the folder:
# python app.py
# ls __pycache__/`}</Example>
        <Callout variant="tip">
          If your app feels slow to <em>start</em>, compilation during imports is often the reason. Importing 50
          modules means compiling (or loading) 50 sets of bytecode before your main logic runs.
        </Callout>
        <p className="pt-2">
          <strong className="text-white">Module vs script:</strong> the same{' '}
          <code className="font-mono text-sm">.py</code> file can be both. Run it directly (
          <code className="font-mono text-sm">python app.py</code>) and it is a script — top-level code executes
          immediately. Import it (<code className="font-mono text-sm">import app</code>) and it is a module — Python
          compiles and caches it, running top-level code only on the first import.
        </p>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Python compiles source code to bytecode before executing it — you just do not see a build step.',
          'Tokenizing breaks code into pieces; parsing checks grammar; compiling produces bytecode.',
          'Bytecode is cached in __pycache__ as .pyc files for faster subsequent runs.',
          'The dis module lets you peek at bytecode — useful for understanding what Python actually runs.',
        ]}
      />
    </LessonArticle>
  )
}
