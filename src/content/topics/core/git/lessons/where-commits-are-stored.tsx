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

export function WhereCommitsAreStored() {
  return (
    <LessonArticle>
      <Definition term="Where commits live">
        <p>
          Commits are stored inside <span className="font-mono text-sm text-core-400">.git/objects</span>{' '}
          as <strong className="text-white">content-addressed</strong> pieces:{' '}
          <strong className="text-white">blobs</strong> (file contents),{' '}
          <strong className="text-white">trees</strong> (folders / file names), and{' '}
          <strong className="text-white">commits</strong> (snapshot metadata + pointers).
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: each object is a <span className="text-core-400">locked box</span> labeled with a
          long hash (SHA-1 or SHA-256). Same contents → same label. Change one byte → new box, new
          label.
        </p>
      </Definition>

      <Callout variant="beginner" title="You do not need the binary format">
        Conceptual clarity beats memorizing object bytes. Know that commits point at trees, trees
        point at blobs, and parents link history — that is enough for now.
      </Callout>

      <LessonSection title="Content-addressed storage">
        <p className="text-slate-300">
          Git does not primarily store &quot;file path → latest text&quot; like a simple backup
          tool. It stores objects keyed by a <strong className="text-white">hash of their
          content</strong>. That is why identical files across commits can share the same blob.
        </p>
        <Flowchart
          title="commit → tree → blobs"
          chart={`flowchart TB
  C[Commit object — message, author, parent]
  T[Tree — project folder snapshot]
  B1[Blob — README.md contents]
  B2[Blob — main.py contents]
  C --> T
  T --> B1
  T --> B2`}
        />
        <ContentStep number={1} title="Blob">
          <p className="text-slate-300">
            Raw file contents (not the path). The name of the file lives in the tree.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Tree">
          <p className="text-slate-300">
            Maps names and modes to blobs (and nested trees for subfolders).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Commit">
          <p className="text-slate-300">
            Points at one root tree, records author/message/time, and usually points at a{' '}
            <strong className="text-white">parent</strong> commit.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Parent pointers = history chain">
        <p className="text-slate-300">
          Each new commit (except the first) remembers its parent. Walk parent → parent → … and you
          get the project story as a chain.
        </p>
        <Example title="Mental picture of a chain">
{`Commit C3  "Ship feature"     parent → C2
Commit C2  "Fix typo"          parent → C1
Commit C1  "Initial commit"    (no parent)`}
        </Example>
        <Callout variant="info" title="Hashes as labels">
          You will see IDs like <span className="font-mono text-sm text-core-400">a1b2c3d</span> in{' '}
          <span className="font-mono text-sm text-core-400">git log</span>. Those are shortened
          forms of the full object hash — the box label.
        </Callout>
      </LessonSection>

      <LessonSection title="What beginners should (and should not) do">
        <CodeBlock title="Use Git commands — not hand-editing objects">
{`git log --oneline
git cat-file -t HEAD        # advanced peek: object type
git rev-parse HEAD          # full hash of current commit`}
        </CodeBlock>
        <p className="text-slate-300">
          Peeking with plumbing commands is optional. Never delete files under{' '}
          <span className="font-mono text-sm text-core-400">.git/objects</span> to &quot;clean up.&quot;
          Let Git manage that storage.
        </p>
        <Callout variant="tip" title="Efficiency without the details">
          Git reuses blobs when file contents match. That is why many snapshots do not mean a full
          copy of every file every time — the locked-box model shares identical boxes.
        </Callout>
      </LessonSection>

      <LessonSection title="Putting the analogy together">
        <p className="text-slate-300">
          Imagine packing a project for storage. Each file&apos;s bytes go in a sealed box (blob).
          A packing list (tree) says &quot;hello.txt → box A, src/app.py → box B.&quot; A shipping
          label (commit) says who packed it, when, why, and which previous shipment this one builds
          on.
        </p>
        <Example title="Same content, same box">
{`# Commit 1 and Commit 5 both include identical LICENSE text
# → Git stores ONE blob for that content
# → Both trees point at the same hash label
# Change one character in LICENSE → brand-new blob + new hash`}
        </Example>
        <Callout variant="insight" title="Why this matters later">
          Commands like <span className="font-mono text-sm text-core-400">git checkout</span>,{' '}
          <span className="font-mono text-sm text-core-400">git reset</span>, and merges all move
          pointers among these objects. Once you picture commit → tree → blobs, those tools feel
          less like magic spells.
        </Callout>
        <CodeBlock title="You never type this by hand — for intuition only">
{`.git/objects/
  ab/cdef1234...   ← blob, tree, or commit data
# Directory split (ab/ + rest) is just how Git stores many files`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Commits live in .git/objects as content-addressed blobs, trees, and commits.',
          'Hashes label objects; same content → same hash.',
          'A commit points to a tree of blobs; parent pointers chain history.',
          'Understand the graph — you do not need to memorize on-disk formats.',
        ]}
      />
    </LessonArticle>
  )
}
