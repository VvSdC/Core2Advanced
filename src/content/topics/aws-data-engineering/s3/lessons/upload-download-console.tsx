import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function UploadDownloadConsole() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Learn the Console first — then automate">
        The AWS Console is the fastest way to see buckets, browse prefixes, and upload a test file without
        installing anything. Every click maps to an S3 API call you will later script with the CLI or
        Boto3. Master the mental model here; production pipelines rarely rely on manual uploads.
      </Callout>

      <Definition term="S3 Console">
        <p>
          The <strong className="text-white">S3 section</strong> of the AWS Management Console lets you
          create buckets, set Region and default encryption, browse objects by prefix, upload and download
          files, and inspect metadata. Search for &quot;S3&quot; in the top bar or open Services → Storage
          → S3.
        </p>
      </Definition>

      <LessonSection title="Create a dev bucket (one-time setup)">
        <ContentStep number={1} title="Open S3 and Create bucket">
          <p className="text-slate-300">
            Click <strong className="text-white">Create bucket</strong>. Name it something unique like{' '}
            <code className="text-core-400">yourname-lake-dev-2024</code>. Select the same Region as your
            EC2 sandbox (e.g. <code className="text-core-400">us-east-1</code>).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Block Public Access — leave ON">
          <p className="text-slate-300">
            Keep all four &quot;Block public access&quot; settings enabled for a data lake. Your analysts
            reach data through IAM and Athena, not anonymous internet downloads. Public buckets have caused
            major data leaks.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Default encryption — enable SSE-S3">
          <p className="text-slate-300">
            Enable server-side encryption with Amazon S3 managed keys (SSE-S3) or SSE-KMS for stricter
            audit trails. Encryption at rest is expected for any lake holding non-public data.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Tags">
          <p className="text-slate-300">
            Add <code className="text-core-400">Environment=dev</code> and{' '}
            <code className="text-core-400">Owner=you@company.com</code> — same habit as EC2 sandbox tags.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Object Ownership">
          Use &quot;Bucket owner enforced&quot; for ACLs disabled — modern best practice. Fine-grained
          access comes from IAM and bucket policies, not legacy object ACLs.
        </Callout>
      </LessonSection>

      <LessonSection title="Upload a file via Console">
        <ContentStep number={1} title="Navigate into the bucket">
          <p className="text-slate-300">
            Click your bucket name. You see an empty object list. The Console may show a{' '}
            <strong className="text-white">Create folder</strong> button — for learning, you can create{' '}
            <code className="text-core-400">raw</code> or upload directly with a key that includes slashes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Upload">
          <p className="text-slate-300">
            Click <strong className="text-white">Upload</strong> → <strong className="text-white">Add
            files</strong>. Select a small CSV or JSON sample from your laptop. Before confirming, expand
            <strong className="text-white"> Properties</strong> and set the destination key if needed — e.g.{' '}
            <code className="text-core-400">raw/sample/orders.csv</code> instead of flat{' '}
            <code className="text-core-400">orders.csv</code> at bucket root.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Confirm and verify">
          <p className="text-slate-300">
            After upload completes, browse to the <code className="text-core-400">raw/</code> prefix. Click
            the object name to open the detail panel: size, Last modified, Storage class (Standard), and
            the full key path.
          </p>
        </ContentStep>
        <Example title="What you just created" caption="Equivalent s3:// URI">
{`s3://yourname-lake-dev-2024/raw/sample/orders.csv`}
        </Example>
      </LessonSection>

      <LessonSection title="Download a file via Console">
        <ContentStep number={1} title="Select the object">
          <p className="text-slate-300">
            Check the box next to the object (or click into its detail page). Choose{' '}
            <strong className="text-white">Download</strong> or <strong className="text-white">Download
            as</strong> if the browser prompts for save location.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Open Object actions for more">
          <p className="text-slate-300">
            The <strong className="text-white">Object actions</strong> menu also offers Copy URI, Copy URL,
            and Open — useful for pasting an s3:// path into a Glue script or sharing with a teammate who
            has IAM access.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Multi-select download">
          <p className="text-slate-300">
            Select several objects and download as a zip for small batches. For hundreds of Parquet files,
            use the CLI <code className="text-core-400">aws s3 sync</code> instead — the Console does not
            scale.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Mental model — listing prefixes in the Console">
        <p className="text-slate-300">
          When you click a &quot;folder&quot; like <code className="text-core-400">raw/</code>, the Console
          sends a <code className="text-core-400">ListObjectsV2</code> request with prefix{' '}
          <code className="text-core-400">raw/</code> and delimiter <code className="text-core-400">/</code>.
          Results split into common prefixes (sub-folders) and object keys at that level.
        </p>
        <ContentStep number={1} title="Bucket root listing">
          <p className="text-slate-300">
            At the bucket root you might see prefixes <code className="text-core-400">raw/</code>,{' '}
            <code className="text-core-400">processed/</code>, and loose objects if any were uploaded
            without a prefix — avoid loose objects in real lakes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Drill down">
          <p className="text-slate-300">
            Inside <code className="text-core-400">raw/sample/</code> you see only objects whose keys start
            with that prefix. Sibling prefixes like <code className="text-core-400">raw/events/</code> do
            not appear — same behavior as <code className="text-core-400">aws s3 ls s3://bucket/raw/sample/</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Search and filter">
          <p className="text-slate-300">
            The Console search box filters visible keys. For programmatic filter by date or tag, use S3
            Inventory or Athena over a manifest — topics for later.
          </p>
        </ContentStep>
        <Callout variant="insight">
          If you upload to <code className="text-core-400">raw/orders.csv</code> but look inside a created
          folder named <code className="text-core-400">raw</code> without a trailing slash in your head,
          the object is still there — the key is the source of truth, not the UI breadcrumb alone.
        </Callout>
      </LessonSection>

      <LessonSection title="Console limits data engineers hit quickly">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Console OK?</th>
                <th className="px-4 py-3">Better tool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Upload one test CSV', 'Yes', 'Console or CLI cp'],
                ['Sync 10 GB local folder to raw/', 'Painful', 'aws s3 sync'],
                ['List 500 prefix partitions', 'Slow', 'CLI ls or Boto3 paginator'],
                ['Daily pipeline landing zone', 'No', 'Lambda, Kinesis Firehose, or Glue'],
                ['Inspect one object metadata', 'Yes', 'Console or aws s3api head-object'],
              ].map(([task, ok, better]) => (
                <tr key={task} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{task}</td>
                  <td className="px-4 py-3">{ok}</td>
                  <td className="px-4 py-3">{better}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Create dev buckets with public access blocked, encryption on, and tags — same hygiene as EC2.',
          'Upload sets an object key (path); download pulls bytes to your machine — both are S3 API calls.',
          'Console folders = ListObjects with prefix and delimiter — same mental model as aws s3 ls.',
          'Use Console to learn and debug; use CLI/Boto3 for bulk sync and automated pipelines.',
        ]}
      />
    </LessonArticle>
  )
}
