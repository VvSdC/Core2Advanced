import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherIam() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="IAM is the spine of your data platform">
        You moved from policy JSON syntax through evaluation logic, roles, STS, cross-account lakes,
        service-specific roles, org guardrails, and pipeline identity patterns. This checkpoint page
        connects those threads before you dive into EC2 and start attaching real compute to the
        permissions you can now read and reason about.
      </Callout>

      <Definition term="IAM mental model for data engineering">
        <p>
          Every API call in your lake — S3 GetObject, Glue StartJobRun, Redshift COPY — has a{' '}
          <strong className="text-white">principal</strong> authenticated by AWS and authorized by{' '}
          <strong className="text-white">policies</strong> (identity, resource, boundary, SCP). Prefer{' '}
          <strong className="text-white">roles + temporary credentials</strong> over static keys; prefer{' '}
          <strong className="text-white">customer managed policies</strong> and prefix-scoped Allows;
          remember <strong className="text-white">explicit Deny always wins</strong>.
        </p>
      </Definition>

      <LessonSection title="IAM map — intermediate through advanced">
        <Flowchart
          title="IAM sub-topic map"
          chart={`flowchart TB
  START[IAM complete path]
  START --> JSON[Policy JSON — Version Statement Effect Action Resource]
  START --> EVAL[Explicit deny and evaluation]
  START --> POL[Inline vs managed policies]
  START --> STS[AssumeRole and temporary credentials]
  START --> XACC[Cross-account roles and ExternalId]
  START --> SVC[Service roles — EC2 Lambda Glue Redshift]
  START --> CHAIN[Role chaining and STS deep dive]
  START --> GUARD[Permission boundaries and SCPs]
  START --> MOD[Access Analyzer Identity Center ABAC]
  START --> PIPE[IAM for data pipelines]
  JSON --> EC2NEXT
  EVAL --> EC2NEXT
  POL --> EC2NEXT
  STS --> EC2NEXT
  XACC --> EC2NEXT
  SVC --> EC2NEXT
  CHAIN --> EC2NEXT
  GUARD --> EC2NEXT
  MOD --> EC2NEXT
  PIPE --> EC2NEXT
  EC2NEXT[EC2 — compute next sub-topic]`}
        />
      </LessonSection>

      <LessonSection title="Full IAM checkpoint — can you explain…">
        <ContentStep number={1} title="Policy anatomy">
          <p className="text-slate-300">
            What is the difference between Action/Resource on an identity policy vs Principal on a bucket
            policy? When do you need a Condition on ListBucket vs GetObject?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Deny vs Allow">
          <p className="text-slate-300">
            Why does an SCP Deny on <span className="font-mono text-sm">s3:DeleteBucket</span> block a
            Glue role with AdministratorAccess? What is implicit deny?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Roles and STS">
          <p className="text-slate-300">
            What three fields make up temporary credentials? What is the difference between a role trust
            policy and its permission policies?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Cross-account">
          <p className="text-slate-300">
            In a central lake account, which account defines the read role trust vs permissions? Why use
            ExternalId with a third-party ETL vendor?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Service roles">
          <p className="text-slate-300">
            Which role does a Glue ETL script run as vs the Glue service role? How does Redshift COPY get
            S3 credentials?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Guardrails and scale">
          <p className="text-slate-300">
            How do permission boundaries differ from SCPs? How does ABAC with{' '}
            <span className="font-mono text-sm">env=prod</span> tags reduce policy sprawl?
          </p>
        </ContentStep>
        <ContentStep number={7} title="Pipeline design">
          <p className="text-slate-300">
            Why separate ingest, transform, and serve roles? Why should analysts use SSO roles instead of
            the Glue job role?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Deny vs Allow priority?',
                  'Explicit Deny in any applicable policy wins; no Allow overrides it; no match = implicit deny.',
                ],
                [
                  'Long-lived keys vs roles?',
                  'Roles issue temporary STS credentials; keys do not expire until rotated — avoid keys on Lambda/Glue/EC2.',
                ],
                [
                  'Cross-account S3 read steps?',
                  'Role in bucket account with S3 Allow + trust for caller; caller needs sts:AssumeRole; bucket policy may also Allow.',
                ],
                [
                  'Instance profile?',
                  'Wrapper attaching one IAM role to EC2; instance metadata delivers refreshed role credentials.',
                ],
                [
                  'Permission boundary vs SCP?',
                  'Boundary caps one user/role; SCP filters what an entire account/OU may permit org-wide.',
                ],
                [
                  'Confused deputy?',
                  'Third party tricks resource into granting access; mitigate with ExternalId in AssumeRole trust.',
                ],
                [
                  'Access Analyzer value?',
                  'Finds resource policies exposing access outside account/org — e.g. public S3 or broad role trust.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Ready for EC2 when…">
          You can sketch a three-stage pipeline diagram with role names and S3 prefixes, write a minimal
          S3 read policy for curated data, and explain why a failed Glue job might be SCP vs missing Allow
          — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — EC2">
        <p className="text-slate-300">
          EC2 is where IAM meets operating systems: instance profiles deliver role credentials to Airflow
          workers and custom ETL boxes; security groups (network layer) complement IAM (API layer). You
          will provision compute, attach profiles, and connect to the S3 landing zones whose bucket
          policies you can now author confidently. After EC2 the course continues deeper into S3, Lambda,
          Glue orchestration, and end-to-end projects — every module reuses the IAM vocabulary from this
          sub-topic.
        </p>
        <Flowchart
          title="After IAM — course thread"
          chart={`flowchart LR
  IAM[IAM checkpoint complete]
  IAM --> EC2[EC2 — instances and profiles]
  EC2 --> S3[S3 — lake storage policies]
  S3 --> COMPUTE[Lambda Glue — serverless ETL]
  COMPUTE --> WH[Redshift Athena — serve]
  WH --> PROJ[End-to-end DE project]`}
        />
        <Callout variant="insight">
          IAM is not a one-time lesson — revisit this checkpoint when designing a new dataset onboarding
          flow, a cross-account mesh, or an incident response runbook for exposed lake paths.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'IAM for DE = principals (humans via SSO, jobs via roles), policies (JSON + evaluation), and guardrails (boundaries, SCPs, Analyzer).',
          'Deny wins; use temporary credentials; scope S3 by prefix; split pipeline roles by stage; cross-account roles live in the resource account.',
          'Use the checkpoint questions and interview table before moving on — gaps here multiply pain in S3, Glue, and Redshift lessons.',
          'Next sub-topic: EC2 — instance profiles, security groups, and compute that runs your data workloads with least-privilege IAM.',
        ]}
      />
    </LessonArticle>
  )
}
