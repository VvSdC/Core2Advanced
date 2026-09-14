import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithIam() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why IAM comes right after fundamentals">
        You now know Regions, S3 buckets, and the shared responsibility model. The next question every
        data pipeline raises is: <strong className="text-white">who is allowed to do what?</strong>{' '}
        IAM (Identity and Access Management) is AWS&apos;s answer. It is the first &quot;real&quot; AWS
        skill after fundamentals because almost every service — Glue, Lambda, Redshift, Athena — checks
        IAM before it lets anyone read or write data.
      </Callout>

      <Definition term="What is IAM?">
        <p>
          <strong className="text-white">IAM</strong> is the AWS service that controls{' '}
          <strong className="text-white">identities</strong> (who) and{' '}
          <strong className="text-white">permissions</strong> (what they can do). It does not store your
          data lake files — it decides whether a Glue job, an analyst, or a Lambda function may call{' '}
          <code className="text-core-400">s3:GetObject</code> on a given bucket prefix.
        </p>
        <p className="mt-2 text-slate-300">
          Think of IAM as the <span className="text-core-400">bouncer and badge system</span> for your
          entire AWS account. No badge, no entry — even if the S3 bucket exists and the Glue script is
          perfect.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build IAM in layers so JSON policy syntax does not hit you on day one. Follow this order:
        </p>
        <ContentStep number={1} title="Identities — users, groups, roles">
          <p className="text-slate-300">
            Learn who can act in AWS: human IAM users, groups that bundle permissions, and roles that
            services and people <em>assume</em> for temporary access. Data engineers live in roles.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Policies — the permission documents">
          <p className="text-slate-300">
            Policies are JSON documents (we introduce the idea here, write them in later lessons) that
            say &quot;allow read on <code className="text-core-400">s3://lake/raw/*</code>&quot; or
            &quot;deny delete on production buckets.&quot;
          </p>
        </ContentStep>
        <ContentStep number={3} title="Assume role — temporary credentials">
          <p className="text-slate-300">
            Instead of embedding long-lived access keys in code, principals assume a role and receive
            short-lived credentials. Glue jobs, Lambda functions, and EC2 instances should almost always
            use roles.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Advanced patterns (later in the track)">
          <p className="text-slate-300">
            Permission boundaries, cross-account access, IAM Identity Center (SSO), and service control
            policies in Organizations — after you are comfortable with the basics.
          </p>
        </ContentStep>
        <Flowchart
          title="IAM sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[AuthN vs AuthZ]
  B --> C[Root user and MFA]
  C --> D[Users and groups]
  D --> E[Roles]
  E --> F[Policies overview]
  F --> G[Least privilege]
  G --> H[Putting it together]
  H --> I[Policy JSON — next module]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['User', 'A named identity for a person or app — often has long-lived access keys (avoid for production apps)'],
                ['Group', 'A container of users — attach one policy to the group instead of copying it to fifty analysts'],
                ['Role', 'An identity you assume temporarily — Glue jobs and Lambda functions use roles, not passwords'],
                ['Policy', 'A document listing Allow/Deny actions on resources — the rulebook IAM enforces'],
                ['Principal', 'Who is making the request — a user ARN, role session, or AWS service'],
                ['Credential', 'Proof of identity — password for Console, access key pair for CLI/SDK, or temporary STS tokens from a role'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Do not memorize ARNs yet">
          An ARN (Amazon Resource Name) is a unique string like{' '}
          <code className="text-core-400">arn:aws:iam::123456789012:role/GlueETLRole</code>. You will
          see them in policies and error messages. For now, know they identify a specific user, role, or
          resource across all of AWS.
        </Callout>
      </LessonSection>

      <LessonSection title="How a request flows through IAM">
        <p className="text-slate-300">
          Every AWS API call — uploading a file to S3, starting a Glue job, running a Redshift query —
          passes through IAM evaluation (plus resource policies like S3 bucket policies). If no policy
          allows the action, AWS returns <code className="text-core-400">AccessDenied</code>.
        </p>
        <Flowchart
          title="Human or app → AWS resource"
          chart={`flowchart LR
  H[Human analyst or app]
  H --> C[Credential — password key or role token]
  C --> I[IAM evaluates policies]
  I --> A[AWS API — s3:GetObject glue:StartJobRun]
  A --> R[Resource — S3 bucket Glue job Redshift]
  I -->|Deny or no Allow| X[AccessDenied]`}
        />
        <Callout variant="insight">
          When a Glue job fails with &quot;not authorized to perform s3:ListBucket&quot;, that is IAM
          doing its job — the job&apos;s role lacks permission. Fix the role policy, not the Spark
          script.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'IAM is the first hands-on AWS skill after fundamentals — every data service checks it before allowing access.',
          'This sub-topic moves from identities (users, groups, roles) → policies → assume role → advanced patterns.',
          'Core vocabulary: user, group, role, policy, principal, credential.',
          'Every API call: principal presents credentials → IAM evaluates policies → allow or AccessDenied.',
        ]}
      />
    </LessonArticle>
  )
}
