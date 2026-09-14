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

export function PuttingItTogetherIamBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before policy JSON">
        You now know AuthN vs AuthZ, why root is off-limits, how users and groups differ from roles, the
        three policy types, and least privilege. This lesson ties those threads into one mental model with
        a small data-platform scenario — so when JSON syntax appears next, you already know{' '}
        <em>what</em> you are writing and <em>why</em>.
      </Callout>

      <Definition term="IAM mental model">
        <p>
          Every AWS action involves a <strong className="text-white">principal</strong> with{' '}
          <strong className="text-white">credentials</strong>, evaluated against{' '}
          <strong className="text-white">policies</strong>, to reach a{' '}
          <strong className="text-white">resource</strong>. Humans authenticate with password + MFA (or
          SSO); services assume <strong className="text-white">roles</strong> for temporary credentials.
          Policies on identities and resources together decide Allow or Deny.
        </p>
      </Definition>

      <LessonSection title="The full picture — one diagram">
        <Flowchart
          title="IAM mental model for a data lake"
          chart={`flowchart TB
  subgraph Humans["Human identities"]
    U1[IAM user or SSO — analyst]
    U2[IAM user — data engineer]
  end
  subgraph Machines["Machine identities — roles"]
    R1[GlueETLRole]
    R2[LambdaIngestRole]
  end
  subgraph Policies["Policies"]
    P1[Identity policies on users and roles]
    P2[S3 bucket policy on company-lake]
    P3[Trust policies on roles]
  end
  subgraph Resources["Resources"]
    S3[S3 lake — raw processed curated]
    GLUE[Glue jobs and catalog]
    RS[Redshift cluster]
  end
  U1 --> P1
  U2 --> P1
  R1 --> P3
  R2 --> P3
  R1 --> P1
  R2 --> P1
  P1 --> S3
  P1 --> GLUE
  P2 --> S3
  P1 --> RS`}
        />
      </LessonSection>

      <LessonSection title="Mini scenario — analyst vs ETL job">
        <p className="text-slate-300">
          Imagine <code className="text-core-400">company-lake</code> with three prefixes:{' '}
          <code className="text-core-400">raw/</code> (PII landing),{' '}
          <code className="text-core-400">processed/</code> (ETL output),{' '}
          <code className="text-core-400">curated/</code> (business-ready tables). Two identities interact
          with the lake daily.
        </p>
        <ContentStep number={1} title="Sam — business analyst (human)">
          <p className="text-slate-300">
            Sam is in the <code className="text-core-400">DataAnalysts</code> IAM group (or SSO group mapped
            to IAM). <strong className="text-white">AuthN:</strong> Console login with MFA.{' '}
            <strong className="text-white">AuthZ:</strong> group policies allow Athena queries on{' '}
            <code className="text-core-400">curated/</code>, deny writes to{' '}
            <code className="text-core-400">raw/</code>. Sam never receives access keys — Console only.
          </p>
        </ContentStep>
        <ContentStep number={2} title="NightlyETL — Glue job (machine)">
          <p className="text-slate-300">
            The Glue job runs as <code className="text-core-400">GlueETLRole</code>.{' '}
            <strong className="text-white">AuthN:</strong> Glue assumes the role via trust policy on{' '}
            <code className="text-core-400">glue.amazonaws.com</code>.{' '}
            <strong className="text-white">AuthZ:</strong> role identity policy allows read{' '}
            <code className="text-core-400">raw/*</code>, write{' '}
            <code className="text-core-400">processed/*</code>, no delete, no curated write. No human
            password involved.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lambda bridge (optional third actor)">
          <p className="text-slate-300">
            A Lambda on S3 upload validates files in <code className="text-core-400">landing/</code>, then
            starts the Glue job. Its <code className="text-core-400">LambdaIngestRole</code> trusts{' '}
            <code className="text-core-400">lambda.amazonaws.com</code>, reads landing objects, calls{' '}
            <code className="text-core-400">glue:StartJobRun</code> — nothing else.
          </p>
        </ContentStep>
        <Example title="Side-by-side comparison" caption="Analyst vs ETL">
{`                    Sam (analyst)          NightlyETL (Glue)
Identity type:        IAM user / SSO         IAM role
Credential:           Password + MFA         Temporary STS token
Typical access:       Athena read curated    S3 read raw, write processed
Long-lived keys?      No                     No (role only)
Group membership?     DataAnalysts group       N/A — role per job
If compromised:       One user's queries     One pipeline's paths — not whole account`}
        </Example>
        <Flowchart
          title="Scenario request flows"
          chart={`flowchart LR
  subgraph AnalystPath["Sam runs Athena"]
    A1[Sam MFA login] --> A2[IAM user policies]
    A2 --> A3[Athena query curated tables]
    A3 --> A4[S3 read curated via query role]
  end
  subgraph ETLPath["NightlyETL Glue job"]
    E1[EventBridge schedule] --> E2[Glue assumes GlueETLRole]
    E2 --> E3[Read raw write processed]
    E3 --> E4[CloudWatch logs success]
  end`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="Why not use root for the Glue job?">
          <p className="text-slate-300">
            Root has unlimited power, no least privilege, and cannot be scoped. A job should use a role
            with prefix-limited S3 access.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AuthN vs AuthZ for the Lambda">
          <p className="text-slate-300">
            AuthN: Lambda service assumes the execution role. AuthZ: identity policy lists allowed S3 and
            Glue actions.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Where would a bucket policy help?">
          <p className="text-slate-300">
            If another AWS account&apos;s Redshift needs to read <code className="text-core-400">curated/</code>,
            add a resource-based bucket policy trusting that account&apos;s role — in addition to the role&apos;s
            identity policy.
          </p>
        </ContentStep>
        <ContentStep number={4} title="What if Sam needs raw access temporarily?">
          <p className="text-slate-300">
            Do not attach AdministratorAccess. Use a break-glass role with MFA, time-bound access, and
            approval — advanced topic, but the beginner instinct (&quot;just give admin&quot;) is always wrong.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Ready for JSON when…">
          You can sketch Sam and NightlyETL on a whiteboard — label principal, credential type, trust vs
          permissions policy, and S3 prefixes — without opening the IAM Console. Then the next lesson on
          policy JSON will feel like syntax, not magic.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next">
        <p className="text-slate-300">
          The next lessons in the IAM track introduce <strong className="text-white">policy JSON</strong>{' '}
          structure: <code className="text-core-400">Effect</code>,{' '}
          <code className="text-core-400">Action</code>, <code className="text-core-400">Resource</code>,{' '}
          <code className="text-core-400">Condition</code> keys for S3 prefixes and MFA. You will write
          the GlueETLRole and DataAnalysts policies as real documents, test them in IAM Policy Simulator,
          and connect to S3 bucket policies in the storage module.
        </p>
        <p className="mt-4 text-slate-300">
          After IAM solidifies, the course moves to EC2 and S3 — where resource policies and encryption
          meet the roles you design here. Every pipeline component you build later will reuse this mental
          model: who is the principal, what credential, which policies, which resource ARNs.
        </p>
        <Callout variant="insight">
          Strong IAM beginners do not memorize every action name. They ask: human or machine? Role or user?
          Identity policy, resource policy, or both? Start narrow? Those questions prevent 90% of production
          access incidents.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Mental model: principal + credential → policy evaluation → resource; humans use users/SSO, machines use roles.',
          'Analyst (Sam): group-based AuthZ, MFA, read curated. ETL (Glue): role assumption, read raw/write processed only.',
          'Trust policies enable assumption; identity and bucket policies authorize actions — often both needed cross-account.',
          'Next up: policy JSON syntax, simulator testing, then S3 where bucket policies meet role design.',
        ]}
      />
    </LessonArticle>
  )
}
