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

export function MergeAndConflicts() {
  return (
    <LessonArticle>
      <Definition term="Merge">
        <p>
          <span className="font-mono text-sm text-core-400">git merge</span> brings another branch&apos;s
          commits into your current branch. Sometimes Git can simply move the tip forward (
          <strong className="text-white">fast-forward</strong>); sometimes it creates a{' '}
          <strong className="text-white">merge commit</strong> with two parents.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: fast-forward is sliding a bookmark; a merge commit is stapling two draft stacks
          together with a cover note.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Switch to the branch that should receive work, then merge the branch that has the new commits.
      </Callout>

      <LessonSection title="A simple merge">
        <Flowchart
          title="Integrate a feature into main"
          chart={`flowchart TB
  A[git switch main] --> B[git merge feature/login]
  B --> C{Can fast-forward?}
  C -->|yes| D[Move main tip forward]
  C -->|no| E[Create merge commit]
  E --> F{Conflicts?}
  F -->|no| G[Done]
  F -->|yes| H[Edit files → add → commit]`}
        />
        <Example title="Merge feature into main">
{`git switch main
git merge feature/login`}
        </Example>
        <ContentStep number={1} title="Fast-forward intuition">
          <p className="text-slate-300">
            If <span className="font-mono text-sm text-core-400">main</span> has not diverged, Git just
            slides the pointer — no extra merge commit.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Merge commit intuition">
          <p className="text-slate-300">
            If both sides added commits, Git combines histories and records a merge commit (unless you
            use other strategies later).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Conflicts — what they look like">
        <p className="text-slate-300">
          A conflict means both branches changed the same lines. Git pauses and marks the file:
        </p>
        <CodeBlock title="Conflict markers in a file">
{`<<<<<<< HEAD
console.log("version from current branch")
=======
console.log("version from incoming branch")
>>>>>>> feature/login`}
        </CodeBlock>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Between <span className="font-mono text-sm text-core-400">{'<<<<<<< HEAD'}</span> and{' '}
            <span className="font-mono text-sm text-core-400">=======</span>: your current branch.
          </li>
          <li>
            Between <span className="font-mono text-sm text-core-400">=======</span> and{' '}
            <span className="font-mono text-sm text-core-400">{'>>>>>>> ...'}</span>: the incoming side.
          </li>
        </ul>
        <Callout variant="tip" title="Your job">
          Delete the markers, keep the correct final code (or a blend), then stage and finish the merge.
        </Callout>
      </LessonSection>

      <LessonSection title="Resolve step by step">
        <ContentStep number={1} title="See conflicted files">
          <CodeBlock title="Status during a conflict">
{`git status
# Unmerged paths:
#   both modified:   app.js`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="Edit and stage">
          <CodeBlock title="After fixing markers">
{`# edit app.js — remove <<<<<<< ======= >>>>>>>
git add app.js`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={3} title="Finish or abort">
          <CodeBlock title="Complete the merge">
{`git commit
# message is often pre-filled for merges`}
          </CodeBlock>
          <CodeBlock title="Give up and go back">{`git merge --abort`}</CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="After a successful merge">
        <CodeBlock title="Confirm history">
{`git log --oneline --graph -10
git status
# working tree clean on main`}
        </CodeBlock>
        <p className="text-slate-300">
          Optional cleanup once the feature is merged and you no longer need the branch:
        </p>
        <CodeBlock title="Delete the feature branch locally">
{`git branch -d feature/login`}
        </CodeBlock>
        <Callout variant="beginner" title="Practice tip">
          Create two tiny branches that edit the <em>same line</em> of a file on purpose. Merge them to
          see conflict markers once in a safe sandbox — then resolving stops feeling scary.
        </Callout>
        <Example title="Sandbox conflict drill">
{`git switch -c left
echo "A" > clash.txt && git add clash.txt && git commit -m "left"
git switch main
git switch -c right
echo "B" > clash.txt && git add clash.txt && git commit -m "right"
git switch main
git merge left
git merge right   # conflict — practice resolving`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Merge into the branch that should receive the work.</>,
          <>Fast-forward slides; otherwise Git may make a merge commit.</>,
          <>Conflict markers show both sides — edit, add, commit.</>,
          <><span className="font-mono text-sm text-core-400">git status</span> guides you during conflicts; <span className="font-mono text-sm text-core-400">merge --abort</span> cancels.</>,
        ]}
      />
    </LessonArticle>
  )
}
