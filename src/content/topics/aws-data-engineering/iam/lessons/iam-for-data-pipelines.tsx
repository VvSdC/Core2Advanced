import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IamForDataPipelines() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Pipelines need identities too">
        A data pipeline is not only S3 paths and Glue scripts — it is a chain of{' '}
        <strong className="text-white">who</strong> is allowed to touch each stage. Mixing human SSO
        roles with job roles, or reusing one super-role for ingest and serve, creates audit nightmares
        and security debt. Design IAM like you design zones in the lake: separate, labeled, least-privilege.
      </Callout>

      <Definition term="Pipeline identity pattern">
        <p>
          A healthy AWS data pipeline uses <strong className="text-white">human SSO roles</strong> (via
          Identity Center) for interactive work — SQL in Athena, ad hoc Glue runs, Console debugging — and
          dedicated <strong className="text-white">job roles</strong> for automated stages: Lambda ingest,
          Glue transform, Redshift load. Humans should not share job role credentials; jobs should not
          inherit human AdministratorAccess.
        </p>
      </Definition>

      <LessonSection title="Human SSO roles vs job roles">
        <ContentStep number={1} title="Human SSO roles">
          <p className="text-slate-300">
            Permission sets like <span className="font-mono text-sm">DataAnalyst-ReadCurated</span> or{' '}
            <span className="font-mono text-sm">DataEngineer-DeployGlue</span>. Session-bound, attributed
            in CloudTrail, often read-only on prod curated data with write only in dev accounts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Job roles">
          <p className="text-slate-300">
            Non-interactive principals: <span className="font-mono text-sm">lambda-s3-ingest</span>,{' '}
            <span className="font-mono text-sm">glue-raw-to-curated</span>,{' '}
            <span className="font-mono text-sm">redshift-copy-curated</span>. No console login; permissions
            match exactly one automation path; rotate by redeploying policy, not by emailing keys.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Anti-pattern: one role to rule them all">
          <p className="text-slate-300">
            A shared <span className="font-mono text-sm">DataPlatformAdmin</span> role used by nightly Glue
            and by engineers in the Console cannot prove which actor deleted raw files. Split roles; use
            SSO for humans and narrow job roles for automation.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Separate roles per pipeline stage">
        <ContentStep number={1} title="Ingest">
          <p className="text-slate-300">
            Lambda or Kinesis consumer role: Allow <span className="font-mono text-sm">s3:PutObject</span>{' '}
            on <span className="font-mono text-sm">landing/*</span> only; no read on curated; no Glue admin.
            If ingest is compromised, attacker cannot truncate the warehouse.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Transform">
          <p className="text-slate-300">
            Glue job role: read <span className="font-mono text-sm">raw/*</span>, write{' '}
            <span className="font-mono text-sm">curated/*</span>, use connection secrets for JDBC; no
            PassRole to other roles; no S3 delete on archive unless explicitly required.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Serve">
          <p className="text-slate-300">
            Redshift associated role or Athena workgroup role: read curated paths only; no write to raw.
            Analyst SSO roles read the same prefixes via Athena or Spectrum without sharing the Glue job role.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Name roles after stage + dataset: <span className="font-mono text-sm">ingest-events-lambda</span>,{' '}
          <span className="font-mono text-sm">transform-sales-glue</span>,{' '}
          <span className="font-mono text-sm">serve-sales-redshift</span> — IAM becomes self-documenting in CloudTrail.
        </Callout>
      </LessonSection>

      <LessonSection title="End-to-end flow with role labels">
        <Flowchart
          title="Source → S3 → Glue → Athena/Redshift (IAM labels)"
          chart={`flowchart LR
  SRC[Source systems — API files streams]
  L[Lambda ingest role — PutObject landing]
  S3R[S3 raw prefix]
  G[Glue transform role — read raw write curated]
  S3C[S3 curated prefix]
  A[Athena SSO or workgroup role — read curated]
  R[Redshift COPY role — read curated]
  SRC --> L
  L --> S3R
  S3R --> G
  G --> S3C
  S3C --> A
  S3C --> R`}
        />
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Stage</th>
                <th className="px-4 py-3">Principal type</th>
                <th className="px-4 py-3">Typical actions</th>
                <th className="px-4 py-3">S3 scope</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Ingest', 'Lambda execution role', 'PutObject, maybe Kinesis read', 'landing/* only'],
                ['Transform', 'Glue job role', 'GetObject raw, PutObject curated, logs', 'raw/* read, curated/* write'],
                ['Catalog', 'Glue service / crawler role', 'Glue catalog, crawler S3 read', 'raw + curated list/read as needed'],
                ['Serve — SQL', 'SSO analyst or Athena role', 'GetObject, Athena query', 'curated/* read'],
                ['Serve — warehouse', 'Redshift IAM role', 'GetObject for COPY/Spectrum', 'curated/* read'],
              ].map(([stage, principal, actions, scope]) => (
                <tr key={stage} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{stage}</td>
                  <td className="px-4 py-3">{principal}</td>
                  <td className="px-4 py-3">{actions}</td>
                  <td className="px-4 py-3 font-mono text-xs">{scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Design review question: &quot;If this role credential leaks, which prefixes and which downstream
          services can an attacker reach?&quot; If the answer spans ingest through prod Redshift, split the role.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Use SSO permission sets for humans; dedicated job roles for Lambda, Glue, and Redshift automation — never share the same role.',
          'Split roles by pipeline stage: ingest (write landing), transform (raw → curated), serve (read curated only).',
          'Map each stage to explicit S3 prefix ARNs and service actions — flow: Source → Lambda → raw → Glue → curated → Athena/Redshift.',
          'CloudTrail session names and role naming conventions make pipeline IAM auditable under incident response.',
        ]}
      />
    </LessonArticle>
  )
}
