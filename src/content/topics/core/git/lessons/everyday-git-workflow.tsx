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

export function EverydayGitWorkflow() {
  return (
    <LessonArticle>
      <Definition term="Everyday Git workflow">
        <p>
          A practical day of Git is a loop: <strong className="text-white">see status</strong>,{' '}
          <strong className="text-white">sync</strong>, <strong className="text-white">branch</strong>,{' '}
          <strong className="text-white">edit</strong>, <strong className="text-white">add</strong>,{' '}
          <strong className="text-white">commit</strong>, <strong className="text-white">push</strong>.
        </p>
        <p className="mt-2 text-slate-300">
          You do not need every advanced command daily — these few cover most beginner work.
        </p>
      </Definition>

      <Callout variant="beginner" title="Cheat sheet mindset">
        When stuck, run <span className="font-mono text-sm text-core-400">git status</span>. It almost
        always tells you the next safe move.
      </Callout>

      <LessonSection title="Morning → evening sequence">
        <Flowchart
          title="A full day on a feature"
          chart={`flowchart TB
  A[status] --> B[pull or fetch]
  B --> C[switch -c feature]
  C --> D[edit files]
  D --> E[status → add → commit]
  E --> F{More work?}
  F -->|yes| D
  F -->|no| G[push -u / push]
  G --> H[open PR / done]`}
        />
        <ContentStep number={1} title="Morning — where am I?">
          <CodeBlock title="Start every session">
{`cd my-project
git status
git switch main`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="Sync with the team">
          <CodeBlock title="Integrate latest main">
{`git pull
# or: git fetch && git merge origin/main`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={3} title="Branch for the task">
          <CodeBlock title="Isolate your work">
{`git switch -c feature/fix-header`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={4} title="Edit → stage → commit (repeat)">
          <Example title="Save a meaningful chunk">
{`git status
git add .
git diff --staged
git commit -m "Update site header links"`}
          </Example>
        </ContentStep>
        <ContentStep number={5} title="Evening — publish">
          <CodeBlock title="First push of the branch">
{`git push -u origin feature/fix-header
# later commits on same branch:
git push`}
          </CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Copy-paste command block">
        <CodeBlock title="Full beginner day (happy path)">
{`# morning
git status
git switch main
git pull

# start work
git switch -c feature/my-task

# after edits
git status
git add .
git commit -m "Describe this change"

# share
git push -u origin feature/my-task`}
        </CodeBlock>
        <Callout variant="tip" title="Small commits beat giant ones">
          Commit when a thought is complete — easier to review, revert, and explain.
        </Callout>
      </LessonSection>

      <LessonSection title="Quick recoveries you will use">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Wrong file staged →{' '}
            <span className="font-mono text-sm text-core-400">git restore --staged file</span>
          </li>
          <li>
            Bad uncommitted edit →{' '}
            <span className="font-mono text-sm text-core-400">git restore file</span>
          </li>
          <li>
            Push rejected → fetch/merge (or pull), then push again
          </li>
          <li>
            Need history →{' '}
            <span className="font-mono text-sm text-core-400">git log --oneline</span>
          </li>
        </ul>
        <Callout variant="insight" title="Status is the hub">
          Status → decide → act → status again. That rhythm prevents most beginner mistakes.
        </Callout>
      </LessonSection>

      <LessonSection title="Midday and wrap-up extras">
        <CodeBlock title="Midday check-in">
{`git status
git fetch
git log --oneline HEAD..origin/main
# if you need main's updates on your feature:
# git merge origin/main`}
        </CodeBlock>
        <CodeBlock title="End of day">
{`git status
git add .
git commit -m "WIP: describe progress"   # or finish a complete thought
git push
git switch main`}
        </CodeBlock>
        <Callout variant="beginner" title="WIP commits">
          &quot;Work in progress&quot; commits on a private feature branch are fine. Clean them up later
          with soft reset / amend only if you have not shared them yet — or leave them and explain in the
          pull request.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Loop: status → sync → branch → add → commit → push.</>,
          <>Pull/fetch on main before starting a feature.</>,
          <>Review with <span className="font-mono text-sm text-core-400">git diff --staged</span> before commit.</>,
          <>Push with <span className="font-mono text-sm text-core-400">-u</span> once, then plain push.</>,
        ]}
      />
    </LessonArticle>
  )
}
