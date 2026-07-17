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

export function PuttingItTogetherGit() {
  return (
    <LessonArticle>
      <Definition term="Git mastery checklist">
        <p>
          You now connect the whole path: <strong className="text-white">init</strong> and objects,{' '}
          <strong className="text-white">add / commit</strong>, safe undos,{' '}
          <strong className="text-white">reset</strong> modes, branches and merges, and{' '}
          <strong className="text-white">fetch / pull / push</strong> with remotes.
        </p>
        <p className="mt-2 text-slate-300">
          This lesson is a final map — use it to self-check before moving on.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to use this page">
        Skim the checklist. Anything fuzzy → revisit that lesson and run the commands once on a practice
        repo.
      </Callout>

      <LessonSection title="Mastery checklist">
        <Flowchart
          title="From local folder to shared history"
          chart={`flowchart TB
  A[git init / clone] --> B[edit files]
  B --> C[add → commit]
  C --> D[branch → merge]
  D --> E[fetch / pull]
  E --> F[push]
  F --> G[shared remote history]`}
        />
        <ContentStep number={1} title="Init and objects">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>
              <span className="font-mono text-sm text-core-400">git init</span> creates{' '}
              <span className="font-mono text-sm text-core-400">.git</span>
            </li>
            <li>Commits are snapshots; branches are pointers</li>
            <li>
              <span className="font-mono text-sm text-core-400">clone</span> gets history + sets{' '}
              <span className="font-mono text-sm text-core-400">origin</span>
            </li>
          </ul>
        </ContentStep>
        <ContentStep number={2} title="Add and commit">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>
              Status → add → <span className="font-mono text-sm text-core-400">commit -m</span>
            </li>
            <li>
              Diff unstaged vs <span className="font-mono text-sm text-core-400">--staged</span>
            </li>
            <li>Amend only unpushed commits</li>
          </ul>
        </ContentStep>
        <ContentStep number={3} title="Reset types">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>Soft: keep staged</li>
            <li>Mixed: keep files, unstage</li>
            <li>Hard: discard — dangerous</li>
            <li>Shared history → prefer revert</li>
          </ul>
        </ContentStep>
        <ContentStep number={4} title="Fetch / pull / push">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>Fetch downloads; pull also integrates</li>
            <li>
              Push with <span className="font-mono text-sm text-core-400">-u</span> once
            </li>
            <li>Non-fast-forward → integrate remote first</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common beginner mistakes">
        <Example title="Mistakes and safer habits">
{`# Mistake: commit huge unrelated dumps
# Better: small commits with clear messages

# Mistake: git reset --hard on shared main
# Better: git revert HEAD

# Mistake: push when behind remote
# Better: git fetch / git pull, then push

# Mistake: work on detached HEAD
# Better: git switch -c my-branch`}
        </Example>
        <Callout variant="insight" title="Status habit beats memory">
          You do not need to memorize every flag. You need to read{' '}
          <span className="font-mono text-sm text-core-400">git status</span> and respond calmly.
        </Callout>
      </LessonSection>

      <LessonSection title="One practice drill">
        <CodeBlock title="20-minute sandbox">
{`mkdir git-practice && cd git-practice
git init
echo "hello" > note.txt
git add note.txt
git commit -m "Add note"
git switch -c experiment
echo "change" >> note.txt
git commit -am "Tweak note"
git switch main
git merge experiment
git log --oneline --graph`}
        </CodeBlock>
        <p className="text-slate-300">
          Then add a fake remote workflow: create a second clone or GitHub repo and practice fetch, pull,
          and push.
        </p>
      </LessonSection>

      <LessonSection title="Command flash cards">
        <CodeBlock title="Local essentials">
{`git status
git add .
git commit -m "message"
git log --oneline
git diff
git diff --staged
git restore file
git restore --staged file
git switch -c feature/x
git merge feature/x`}
        </CodeBlock>
        <CodeBlock title="Remote essentials">
{`git clone <url>
git remote -v
git fetch
git pull
git push -u origin main
git push
git revert HEAD`}
        </CodeBlock>
        <Callout variant="tip" title="You are ready when…">
          You can explain soft vs hard reset, why fetch does not change files, and when to prefer revert
          over reset — and you can demonstrate each on a practice repo without panic.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Local loop: status → add → commit; remote loop: fetch/pull → push.</>,
          <>Branches isolate work; merge (or PR) integrates it.</>,
          <>Soft/mixed/hard reset rewrite local history — hard discards files.</>,
          <>Revert for shared undos; fetch often; pull when ready to integrate.</>,
          <>When unsure, status + log + diff before any destructive command.</>,
        ]}
      />
    </LessonArticle>
  )
}
