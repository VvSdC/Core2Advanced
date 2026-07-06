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

export function PackagingAndVenv() {
  return (
    <LessonArticle>
      <Definition term="Packaging & Virtual Environments">
        <p>
          A <strong className="text-white">virtual environment</strong> isolates project dependencies from your
          system Python. <strong className="text-white">Packaging</strong> turns your code into a distributable,
          installable project others (or CI) can reproduce.
        </p>
        <p>
          Interviewers ask how venv works, what <code className="font-mono text-sm">pip install -e .</code> does,
          and the difference between <code className="font-mono text-sm">requirements.txt</code> and{' '}
          <code className="font-mono text-sm">pyproject.toml</code>.
        </p>
      </Definition>

      <ContentStep number={1} title="Why virtual environments">
        <Flowchart
          title="Isolation"
          chart={`
flowchart TB
  SYS["System Python + global packages"]
  V1["venv project A — isolated deps"]
  V2["venv project B — isolated deps"]

  SYS --> V1
  V1 --> V2
        `}
        />
        <p>
          Project A needs Django 4; Project B needs Django 5. Without venvs, only one version can live in global
          site-packages.
        </p>
      </ContentStep>

      <ContentStep number={2} title="Creating and using a venv">
        <Example
          title="Standard workflow"
          caption="Commands run in terminal — not Python code."
        >{`# Create
python -m venv .venv

# Activate (Windows PowerShell)
.venv\\Scripts\\Activate.ps1

# Activate (macOS / Linux)
source .venv/bin/activate

# Install into THIS venv only
pip install requests pytest

# Deactivate
deactivate`}</Example>
        <Callout variant="info">
          <code className="font-mono text-sm">python -m venv</code> is preferred over the legacy{' '}
          <code className="font-mono text-sm">virtualenv</code> package for new projects. Always commit a lock
          file or requirements — never commit the <code className="font-mono text-sm">.venv</code> folder itself.
        </Callout>
      </ContentStep>

      <ContentStep number={3} title="requirements.txt">
        <Example
          title="Pin dependencies for reproducibility"
          caption="pip freeze > requirements.txt  then  pip install -r requirements.txt"
        >{`# requirements.txt
requests==2.31.0
pytest==8.0.0`}</Example>
        <p>
          Simple and universal. Downside: no metadata about your own package, no build system declaration.
        </p>
      </ContentStep>

      <ContentStep number={4} title="pyproject.toml — modern standard">
        <Example
          title="Minimal project layout"
          caption="PEP 621 project metadata + build backend"
        >{`# pyproject.toml
[project]
name = "myapp"
version = "0.1.0"
requires-python = ">=3.10"
dependencies = [
    "requests>=2.28",
]

[project.optional-dependencies]
dev = ["pytest>=8.0"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"`}</Example>
        <StepSequence
          steps={[
            {
              title: 'pip install .',
              description: 'Installs the package into the active venv.',
            },
            {
              title: 'pip install -e .',
              description: 'Editable install — code changes reflect immediately without reinstall.',
            },
            {
              title: 'pip install ".[dev]"',
              description: 'Installs package plus optional dev dependencies.',
            },
          ]}
        />
      </ContentStep>

      <ContentStep number={5} title="Project structure">
        <Example
          title="Typical src layout"
          caption="src/ layout avoids accidentally importing from the repo root."
        >{`myproject/
  pyproject.toml
  src/
    myapp/
      __init__.py
      main.py
  tests/
    test_main.py
  .venv/          # gitignored`}</Example>
      </ContentStep>

      <ContentStep number={6} title="pip, pip-tools, and poetry">
        <ul className="space-y-2 text-slate-300">
          <li>
            <strong className="text-white">pip</strong> — installs packages from PyPI into the active environment.
          </li>
          <li>
            <strong className="text-white">pip-tools</strong> — compiles pinned requirements from loose deps
            (<code className="font-mono text-sm">pip-compile</code>).
          </li>
          <li>
            <strong className="text-white">Poetry / uv</strong> — higher-level tools managing venv + lockfile +
            publish. Know they exist; pyproject.toml is the shared standard underneath.
          </li>
        </ul>
      </ContentStep>

      <ContentStep number={7} title="Interview quick answers">
        <Callout variant="insight">
          <strong className="text-white">Why venv?</strong> Isolate dependencies per project.
          <br />
          <strong className="text-white">requirements.txt vs pyproject.toml?</strong> requirements pins deps;
          pyproject defines the project, build system, and deps in one file.
          <br />
          <strong className="text-white">Editable install?</strong> <code className="font-mono text-sm">pip install -e .</code>{' '}
          links source — changes apply without reinstall.
          <br />
          <strong className="text-white">Where do packages go?</strong> Active venv's site-packages, not system Python.
        </Callout>
      </ContentStep>

      <KeyTakeaways
        items={[
          'python -m venv .venv isolates dependencies per project.',
          'Never commit .venv — commit requirements.txt or pyproject.toml + lockfile.',
          'pyproject.toml is the modern project manifest (PEP 621).',
          'pip install -e . for editable development installs.',
        ]}
      />
    </LessonArticle>
  )
}
