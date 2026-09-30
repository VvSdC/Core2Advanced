import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithSecretsAndParameters() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why secrets management after Step Functions in the DE path">
        You just learned how Step Functions orchestrates Lambda, Glue, and Redshift steps into one reliable
        workflow. Look closely at what those steps actually do: a Glue job opens a JDBC connection to RDS, a
        Lambda calls a vendor API, a load step writes into Redshift or Snowflake. Every one of them needs a{' '}
        <strong className="text-white">password, token, or API key</strong>. The question is:{' '}
        <strong className="text-white">where do those credentials live so they never end up in the ASL
        definition, Lambda environment variables, Glue job arguments, or Git?</strong> The AWS answer is{' '}
        <strong className="text-white">Secrets Manager</strong> for credentials and{' '}
        <strong className="text-white">Systems Manager Parameter Store</strong> for configuration.
      </Callout>

      <Definition term="What are Secrets Manager and Parameter Store in a DE pipeline?">
        <p>
          <strong className="text-white">AWS Secrets Manager</strong> is a managed, KMS-encrypted store for
          credentials — database users, API keys, OAuth tokens — with versioning and built-in rotation.{' '}
          <strong className="text-white">AWS Systems Manager Parameter Store</strong> is a hierarchical
          key-value store for configuration — batch sizes, S3 prefixes, feature flags — that can also hold
          encrypted <code className="text-core-400">SecureString</code> values.
        </p>
        <p className="mt-2 text-slate-300">
          Think of them as{' '}
          <span className="text-core-400">the locked vault and the labeled filing cabinet for your pipeline —
          jobs ask for what they need at runtime, using their IAM role, instead of carrying secrets around</span>.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We start with the why and the vocabulary, then meet each service, compare them, and map them to real
          data engineering workloads before writing any code:
        </p>
        <ContentStep number={1} title="Why never hardcode credentials">
          <p className="text-slate-300">
            Walk through the real leak paths — Git commits, notebook outputs, CloudWatch logs, Glue job
            arguments, Lambda environment variables, and Step Functions execution history.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Secrets Manager and Parameter Store basics">
          <p className="text-slate-300">
            Learn what each service stores, how encryption with KMS works, how versions and labels behave, and
            what each one costs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Choosing between them">
          <p className="text-slate-300">
            Compare rotation, size limits, cost, and cross-account support — then adopt the common DE split:
            credentials in Secrets Manager, configuration in Parameter Store.
          </p>
        </ContentStep>
        <ContentStep number={4} title="DE inventory and checkpoint">
          <p className="text-slate-300">
            List the secrets a real platform needs, decide which IAM role reads which one, and confirm the
            basics before reading secrets in code, IAM policies, and rotation.
          </p>
        </ContentStep>
        <Flowchart
          title="Secrets and parameters sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[Why not hardcode]
  B --> C[What is Secrets Manager]
  C --> D[What is Parameter Store]
  D --> E[Comparison]
  E --> F[Secrets for DE]
  F --> G[Beginner checkpoint]
  G --> H[Code IAM rotation next]`}
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
                ['Secret', 'A named Secrets Manager entry, e.g. de/prod/rds/orders-reader — metadata plus one or more encrypted versions'],
                ['Secret value', 'The protected payload — usually a JSON string with keys like username, password, host, port, dbname'],
                ['Version', 'An immutable copy of the secret value; every update or rotation creates a new version with its own ID'],
                ['Staging label', 'A pointer to a version: AWSCURRENT is what apps read, AWSPREVIOUS is the last good value, AWSPENDING is mid-rotation'],
                ['Rotation', 'Automatically replacing a credential on a schedule — Secrets Manager updates the database password and the secret together'],
                ['Parameter', 'A named Parameter Store entry holding one value — String, StringList, or SecureString'],
                ['SecureString', 'A parameter type whose value is encrypted with a KMS key and only returned in plaintext when you ask for decryption'],
                ['Parameter path', 'A slash-separated hierarchy like /de/prod/orders/batch_size — lets you fetch or permission a whole subtree at once'],
                ['KMS key', 'The AWS Key Management Service key that encrypts secret values and SecureStrings — an AWS managed key or your own customer managed key'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Put team, environment, system, and purpose in every name: secret{' '}
          <code className="text-core-400">de/prod/rds/orders-reader</code> and parameter{' '}
          <code className="text-core-400">/de/prod/orders/batch_size</code>. Consistent prefixes let IAM grant
          a Glue role <code className="text-core-400">de/prod/*</code> and nothing else — and let on-call find
          the right secret at 2 a.m. without guessing.
        </Callout>
      </LessonSection>

      <LessonSection title="How secrets fit after Step Functions in a pipeline">
        <p className="text-slate-300">
          The state machine never carries a password. Each task runs with its own IAM role; at runtime the
          Lambda or Glue job calls Secrets Manager or Parameter Store, KMS decrypts the value for that role only,
          and the code connects to RDS, Redshift, or a vendor API. The ASL definition, execution input, and job
          arguments contain only names like <code className="text-core-400">de/prod/rds/orders-reader</code>.
        </p>
        <Flowchart
          title="Workflow task → IAM role → secret store → data system"
          chart={`flowchart LR
  SF[Step Functions workflow] --> LAM[Lambda task]
  SF --> GLUE[Glue job task]
  LAM --> ROLE[IAM execution role]
  GLUE --> ROLE
  ROLE --> SM[Secrets Manager]
  ROLE --> PS[Parameter Store]
  SM --> KMS[KMS decrypt]
  PS --> KMS
  GLUE --> RDS[RDS orders DB]
  GLUE --> RS[Redshift]
  LAM --> API[Vendor API]`}
        />
        <Callout variant="insight">
          Interview framing: IAM decides <em>who</em> may read a secret, KMS decides who may{' '}
          <em>decrypt</em> it, and Secrets Manager or Parameter Store decides <em>where</em> it lives and how it
          rotates. Pipelines pass names, never values.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care">
        <ContentStep number={1} title="Pipelines touch the most sensitive systems">
          <p className="text-slate-300">
            Source databases hold customer and payment data; warehouse loader accounts can overwrite curated
            tables. A leaked DE credential is often more damaging than a leaked app credential.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Rotation without redeploys">
          <p className="text-slate-300">
            When the RDS password rotates, every Glue job and Lambda that reads the secret at runtime picks up
            the new value automatically — no code change, no job argument edits, no emergency deploys.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Environment parity and audit">
          <p className="text-slate-300">
            The same job code reads <code className="text-core-400">/de/dev/...</code> or{' '}
            <code className="text-core-400">/de/prod/...</code> based on one environment parameter, and every
            read is logged in CloudTrail — auditors can see exactly which role fetched which secret.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Secrets management follows Step Functions because every workflow step — Glue JDBC, Lambda API calls, warehouse loads — needs credentials.',
          'Secrets Manager stores credentials with versions, staging labels, and rotation; Parameter Store stores hierarchical config and optional SecureStrings.',
          'Core vocabulary: secret, secret value, version, AWSCURRENT / AWSPREVIOUS / AWSPENDING, rotation, parameter, SecureString, path, KMS key.',
          'Pattern: workflow task → IAM role → Secrets Manager or Parameter Store → KMS decrypt → RDS, Redshift, or API — pipelines pass names, never values.',
          'Name everything with team and environment prefixes like de/prod/rds/orders-reader and /de/prod/orders/batch_size so IAM can scope access.',
        ]}
      />
    </LessonArticle>
  )
}
