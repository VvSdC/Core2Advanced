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

export function AuthenticationVsAuthorization() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two different questions">
        Security conversations mix these up constantly. Keep them separate:
        <strong className="text-white"> Authentication</strong> asks &quot;Who are you?&quot;{' '}
        <strong className="text-white">Authorization</strong> asks &quot;What are you allowed to do?&quot;
        AWS IAM handles both, but with different mechanisms — and confusing them makes debugging
        AccessDenied errors much harder.
      </Callout>

      <Definition term="Authentication (AuthN)">
        <p>
          <strong className="text-white">Authentication</strong> proves identity. You show a credential
          — password, MFA code, access key, or temporary token from STS — and AWS decides whether you
          are who you claim to be. Failed AuthN means you never get past the front door.
        </p>
      </Definition>

      <Definition term="Authorization (AuthZ)">
        <p>
          <strong className="text-white">Authorization</strong> decides permissions <em>after</em>{' '}
          identity is proven. IAM policies, resource policies, and permission boundaries answer: may this
          principal run Glue jobs, read <code className="text-core-400">s3://lake/raw/</code>, or delete
          a Redshift cluster?
        </p>
      </Definition>

      <LessonSection title="Everyday analogy — office building">
        <Example title="Badge vs door access" caption="AuthN first, then AuthZ">
{`Authentication (AuthN):
  Security desk checks your photo ID and issues a visitor badge
  → "We verified you are Alex from the analytics team"

Authorization (AuthZ):
  Your badge opens some doors, not others
  → Badge opens Floor 3 (read-only dashboards)
  → Badge does NOT open the server room (prod database admin)

AWS equivalent:
  AuthN: valid access key or assumed role session
  AuthZ: IAM policy allows s3:GetObject but denies s3:DeleteObject`}
        </Example>
        <p className="text-slate-300">
          You can authenticate successfully and still get blocked — that is an authorization failure. A
          valid Glue job role (AuthN passed) without S3 read permission (AuthZ failed) produces{' '}
          <code className="text-core-400">AccessDenied</code> on the first file read.
        </p>
      </LessonSection>

      <LessonSection title="AWS examples for data engineering">
        <ContentStep number={1} title="Analyst signs into the Console">
          <p className="text-slate-300">
            <strong className="text-white">AuthN:</strong> IAM user password + MFA at sign-in.{' '}
            <strong className="text-white">AuthZ:</strong> attached policies determine whether they see
            the Athena workgroup, can query the finance database, or only browse CloudWatch logs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lambda triggered by S3 upload">
          <p className="text-slate-300">
            <strong className="text-white">AuthN:</strong> Lambda assumes its execution role via STS —
            AWS trusts the Lambda service to hand temporary credentials to your function.{' '}
            <strong className="text-white">AuthZ:</strong> the role policy allows{' '}
            <code className="text-core-400">s3:GetObject</code> on the landing bucket and{' '}
            <code className="text-core-400">glue:StartJobRun</code> — nothing else.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue job on a schedule">
          <p className="text-slate-300">
            <strong className="text-white">AuthN:</strong> Glue service assumes the job role on your
            behalf — no human password involved.{' '}
            <strong className="text-white">AuthZ:</strong> role permissions scope which catalog
            databases and S3 prefixes the ETL script can touch.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Redshift COPY from S3">
          <p className="text-slate-300">
            <strong className="text-white">AuthN:</strong> Redshift uses an IAM role attached to the
            cluster (or an IAM role passed to the COPY command) to prove identity to S3.{' '}
            <strong className="text-white">AuthZ:</strong> that role must allow{' '}
            <code className="text-core-400">s3:GetObject</code> on the staging prefix and optionally{' '}
            <code className="text-core-400">kms:Decrypt</code> if files are SSE-KMS encrypted.
          </p>
        </ContentStep>
        <Flowchart
          title="AuthN then AuthZ on every API call"
          chart={`flowchart TB
  P[Principal — user role or service]
  P --> N{Authentication valid?}
  N -->|No| F1[InvalidClientTokenId or login failure]
  N -->|Yes| Z{Authorization — policies allow action?}
  Z -->|No| F2[AccessDenied]
  Z -->|Yes| OK[API succeeds — read S3 start Glue etc]`}
        />
      </LessonSection>

      <LessonSection title="How to debug when something fails">
        <p className="text-slate-300">
          Read the error message carefully. &quot;The security token included in the request is invalid&quot;
          usually points to AuthN — expired credentials, wrong key, clock skew. &quot;User is not
          authorized to perform&quot; or &quot;Access Denied&quot; on a specific action usually points to
          AuthZ — fix the policy, not the password.
        </p>
        <Callout variant="tip" title="CloudTrail is your friend">
          CloudTrail logs show <code className="text-core-400">eventName</code>,{' '}
          <code className="text-core-400">userIdentity</code> (who authenticated), and whether the call
          succeeded. When AuthZ fails, the error message often names the missing permission — add that
          action narrowly rather than attaching AdministratorAccess.
        </Callout>
        <Callout variant="insight">
          Interview sound bite: &quot;MFA and passwords authenticate humans; IAM policies authorize
          actions. Roles give services temporary AuthN credentials; policies define AuthZ.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Authentication (AuthN) = prove who you are. Authorization (AuthZ) = what you may do.',
          'Valid credentials with insufficient permissions → AccessDenied (AuthZ failure, not AuthN).',
          'Glue, Lambda, and Redshift use role assumption for AuthN; IAM policies define AuthZ.',
          'Debug AuthN vs AuthZ from error text; use CloudTrail to see which principal attempted which action.',
        ]}
      />
    </LessonArticle>
  )
}
