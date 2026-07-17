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

export function WhatHappensOnGitInit() {
  return (
    <LessonArticle>
      <Definition term="git init">
        <p>
          <span className="font-mono text-sm text-core-400">git init</span> turns an ordinary folder
          into a <strong className="text-white">Git repository</strong> by creating a hidden{' '}
          <span className="font-mono text-sm text-core-400">.git</span> directory that stores history,
          configuration, and the staging index.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: your project folder is a house;{' '}
          <span className="font-mono text-sm text-core-400">git init</span> installs a{' '}
          <span className="text-core-400">filing cabinet in the basement</span> (
          <span className="font-mono text-sm text-core-400">.git</span>) where records live.
        </p>
      </Definition>

      <Callout variant="beginner" title="Nothing magical about the other files">
        Your <span className="font-mono text-sm text-core-400">README.md</span> and source files stay
        where they are. Git adds bookkeeping beside them — it does not move your project into a new
        format.
      </Callout>

      <LessonSection title="From folder to repository">
        <Flowchart
          title="folder → git init → repository"
          chart={`flowchart TB
  A[Ordinary project folder] --> B["Run: git init"]
  B --> C[Creates hidden .git/]
  C --> D[Folder is now a Git repository]`}
        />
        <Example
          title="Minimal sequence"
          caption="You can init an empty folder or an existing project"
        >
{`mkdir my-notes
cd my-notes
git init`}
        </Example>
        <CodeBlock title="Typical success message">
{`Initialized empty Git repository in .../my-notes/.git/`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="What lives inside .git (high level)">
        <p className="text-slate-300">
          You do not need to memorize every file. Recognize the main pieces so{' '}
          <span className="font-mono text-sm text-core-400">.git</span> feels less mysterious.
        </p>
        <ContentStep number={1} title="objects/">
          <p className="text-slate-300">
            Content-addressed storage for blobs, trees, and commits — the actual history data.
          </p>
        </ContentStep>
        <ContentStep number={2} title="refs/">
          <p className="text-slate-300">
            Pointers such as branch names that point at commit hashes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="HEAD">
          <p className="text-slate-300">
            Points at the current branch (or commit) you have checked out.
          </p>
        </ContentStep>
        <ContentStep number={4} title="config">
          <p className="text-slate-300">
            Settings for <em>this</em> repository (remotes, local overrides).
          </p>
        </ContentStep>
        <ContentStep number={5} title="index">
          <p className="text-slate-300">
            The staging area — what will go into the next commit after{' '}
            <span className="font-mono text-sm text-core-400">git add</span>.
          </p>
        </ContentStep>
        <CodeBlock title="Peek safely (do not delete)">
{`# Windows PowerShell / macOS / Linux — list .git top level
ls .git
# or: dir .git`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Safe to explore, dangerous to delete">
        <Callout variant="insight" title="Curiosity is good">
          Opening <span className="font-mono text-sm text-core-400">.git</span> in a file explorer is
          fine. Treat it like a database: look, do not casually delete or hand-edit files.
        </Callout>
        <p className="text-slate-300">
          Deleting <span className="font-mono text-sm text-core-400">.git</span> removes the
          repository history for that folder (your working files usually remain, but commits are
          gone). Prefer Git commands over manual surgery.
        </p>
        <Example title="Check that Git sees a repo">
{`git status
# On a brand-new init you typically see:
# "No commits yet" and "nothing to commit" (or untracked files)`}
        </Example>
      </LessonSection>

      <LessonSection title="Init vs clone (quick contrast)">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-core-400">git init</span> starts a brand-new
          history in the current folder.{' '}
          <span className="font-mono text-sm text-core-400">git clone</span> copies an existing
          remote repository (including its{' '}
          <span className="font-mono text-sm text-core-400">.git</span>) onto your machine. Both end
          with a local repo — different starting points.
        </p>
        <CodeBlock title="Two ways to get a .git folder">
{`# Brand new project
mkdir demo && cd demo && git init

# Existing project from the internet (later lessons)
git clone https://github.com/example/demo.git`}
        </CodeBlock>
        <Callout variant="tip" title="Already have files?">
          You can <span className="font-mono text-sm text-core-400">cd</span> into an existing
          project and run <span className="font-mono text-sm text-core-400">git init</span>. Git
          does not require an empty folder — it only adds{' '}
          <span className="font-mono text-sm text-core-400">.git</span> beside your files.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'git init creates a hidden .git folder and makes the directory a repository.',
          'Key pieces: objects, refs, HEAD, config, and the index (staging area).',
          'Exploring .git is OK; deleting or editing it by hand is not for beginners.',
          'Your project files stay in place — Git adds bookkeeping beside them.',
        ]}
      />
    </LessonArticle>
  )
}
