import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  StepSequence,
} from '../../../../../components/content'

export function ModulesAndImports() {
  return (
    <LessonArticle>
      <Definition term="Modules & Imports">
        <p>
          A <strong className="text-white">module</strong> is a Python file (or package) that groups related code.
          The <code className="font-mono text-sm">import</code> system loads modules once, caches them in{' '}
          <code className="font-mono text-sm">sys.modules</code>, and binds names in your namespace.
        </p>
        <p>
          Interviewers ask how imports work, circular import traps, and the difference between{' '}
          <code className="font-mono text-sm">import x</code> and <code className="font-mono text-sm">from x import y</code>.
        </p>
      </Definition>

      <ContentStep number={1} title="Import styles">
        <Example
          title="Common patterns"
          caption="All valid — choose clarity over cleverness."
        >{`import math
from math import sqrt
from math import sqrt as square_root
from collections import defaultdict, Counter

# Avoid: from module import *  — pollutes namespace, hides origins`}</Example>
        <StepSequence
          steps={[
            {
              title: 'import module',
              description: 'Loads module once; access via module.attr. Clear where names come from.',
            },
            {
              title: 'from module import name',
              description: 'Binds name directly in current namespace. Faster to type, harder to trace.',
            },
            {
              title: 'import module as alias',
              description: 'Common for long names: import numpy as np.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={2} title="Packages and __init__.py">
        <p>
          A <strong className="text-white">package</strong> is a directory with{' '}
          <code className="font-mono text-sm">__init__.py</code> (or namespace package in modern Python). Dotted
          imports mirror the folder structure: <code className="font-mono text-sm">from mypkg.utils import helper</code>.
        </p>
        <Callout variant="info">
          <code className="font-mono text-sm">if __name__ == &quot;__main__&quot;:</code> runs only when the file
          is executed directly — not when imported. Standard pattern for reusable modules that can also be scripts.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="How Python resolves imports">
        <StepSequence
          steps={[
            {
              title: 'Search sys.path',
              description: 'Current directory, PYTHONPATH, site-packages — in order.',
            },
            {
              title: 'Check sys.modules cache',
              description: 'If already loaded, reuse the cached module object — no re-execution.',
            },
            {
              title: 'Execute module top-level code',
              description: 'First import runs all top-level statements. Side effects at import time are a common bug.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={4} title="Circular imports — interview trap">
        <p>
          Module A imports B while B imports A → partial initialization. Fix by moving imports inside functions,
          restructuring shared code into a third module, or using lazy imports.
        </p>
        <Callout variant="insight">
          Interview answer: Python allows circular imports if names are used after both modules finish loading.
          Failures happen when top-level code in A needs B's top-level code that needs A's incomplete state.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'Modules are files; packages are directories — imports load and cache once.',
          'Prefer import module or from module import specific names over star-imports.',
          '__name__ == "__main__" guards script-only execution.',
          'Circular imports break when modules depend on each other at import time.',
        ]}
      />
    </LessonArticle>
  )
}
