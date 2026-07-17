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

export function BranchesBasics() {
  return (
    <LessonArticle>
      <Definition term="Branches">
        <p>
          A <strong className="text-white">branch</strong> is a movable name pointing at a commit. Your
          current branch is where new commits land. Parallel branches let you try ideas without breaking{' '}
          <span className="font-mono text-sm text-core-400">main</span>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: <span className="font-mono text-sm text-core-400">main</span> is the published
          manuscript; a feature branch is a draft notebook you can scribble in freely.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why branches exist">
        Isolate work: fix a bug on one branch while finishing a feature on another, then merge when ready.
      </Callout>

      <LessonSection title="List and create branches">
        <Flowchart
          title="Create and switch"
          chart={`flowchart TB
  A[On main] --> B[Create branch]
  B --> C[Switch to it]
  C --> D[Commits go on the new branch]
  D --> E[main stays unchanged]`}
        />
        <ContentStep number={1} title="See branches">
          <CodeBlock title="Local branches">{`git branch`}</CodeBlock>
          <p className="text-slate-300">
            The star (<span className="font-mono text-sm text-core-400">*</span>) marks the branch you are
            on.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Create and switch (modern)">
          <Example title="Recommended today">
{`git switch -c feature/login
# or create first, then switch:
git branch feature/login
git switch feature/login`}
          </Example>
        </ContentStep>
        <ContentStep number={3} title="Older style (still common)">
          <CodeBlock title="checkout -b">
{`git checkout -b feature/login`}
          </CodeBlock>
          <p className="text-slate-300">
            Same idea: create <span className="font-mono text-sm text-core-400">feature/login</span> and
            check it out in one step.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Moving between branches">
        <CodeBlock title="Switch back to main">
{`git switch main
# older:
git checkout main`}
        </CodeBlock>
        <Callout variant="tip" title="Dirty working tree">
          Git may block a switch if uncommitted changes would be overwritten. Commit, stash, or discard
          first — then switch.
        </Callout>
        <Example title="Everyday feature workflow">
{`git switch main
git pull
git switch -c feature/add-tests
# ... edit, add, commit ...
git switch main`}
        </Example>
      </LessonSection>

      <LessonSection title="Detached HEAD (brief warning)">
        <p className="text-slate-300">
          If you check out a <strong className="text-white">commit hash</strong> or tag instead of a
          branch, you enter <span className="font-mono text-sm text-core-400">detached HEAD</span>. New
          commits are easy to &quot;lose&quot; because no branch name points at them.
        </p>
        <CodeBlock title="How beginners usually get there by accident">
{`git checkout a1b2c3d
# Git warns: You are in 'detached HEAD' state`}
        </CodeBlock>
        <Callout variant="insight" title="Get back to safety">
          Run <span className="font-mono text-sm text-core-400">git switch main</span> (or your branch
          name). Explore old commits with{' '}
          <span className="font-mono text-sm text-core-400">git show</span> /{' '}
          <span className="font-mono text-sm text-core-400">git log</span> when possible instead of living
          detached.
        </Callout>
      </LessonSection>

      <LessonSection title="Naming and cleanup tips">
        <p className="text-slate-300">
          Short, purposeful names help: <span className="font-mono text-sm text-core-400">feature/...</span>,{' '}
          <span className="font-mono text-sm text-core-400">fix/...</span>,{' '}
          <span className="font-mono text-sm text-core-400">docs/...</span>.
        </p>
        <CodeBlock title="Rename and delete (local)">
{`git branch -m feature/old-name feature/new-name
git switch main
git branch -d feature/finished   # safe delete if merged
# git branch -D feature/abandon  # force delete — careful`}
        </CodeBlock>
        <Callout variant="tip" title="Keep main healthy">
          Do day-to-day work on feature branches. Merge (or open a pull request) when the work is ready —
          covered in the merge lesson.
        </Callout>
        <Example title="See commits on this branch only (intuition)">
{`git log --oneline main..HEAD
# commits reachable from HEAD but not from main`}
        </Example>
        <CodeBlock title="List remote-tracking branches too">
{`git branch -a
# shows local branches and remotes/origin/...`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Branches are named pointers — parallel lines of work.</>,
          <>Prefer <span className="font-mono text-sm text-core-400">git switch -c</span>; know <span className="font-mono text-sm text-core-400">checkout -b</span>.</>,
          <><span className="font-mono text-sm text-core-400">git branch</span> lists locals; star = current.</>,
          <>Detached HEAD = no branch; switch back before new work.</>,
        ]}
      />
    </LessonArticle>
  )
}
