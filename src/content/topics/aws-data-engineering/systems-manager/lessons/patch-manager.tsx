import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PatchManager() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Patch the servers behind your pipelines — without breaking the 2 a.m. load">
        Every EC2 ETL worker, SFTP landing host, and database jump box needs OS security patches. Doing that by
        SSHing in and running <code className="text-core-400">dnf update</code> does not scale and leaves no
        record. <strong className="text-white">Patch Manager</strong> decides which patches are approved, scans
        or installs them across tagged fleets, and reports compliance — so you can prove to security that{' '}
        <code className="text-core-400">Role=etl-worker</code> hosts are patched, and still finish the nightly
        load on time.
      </Callout>

      <Definition term="Patch Manager">
        <p>
          A Systems Manager tool that applies a <strong className="text-white">patch baseline</strong> (rules for
          which patches are approved or rejected) to managed nodes using the{' '}
          <code className="text-core-400">AWS-RunPatchBaseline</code> document. It can{' '}
          <strong className="text-white">Scan</strong> (report missing patches, change nothing) or{' '}
          <strong className="text-white">Install</strong> (apply approved patches, optionally reboot), and
          records per-node patch compliance you can view in the console or export for querying.
        </p>
      </Definition>

      <LessonSection title="Patch baselines — what counts as approved">
        <ContentStep number={1} title="AWS predefined baselines">
          <p className="text-slate-300">
            Each supported OS ships with an AWS-managed default baseline, for example{' '}
            <code className="text-core-400">AWS-AmazonLinux2023DefaultPatchBaseline</code>. Predefined baselines
            typically auto-approve security patches of Critical and Important severity after a short delay
            (seven days on the Amazon Linux defaults at the time of writing). You cannot edit them — check the
            rules in the console before assuming what they approve.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Custom baselines for data hosts">
          <p className="text-slate-300">
            A custom baseline lets you choose classifications (Security, Bugfix), severities, an{' '}
            <strong className="text-white">auto-approval delay</strong> in days or a fixed cutoff date, explicit
            approved and rejected package lists, and the compliance level reported when a patch is missing.
            Typical DE choice: security patches only, approved after 7 days in prod (3 in dev), and a rejected
            entry for a kernel or JDK build known to break a Spark or JDBC driver.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why the delay matters">
          <p className="text-slate-300">
            The auto-approval delay gives dev and staging ETL hosts time to run a few nightly loads on the new
            packages before prod picks them up. Same baseline, different delays per environment, is a cheap
            canary process.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">AWS predefined baseline</th>
                <th className="px-4 py-3">Custom baseline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Editable', 'No — AWS maintains it', 'Yes — your rules and lists'],
                ['Approval rules', 'Fixed per OS', 'Classification, severity, delay or cutoff date'],
                ['Reject a bad package', 'Not possible', 'Rejected patches list'],
                ['Best for', 'Getting started, dev accounts', 'Prod data hosts with change control'],
              ].map(([aspect, predefined, custom]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{predefined}</td>
                  <td className="px-4 py-3">{custom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Targeting — patch groups, tags, and patch policies">
        <ContentStep number={1} title="Patch groups">
          <p className="text-slate-300">
            The classic way to map nodes to a custom baseline: tag nodes with{' '}
            <code className="text-core-400">Patch Group</code> (or <code className="text-core-400">PatchGroup</code>{' '}
            when instance metadata tags are enabled), for example <code className="text-core-400">etl-prod</code>,
            then register that patch group with your baseline. Nodes with no patch group fall back to the default
            baseline for their OS.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Patch policies via Quick Setup">
          <p className="text-slate-300">
            The newer, recommended approach: a Quick Setup <strong className="text-white">patch policy</strong>{' '}
            defines baselines per OS, a scan schedule, an install schedule, reboot behavior, and targets (tags,
            accounts, OUs, Regions) in one place. Pick one method per node — mixing patch groups and patch policies
            on the same hosts makes it hard to tell which baseline actually applied.
          </p>
        </ContentStep>
        <Flowchart
          title="How a node gets its patch baseline"
          chart={`flowchart TB
  NODE[EC2 ETL worker Role etl-worker]
  POL{Covered by patch policy}
  PG{Has Patch Group tag}
  PPB[Policy baseline for its OS]
  CUS[Custom baseline for etl-prod]
  DEF[AWS default baseline for OS]
  RUN[AWS-RunPatchBaseline Scan or Install]
  NODE --> POL
  POL -->|yes| PPB
  POL -->|no| PG
  PG -->|yes| CUS
  PG -->|no| DEF
  PPB --> RUN
  CUS --> RUN
  DEF --> RUN`}
        />
      </LessonSection>

      <LessonSection title="Scan vs Install with AWS-RunPatchBaseline">
        <ContentStep number={1} title="Scan daily, install on a schedule">
          <p className="text-slate-300">
            <code className="text-core-400">Operation=Scan</code> is safe to run any time — it compares installed
            packages with the baseline and updates compliance. <code className="text-core-400">Operation=Install</code>{' '}
            applies approved patches and, with <code className="text-core-400">RebootOption=RebootIfNeeded</code>,
            reboots when a patch requires it. Use <code className="text-core-400">NoReboot</code> only if you
            reboot separately; otherwise the node reports patches as installed-pending-reboot.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compliance reporting">
          <p className="text-slate-300">
            After each run, nodes report Compliant or Non-compliant with missing-patch counts by severity.
            Export via resource data sync to S3 and query with Athena — the same way you query any other lake
            dataset (covered in the Inventory lesson).
          </p>
        </ContentStep>
        <Example title="Scan all prod ETL workers" caption="Rate-controlled Run Command using AWS-RunPatchBaseline">
{`aws ssm send-command \\
  --document-name "AWS-RunPatchBaseline" \\
  --targets "Key=tag:Role,Values=etl-worker" "Key=tag:Env,Values=prod" \\
  --parameters "Operation=Scan" \\
  --max-concurrency "25%" \\
  --max-errors "1" \\
  --output-s3-bucket-name "acme-ssm-output-prod" \\
  --comment "Daily patch scan - ETL workers"

# Later, check compliance for one node
aws ssm describe-instance-patch-states \\
  --instance-ids i-0abc123def4567890`}
        </Example>
      </LessonSection>

      <LessonSection title="Rebooting ETL workers safely — or not patching at all">
        <ContentStep number={1} title="Drain before you reboot">
          <p className="text-slate-300">
            A reboot in the middle of a Spark or Python batch job kills it. Before Install: stop the worker from
            pulling new SQS messages (or pause its schedule), wait for in-flight jobs to finish, then patch.
            Keep installs outside the nightly load window (for example 00:00–05:00 UTC) and away from month-end.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Roll through the fleet">
          <p className="text-slate-300">
            Use max concurrency (one node or 10% at a time) and max errors of 1 so a bad patch stops after the
            first failure instead of taking down every worker. Maintenance windows (advanced lessons) wrap this
            into a scheduled, repeatable job.
          </p>
        </ContentStep>
        <ContentStep number={3} title="The immutable alternative">
          <p className="text-slate-300">
            Instead of patching in place, rebuild: EC2 Image Builder produces a patched golden AMI, the launch
            template points at it, and an Auto Scaling instance refresh replaces workers. No drift, easy
            rollback, tested image. Tradeoff: you need stateless workers and a bake-and-test pipeline. Many
            teams do both — immutable rebuilds monthly, Patch Manager Scan daily to prove compliance in between.
          </p>
        </ContentStep>
        <Callout variant="insight">
          For data hosts, &quot;patched&quot; is only half the goal — &quot;patched without missing an
          SLA&quot; is the real one. Treat patching as a pipeline dependency: schedule it, drain first, and alert
          to <code className="text-core-400">de-alerts-prod</code> when a patch run fails.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Patch baselines decide what is approved — predefined baselines are fixed; custom baselines add severity rules, delays, and rejected packages.',
          'Target with patch groups or Quick Setup patch policies — pick one method per node.',
          'AWS-RunPatchBaseline Scan is read-only and safe daily; Install changes packages and may reboot.',
          'Drain ETL workers and roll through the fleet with concurrency and error limits — never patch during nightly loads.',
          'Immutable golden AMIs are a strong alternative for stateless workers; Scan still proves compliance.',
        ]}
      />
    </LessonArticle>
  )
}
