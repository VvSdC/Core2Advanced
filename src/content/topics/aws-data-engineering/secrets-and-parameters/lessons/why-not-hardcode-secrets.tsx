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

export function WhyNotHardcodeSecrets() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="“It is only in the dev branch” — famous last words">
        Almost every credential leak starts with a shortcut: a password pasted into a Glue script to get a
        demo working, an API key in a Lambda environment variable, a connection string printed while debugging.
        None of these feel dangerous in the moment. This lesson walks through the{' '}
        <strong className="text-white">real paths credentials leak through in data pipelines</strong> and the
        simple model that closes all of them at once.
      </Callout>

      <Definition term="Hardcoded credential">
        <p>
          A <strong className="text-white">hardcoded credential</strong> is any password, token, or key whose
          plaintext value is written into something other than a dedicated secret store — source code,
          notebooks, config files, environment variables, job arguments, workflow input, or container images.
          Once written there, it is copied everywhere that artifact goes, and you no longer control who can read
          it.
        </p>
      </Definition>

      <LessonSection title="Real leak paths in DE work">
        <ContentStep number={1} title="Git commits">
          <p className="text-slate-300">
            Automated bots scan public repositories continuously — exposed AWS keys and database passwords are
            often found and abused within minutes of a push. Deleting the line later does not help: the value
            stays in Git history, forks, and clones.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Notebook outputs">
          <p className="text-slate-300">
            A Glue or SageMaker notebook cell that prints a connection dictionary saves the password in the
            notebook output. The notebook gets exported, shared, or committed — and the secret travels with it.
          </p>
        </ContentStep>
        <ContentStep number={3} title="CloudWatch logs">
          <p className="text-slate-300">
            <code className="text-core-400">print(config)</code> or logging the full JDBC URL writes the
            password into log streams that many engineers and log shipping tools can read — often retained for
            months.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Glue job default arguments">
          <p className="text-slate-300">
            Passing <code className="text-core-400">--db_password</code> as a job argument makes it visible in
            the Glue console and to anyone allowed to call <code className="text-core-400">glue:GetJob</code> or
            view job runs.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Lambda plaintext environment variables">
          <p className="text-slate-300">
            Environment variables are encrypted at rest, but anyone with{' '}
            <code className="text-core-400">lambda:GetFunctionConfiguration</code> — including read-only console
            users — sees them in plaintext.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Step Functions execution history">
          <p className="text-slate-300">
            Execution input and every state&apos;s input and output are stored in execution history. A password
            passed as workflow input is readable by anyone who can view executions.
          </p>
        </ContentStep>
        <ContentStep number={7} title="Docker images and chat pastes">
          <p className="text-slate-300">
            A <code className="text-core-400">.env</code> file baked into an ECR image ships with every pull; a
            password pasted into Slack to &quot;quickly unblock&quot; a teammate lives in chat search forever.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Blast radius and rotation pain">
        <p className="text-slate-300">
          A leaked reader credential for the orders database exposes every customer row that user can
          select. A leaked Redshift loader credential can truncate curated tables. Worse, hardcoded secrets are
          usually <strong className="text-white">shared</strong> — the same password copied into five Glue jobs,
          two Lambdas, and a notebook.
        </p>
        <ContentStep number={1} title="You cannot rotate what you cannot find">
          <p className="text-slate-300">
            Changing the password means hunting through repos, job arguments, and environment variables. Miss
            one and a nightly pipeline fails at 3 a.m. — so teams stop rotating, and the password lives for years.
          </p>
        </ContentStep>
        <ContentStep number={2} title="No audit trail">
          <p className="text-slate-300">
            When a password sits in a file, nobody knows who read it or when. A secret store logs every{' '}
            <code className="text-core-400">GetSecretValue</code> call in CloudTrail with the calling role.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Treat any credential that ever appeared in plaintext outside the vault as compromised: rotate it
          first, then clean up history. Cleanup without rotation only hides the evidence.
        </Callout>
      </LessonSection>

      <LessonSection title="The better model — IAM role, fetch at runtime">
        <p className="text-slate-300">
          The job carries only a <strong className="text-white">secret name</strong>. Its IAM role is allowed to
          read that one secret. At runtime the code fetches the value, keeps it in memory, uses it, and never
          logs it. Rotation changes the vault, not the code.
        </p>
        <Flowchart
          title="Hardcoded vs runtime fetch"
          chart={`flowchart TB
  subgraph BAD[Hardcoded]
    CODE1[Glue script with password] --> GIT[Git history]
    CODE1 --> LOGS[CloudWatch logs]
    CODE1 --> ARGS[Job arguments]
  end
  subgraph GOOD[Runtime fetch]
    CODE2[Glue script with secret name] --> ROLE[IAM role]
    ROLE --> SM[Secrets Manager]
    SM --> MEM[Value in memory only]
    MEM --> RDS[RDS orders DB]
  end`}
        />
        <Example title="Bad vs good — Glue job connecting to RDS" caption="Same job, two approaches">
{`# BAD: password in code, Git, and logs
DB_USER = "orders_reader"
DB_PASSWORD = "example-password"          # leaks via Git and every copy of the script
print(f"Connecting as {DB_USER} with {DB_PASSWORD}")   # leaks via CloudWatch

# GOOD: only the secret name travels; IAM role grants read access
import json, boto3

sm = boto3.client("secretsmanager")
resp = sm.get_secret_value(SecretId="de/prod/rds/orders-reader")
creds = json.loads(resp["SecretString"])   # keys: username, password, host, port, dbname

print(f"Connecting to {creds['host']} as {creds['username']}")   # never log the password`}
        </Example>
        <Callout variant="tip" title="Guardrails that catch mistakes early">
          Add a pre-commit secret scanner, enable GitHub secret scanning, and review Glue job arguments and
          Lambda environment variables in code review. Cheap automated checks catch most leaks before they
          reach a remote.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Credentials leak through Git, notebook outputs, CloudWatch logs, Glue job arguments, Lambda env vars, Step Functions history, images, and chat.',
          'Public repos are scanned by bots within minutes — deleting a committed secret does not remove it from history.',
          'Hardcoded secrets are copied everywhere, so rotation becomes a risky hunt and teams stop rotating.',
          'Better model: code carries a secret name, the IAM role grants read access, the value is fetched at runtime and never logged.',
          'Any credential that appeared in plaintext outside the vault should be rotated immediately.',
        ]}
      />
    </LessonArticle>
  )
}
