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

export function SecretRotation() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Change the lock regularly — without locking out the pipelines">
        A password that never changes is valid forever for anyone who ever saw it: an ex-contractor, an old
        laptop, a log file from 2022. <strong className="text-white">Rotation</strong> replaces the database
        password on a schedule and updates the secret at the same time, so jobs that fetch the secret at runtime
        keep working while leaked copies quietly stop working.
      </Callout>

      <Definition term="Secret rotation">
        <p>
          A Secrets Manager process that creates a new credential version, applies it to the target system (RDS,
          Redshift, an API), verifies it works, and then moves the <code className="text-core-400">AWSCURRENT</code>{' '}
          staging label to the new version. It runs on a schedule you define or on demand via{' '}
          <code className="text-core-400">RotateSecret</code>. Either the owning service manages it for you, or a
          rotation Lambda function does the work.
        </p>
      </Definition>

      <LessonSection title="How rotation works — four steps and staging labels">
        <ContentStep number={1} title="createSecret">
          <p className="text-slate-300">
            The rotation Lambda generates a new password and stores it as a new secret version labelled{' '}
            <code className="text-core-400">AWSPENDING</code>. Nothing uses it yet — AWSCURRENT still points to
            the old password.
          </p>
        </ContentStep>
        <ContentStep number={2} title="setSecret">
          <p className="text-slate-300">
            The Lambda connects to the database and changes the user&apos;s password to the AWSPENDING value (for
            example <code className="text-core-400">ALTER USER orders_reader WITH PASSWORD ...</code>). The Lambda
            must reach the database, so it usually runs in the same VPC.
          </p>
        </ContentStep>
        <ContentStep number={3} title="testSecret">
          <p className="text-slate-300">
            The Lambda logs in with the AWSPENDING credentials and runs a trivial query. If this fails, rotation
            stops, AWSCURRENT is untouched, and Secrets Manager emits a rotation failure event you should alert on.
          </p>
        </ContentStep>
        <ContentStep number={4} title="finishSecret">
          <p className="text-slate-300">
            AWSCURRENT moves to the new version; the old version gets{' '}
            <code className="text-core-400">AWSPREVIOUS</code>. Callers asking for the default version now get
            the new password. AWSPREVIOUS lets you roll back or debug.
          </p>
        </ContentStep>
        <Flowchart
          title="Rotation Lambda steps and labels"
          chart={`flowchart LR
  C[createSecret new version AWSPENDING]
  S[setSecret update DB password]
  T[testSecret login with pending]
  F[finishSecret move AWSCURRENT]
  P[Old version AWSPREVIOUS]
  FAIL[Rotation failed alert]
  C --> S
  S --> T
  T -->|ok| F
  F --> P
  T -->|error| FAIL`}
        />
      </LessonSection>

      <LessonSection title="Managed rotation vs rotation Lambdas">
        <ContentStep number={1} title="RDS manages the master password">
          <p className="text-slate-300">
            Setting <code className="text-core-400">ManageMasterUserPassword=true</code> on an RDS or Aurora
            instance makes RDS create and rotate the master secret itself (default every 7 days) — no Lambda to
            maintain. Redshift offers the same for its admin password. That secret holds only{' '}
            <code className="text-core-400">username</code> and <code className="text-core-400">password</code>,
            so pipelines still read host and port from Parameter Store or the DB endpoint.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Rotation function templates">
          <p className="text-slate-300">
            For application users like <code className="text-core-400">orders_reader</code>, the console can deploy
            AWS-provided rotation Lambdas for RDS (MySQL, PostgreSQL, others), Aurora, Redshift, and DocumentDB.
            For third-party API keys you write the four steps yourself against the vendor&apos;s API.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Schedule and rotation window">
          <p className="text-slate-300">
            <code className="text-core-400">ScheduleExpression</code> accepts{' '}
            <code className="text-core-400">rate(30 days)</code> or a{' '}
            <code className="text-core-400">cron()</code> expression, and{' '}
            <code className="text-core-400">Duration</code> sets a window (for example 2 hours) during which
            rotation may start. Put the window away from nightly batch loads so the change never lands mid-job.
          </p>
        </ContentStep>
        <Example title="CLI — enable rotation and managed master password" caption="Schedule every 30 days in a 2-hour window">
{`aws secretsmanager rotate-secret \\
  --secret-id de/prod/rds/orders-reader \\
  --rotation-lambda-arn arn:aws:lambda:us-east-1:111122223333:function:rds-pg-alternating-rotation \\
  --rotation-rules '{"ScheduleExpression":"cron(0 14 ? * SUN *)","Duration":"2h"}'

aws rds modify-db-instance \\
  --db-instance-identifier orders-prod \\
  --manage-master-user-password \\
  --apply-immediately`}
        </Example>
      </LessonSection>

      <LessonSection title="Single-user vs alternating-users strategy">
        <ContentStep number={1} title="Single user">
          <p className="text-slate-300">
            One database user; rotation changes its password in place. Simple, but between setSecret and the
            moment every client re-fetches, anything holding the old password in memory fails on its next new
            connection. Fine for low-traffic or tolerant clients.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Alternating users">
          <p className="text-slate-300">
            Two users — <code className="text-core-400">orders_reader</code> and{' '}
            <code className="text-core-400">orders_reader_clone</code>. Each rotation updates the user that is{' '}
            <em>not</em> current, then flips AWSCURRENT to it. The previous user&apos;s password stays valid until
            the next rotation, so a four-hour Glue job that fetched credentials at start keeps opening
            connections. Needs a separate admin secret the rotation Lambda uses to alter the clone user.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Clients re-fetch on authentication failure">
          <p className="text-slate-300">
            Whatever strategy you pick, code that caches a secret must treat an authentication error as
            &quot;maybe rotated&quot;: re-fetch the secret once, retry the connection, then fail loudly if it
            still does not work.
          </p>
        </ContentStep>
        <Example title="Re-fetch once on auth failure" caption="Pattern for Lambda or long Glue jobs">
{`import psycopg2

def connect_with_refresh(secret_id: str):
    creds = get_cached_secret(secret_id)
    try:
        return psycopg2.connect(host=creds["host"], user=creds["username"],
                                password=creds["password"], dbname=creds["dbname"])
    except psycopg2.OperationalError as e:
        if "password authentication failed" not in str(e):
            raise
        creds = get_cached_secret(secret_id, force_refresh=True)  # maybe rotated
        return psycopg2.connect(host=creds["host"], user=creds["username"],
                                password=creds["password"], dbname=creds["dbname"])`}
        </Example>
        <Callout variant="tip">
          Trigger a manual <code className="text-core-400">RotateSecret</code> in staging right after enabling
          rotation. Discovering that the rotation Lambda cannot reach the database is much cheaper there than
          during the first scheduled prod rotation.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Rotation limits how long a leaked credential stays useful and removes manual password changes.',
          'Rotation Lambdas run createSecret, setSecret, testSecret, finishSecret — AWSPENDING becomes AWSCURRENT, old becomes AWSPREVIOUS.',
          'ManageMasterUserPassword lets RDS and Aurora own master-password rotation with no Lambda to maintain.',
          'Alternating users keeps the previous credential valid, protecting long-running Glue jobs from mid-run lockout.',
          'Schedule rotation windows away from batch loads, and make clients re-fetch the secret on auth failure.',
        ]}
      />
    </LessonArticle>
  )
}
