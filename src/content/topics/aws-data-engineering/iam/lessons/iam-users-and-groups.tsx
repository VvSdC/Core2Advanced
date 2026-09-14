import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IamUsersAndGroups() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Humans and long-lived identities">
        IAM <strong className="text-white">users</strong> represent people (or occasionally legacy
        applications) that need a persistent identity in one AWS account. Groups bundle users so you
        attach permissions once. For modern data pipelines, services use <em>roles</em> instead — but
        analysts, admins, and break-glass operators still often sign in as IAM users or via SSO, which
        creates IAM users behind the scenes.
      </Callout>

      <Definition term="IAM user">
        <p>
          An <strong className="text-white">IAM user</strong> is a named identity with its own ARN, optional
          Console password, and optional access keys. It persists until you delete it. Best for humans
          signing into the Console; poor fit for Glue jobs or Lambda (use roles there).
        </p>
      </Definition>

      <Definition term="IAM group">
        <p>
          An <strong className="text-white">IAM group</strong> holds users — not other groups, not roles.
          Attach policies to the group; every member inherits them. Example:{' '}
          <code className="text-core-400">DataAnalysts</code> group with read-only Athena and specific S3
          prefix access.
        </p>
      </Definition>

      <LessonSection title="When IAM users still make sense">
        <ContentStep number={1} title="Individual Console access">
          <p className="text-slate-300">
            A data engineer debugging Glue crawlers in the Console needs a personal identity — not the
            root user. An IAM user (or SSO federated user) with MFA fits this pattern.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Small teams without SSO">
          <p className="text-slate-300">
            Startups sometimes create one IAM user per teammate before adopting IAM Identity Center. Still
            better than sharing one login.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Legacy scripts (migrate away)">
          <p className="text-slate-300">
            Old ETL scripts may use an IAM user&apos;s access keys embedded in cron. Plan to replace with
            an EC2 instance profile or Glue role — users with keys are a rotation and leak risk.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Trend: organizations move human access to IAM Identity Center (SSO) with Google/Okta login.
          Under the hood you still get IAM principals — but users do not manage separate AWS passwords.
        </Callout>
      </LessonSection>

      <LessonSection title="Groups as permission sets">
        <p className="text-slate-300">
          Without groups, adding a new analyst means copying five policies to a new user. With groups,
          you add the user to <code className="text-core-400">DataAnalysts</code> and they immediately
          match the team baseline.
        </p>
        <Example title="Sample group layout" caption="Data platform team">
{`Group: DataEngineers
  Policies: Glue full in dev, S3 read/write on lake dev prefixes,
            CloudWatch logs, IAM PassRole for Glue roles only

Group: DataAnalysts
  Policies: Athena query, S3 read on processed/ and curated/ only,
            deny write on raw/

Group: AccountAdmins
  Policies: IAM management, billing read — MFA required (advanced policy)

User: alex@company.com → member of DataEngineers
User: sam@company.com  → member of DataAnalysts`}
        </Example>
        <ContentStep number={1} title="One user, multiple groups">
          <p className="text-slate-300">
            A person can belong to several groups; effective permissions are the union of all attached
            policies (minus explicit Denies). Keep group names role-based, not project-based, to avoid
            policy sprawl.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Groups cannot be principals in policies">
          You reference users and roles in resource policies, not group names. Groups are an organization
          convenience inside IAM — AWS evaluates the user&apos;s policies at request time.
        </Callout>
      </LessonSection>

      <LessonSection title="Console password vs programmatic access">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Access type</th>
                <th className="px-4 py-3">Used for</th>
                <th className="px-4 py-3">Credential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['AWS Management Console', 'Clicking in the browser — Glue studio, S3 browser, IAM', 'Email/username + password + MFA'],
                ['AWS CLI / SDK / boto3', 'Scripts, CI/CD, local aws s3 cp', 'Access Key ID + Secret Access Key (or assumed role session)'],
              ].map(([type, used, cred]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{used}</td>
                  <td className="px-4 py-3">{cred}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          You can enable Console access only, programmatic only, or both for an IAM user. Analysts who
          only use Athena in the Console may not need access keys at all — reducing leak surface.
        </p>
      </LessonSection>

      <LessonSection title="Access keys — handle with care">
        <Definition term="Access key">
          <p>
            An <strong className="text-white">access key</strong> is a pair:{' '}
            <strong className="text-white">Access Key ID</strong> (public identifier, like a username) and{' '}
            <strong className="text-white">Secret Access Key</strong> (private, shown once at creation).
            Together they authenticate API calls the same way a password authenticates Console login.
          </p>
        </Definition>
        <ContentStep number={1} title="Rotate regularly">
          <p className="text-slate-300">
            Create a second key, update scripts and CI secrets, delete the old key. AWS recommends rotation
            — many orgs enforce max key age with IAM policies or Config rules.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Never commit to Git">
          <p className="text-slate-300">
            Bots scan GitHub for exposed keys within minutes. Use environment variables, Secrets Manager,
            or IAM roles in CI (OIDC to assume a deploy role). If a key leaks, deactivate it immediately
            and audit CloudTrail.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Prefer roles for applications">
          <p className="text-slate-300">
            A boto3 script running on an EC2 box with an instance profile, or a GitHub Action assuming a
            role, avoids static keys entirely. This is the data-engineering default for anything automated.
          </p>
        </ContentStep>
        <Example title="Bad vs good pattern" caption="Local ETL script">
{`Bad — long-lived user key in code:
  s3 = boto3.client('s3',
      aws_access_key_id='AKIA...',
      aws_secret_access_key='wJalr...')

Good — default credential chain picks up role:
  # On EC2/Lambda/CloudShell: role credentials auto
  s3 = boto3.client('s3')

Good — local dev assumes a role:
  aws sts assume-role --role-arn arn:aws:iam::123:role/DevDataEngineer ...`}
        </Example>
        <Callout variant="tip" title="Access Key Last Used">
          IAM → Users → Security credentials tab shows when each key was last used. Delete unused keys —
          they are liability without purpose.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'IAM users are persistent human (or legacy app) identities; groups bundle users for shared permissions.',
          'Use groups like DataAnalysts and DataEngineers — attach policies once, add members as people join.',
          'Console access uses password + MFA; programmatic access uses access keys or (preferably) assumed roles.',
          'Rotate keys, never commit them, delete unused keys — prefer roles for Glue, Lambda, EC2, and CI.',
        ]}
      />
    </LessonArticle>
  )
}
