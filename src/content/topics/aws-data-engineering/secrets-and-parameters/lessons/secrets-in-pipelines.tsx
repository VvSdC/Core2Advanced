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

export function SecretsInPipelines() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Pass the address of the secret, never the secret itself">
        Most real leaks do not come from Secrets Manager — they come from the pipeline around it: a password in
        Step Functions input, a Glue argument, a Lambda environment variable, a log line. The rule that fixes
        almost all of them: move the secret <em>name or ARN</em> through the pipeline, and fetch the value only
        in the task that actually opens the connection.
      </Callout>

      <Definition term="Reference passing">
        <p>
          A pipeline design where orchestration layers (Step Functions, Airflow, CI/CD) carry only identifiers
          like <code className="text-core-400">de/prod/rds/orders-reader</code> or a parameter path, and the
          compute layer (Glue, Lambda, ECS) resolves them with its own IAM role at run time. Anything that is
          stored, displayed, or logged by the orchestrator is then harmless.
        </p>
      </Definition>

      <LessonSection title="Patterns vs anti-patterns across the stack">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Layer</th>
                <th className="px-4 py-3">Anti-pattern</th>
                <th className="px-4 py-3">Pattern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Step Functions', 'Password in execution input or state output', 'Pass secret ARN; task fetches it'],
                ['Glue job args', '--db_password in DefaultArguments', '--secret_id de/prod/rds/orders-reader'],
                ['Lambda env vars', 'DB_PASSWORD value, even with encryption helpers', 'DB_SECRET_ID name; fetch and cache'],
                ['ECS / Fargate', 'Password baked into image or plain environment', 'Task definition secrets from SM or SSM'],
                ['Airflow / MWAA', 'Connections typed into the metadata DB', 'Secrets Manager secrets backend'],
                ['dbt', 'Password committed in profiles.yml', 'env_var() filled from a secret at runtime'],
                ['CI/CD', 'Long-lived IAM access keys in CI settings', 'OIDC federation to assume a deploy role'],
              ].map(([layer, bad, good]) => (
                <tr key={layer} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{layer}</td>
                  <td className="px-4 py-3">{bad}</td>
                  <td className="px-4 py-3">{good}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Why Step Functions input is dangerous">
          <p className="text-slate-300">
            Execution history stores every state&apos;s input and output and shows it in the console to anyone
            with <code className="text-core-400">states:GetExecutionHistory</code>. A password passed in once is
            visible for the whole history retention period. Pass the ARN and let the Glue job or Lambda fetch.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why Lambda encryption helpers are not enough">
          <p className="text-slate-300">
            Lambda environment variables are encrypted at rest, and the console helpers can encrypt them with
            your own key, but anyone who can read the function configuration and decrypt sees the value, and it
            does not rotate. Store the secret name in the variable instead.
          </p>
        </ContentStep>
        <Example title="Step Functions — pass the reference, not the value" caption="History shows only the secret name">
{`"RunOrdersSilver": {
  "Type": "Task",
  "Resource": "arn:aws:states:::glue:startJobRun.sync",
  "Parameters": {
    "JobName": "orders-silver-etl",
    "Arguments": {
      "--secret_id": "de/prod/rds/orders-reader",
      "--config_path": "/de/prod/orders/",
      "--run_date.$": "$.run_date"
    }
  },
  "Next": "PublishSuccess"
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Containers, Airflow, and dbt">
        <ContentStep number={1} title="ECS task definition secrets">
          <p className="text-slate-300">
            ECS injects values from Secrets Manager or Parameter Store as environment variables at container
            start, using the <strong className="text-white">task execution role</strong>. You can select one JSON
            key from a secret. Values are fixed for the life of the task — a rotation needs a new task, or the
            app should fetch the secret itself. On EMR, fetch in the step or bootstrap script with the instance
            role.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Airflow and MWAA secrets backend">
          <p className="text-slate-300">
            Configure the Secrets Manager backend so Airflow resolves connection IDs like{' '}
            <code className="text-core-400">orders_rds</code> from secrets under{' '}
            <code className="text-core-400">airflow/connections/</code>. DAG code only names the connection.
          </p>
        </ContentStep>
        <ContentStep number={3} title="dbt profiles">
          <p className="text-slate-300">
            Keep <code className="text-core-400">profiles.yml</code> free of passwords by reading environment
            variables that a wrapper script fills from Secrets Manager right before{' '}
            <code className="text-core-400">dbt run</code>.
          </p>
        </ContentStep>
        <Example title="ECS secrets, MWAA backend, dbt profile" caption="Three tools, one idea — reference, then resolve">
{`// ECS task definition (container definition excerpt)
"secrets": [
  { "name": "DB_PASSWORD",
    "valueFrom": "arn:aws:secretsmanager:us-east-1:111122223333:secret:de/prod/rds/orders-reader-AbC123:password::" },
  { "name": "BATCH_SIZE",
    "valueFrom": "arn:aws:ssm:us-east-1:111122223333:parameter/de/prod/orders/batch_size" }
]

# MWAA Airflow configuration options
secrets.backend = airflow.providers.amazon.aws.secrets.secrets_manager.SecretsManagerBackend
secrets.backend_kwargs = {"connections_prefix": "airflow/connections", "variables_prefix": "airflow/variables"}

# dbt profiles.yml
acme_redshift:
  target: prod
  outputs:
    prod:
      type: redshift
      host: acme-wh.REPLACE_ME.us-east-1.redshift.amazonaws.com
      user: "{{ env_var('DBT_USER') }}"
      password: "{{ env_var('DBT_PASSWORD') }}"`}
        </Example>
      </LessonSection>

      <LessonSection title="CI/CD, logging, and going passwordless">
        <ContentStep number={1} title="OIDC instead of long-lived keys">
          <p className="text-slate-300">
            GitHub Actions, GitLab, and similar systems can exchange a short-lived OIDC token for temporary
            credentials via <code className="text-core-400">sts:AssumeRoleWithWebIdentity</code>. Restrict the
            role&apos;s trust policy to your repository and branch — there is no access key to leak.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Mask in logs">
          <p className="text-slate-300">
            Add a logging filter that redacts known secret values and keys named password or token. Never log
            full boto3 responses, Spark configs, or connection strings with embedded credentials.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Best secret is no secret">
          <p className="text-slate-300">
            <strong className="text-white">RDS IAM database authentication</strong> gives a 15-minute token from{' '}
            <code className="text-core-400">generate_db_auth_token</code>, and the{' '}
            <strong className="text-white">Redshift Data API</strong> runs SQL using the caller&apos;s IAM role —
            no stored password at all. Prefer these where your drivers and workloads allow.
          </p>
        </ContentStep>
        <Flowchart
          title="Reference passing through a pipeline"
          chart={`flowchart LR
  CI[CI via OIDC role]
  SFN[Step Functions input has ARN]
  GLUE[Glue job orders-silver-etl]
  SM[Secrets Manager]
  RDS[(RDS orders)]
  RSD[Redshift Data API IAM]
  CI --> SFN
  SFN -->|secret_id arg| GLUE
  GLUE -->|GetSecretValue| SM
  GLUE --> RDS
  GLUE --> RSD`}
        />
        <Callout variant="insight">
          Audit test: export a Step Functions execution history, a Glue job run, and a Lambda configuration, then
          search them for your database password. If it appears anywhere, the pipeline is passing values instead
          of references.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Orchestration carries secret names and ARNs; only the compute task resolves the value with its own role.',
          'Step Functions history and Glue job arguments are visible to many people — never put values there.',
          'Lambda env vars should hold DB_SECRET_ID, not DB_PASSWORD; encryption helpers do not add rotation.',
          'ECS task secrets, the MWAA secrets backend, and env_var() in dbt all follow reference-then-resolve.',
          'Use OIDC for CI/CD and IAM database auth or the Redshift Data API to remove passwords entirely.',
        ]}
      />
    </LessonArticle>
  )
}
