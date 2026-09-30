import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherSystemsManager() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Systems Manager for DE — access, config, patching, runbooks, and guardrails">
        You covered Patch Manager, State Manager associations, Automation runbooks, Inventory and Fleet Manager,
        port forwarding to private databases, operating ETL hosts and EMR, maintenance windows and Change
        Calendar, hybrid and multi-account operations, security and session logging, and how SSM compares with
        the alternatives. This closes the security and operations block — next is{' '}
        <strong className="text-white">API Gateway</strong>, the managed front door for ingestion and data APIs.
      </Callout>

      <Definition term="Systems Manager mental model for data engineering">
        <p>
          AWS Systems Manager is the <strong className="text-white">operations layer for the servers behind your
          pipelines</strong>: reach nodes without SSH (Session Manager, port forwarding), keep them in a desired
          state (State Manager, Patch Manager), fix them with code (Automation runbooks, alarms via EventBridge),
          know what runs where (Inventory to S3 and Athena), schedule and freeze change (maintenance windows,
          Change Calendar), and govern it all with tag-scoped IAM, session logs, and CloudTrail — while serverless
          services shrink how many servers you need at all.
        </p>
      </Definition>

      <LessonSection title="Systems Manager sub-topic map">
        <Flowchart
          title="Systems Manager lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[Systems Manager complete path]
  START --> PM[Patch Manager]
  START --> SM[State Manager associations]
  START --> AR[Automation runbooks]
  START --> INV[Inventory and Fleet Manager]
  START --> PF[Port forwarding to databases]
  START --> OPS[Operating ETL hosts and EMR]
  START --> MW[Maintenance windows and Change Calendar]
  START --> HY[Hybrid and multi account]
  START --> SEC[Security IAM session logging]
  START --> ALT[SSM vs alternatives]
  PM --> NEXT
  SM --> NEXT
  AR --> NEXT
  INV --> NEXT
  PF --> NEXT
  OPS --> NEXT
  MW --> NEXT
  HY --> NEXT
  SEC --> NEXT
  ALT --> NEXT
  NEXT[API Gateway next]`}
        />
      </LessonSection>

      <LessonSection title="Full Systems Manager checkpoint — can you explain…">
        <ContentStep number={1} title="Patching and desired state">
          <p className="text-slate-300">
            Predefined vs custom patch baseline? Patch groups vs Quick Setup patch policies? Scan vs Install and
            reboot options? How does an association keep new Auto Scaling workers configured and correct drift?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Automation and inventory">
          <p className="text-slate-300">
            Anatomy of a schemaVersion 0.3 runbook? How does an alarm trigger a runbook? Why an assume role? How
            would you find every host with an old JDBC driver using resource data sync and Athena?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Database access">
          <p className="text-slate-300">
            Draw laptop → Session Manager → jump host → private RDS. Which document and parameters? Which security
            group rules? How do you stop tunnel users from getting a shell?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Operating data hosts">
          <p className="text-slate-300">
            How do you make EMR nodes managed and debug a failing Spark job? Which tags drive ETL worker
            operations? Why must secrets never be Run Command parameters?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Scheduling and scale">
          <p className="text-slate-300">
            Maintenance window duration vs cutoff? How does a runbook respect a month-end Change Calendar? How are
            on-prem SFTP servers registered, and what changed with the advanced-instances tier in 2026? How does
            multi-account Automation target OUs?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Security and alternatives">
          <p className="text-slate-300">
            What does CloudTrail record vs session logs? Which VPC endpoints does a private subnet need? When
            would you pick EC2 Instance Connect Endpoint, Ansible, or immutable images instead — and when does a
            DE team barely need SSM?
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
                  'Why Session Manager over a bastion?',
                  'No inbound ports or SSH keys; IAM auth, CloudTrail, session transcripts, works in private subnets.',
                ],
                [
                  'Patch baseline?',
                  'Rules for approved patches — classification, severity, auto-approval delay, rejected list.',
                ],
                [
                  'Scan vs Install?',
                  'Scan reports compliance only; Install applies approved patches and may reboot — drain ETL first.',
                ],
                [
                  'State Manager vs Run Command?',
                  'Association re-applies desired state on a schedule and to new nodes; Run Command is one-off.',
                ],
                [
                  'Automation vs Step Functions?',
                  'Automation operates infrastructure with SSM-native steps; Step Functions orchestrates data workflows.',
                ],
                [
                  'Find hosts with an old driver?',
                  'Inventory file rules, resource data sync to S3, Glue crawler, Athena query joined with tags.',
                ],
                [
                  'Reach private RDS from a laptop?',
                  'AWS-StartPortForwardingSessionToRemoteHost via a tagged jump host; DB SG allows only jump SG.',
                ],
                [
                  'Restrict tunnel users?',
                  'StartSession limited by resource tag and to the port-forwarding document; SessionDocumentAccessCheck.',
                ],
                [
                  'Maintenance window cutoff?',
                  'Hours before window end when no new tasks start — keeps patching out of the nightly load.',
                ],
                [
                  'Change Calendar in runbooks?',
                  'aws:assertAwsResourceProperty calling GetCalendarState, continue only when OPEN.',
                ],
                [
                  'CloudTrail vs session logs?',
                  'CloudTrail: who called StartSession or SendCommand. Session logs in S3 or CloudWatch: what was typed.',
                ],
                [
                  'VPC endpoints for SSM?',
                  'ssm and ssmmessages (ec2messages for older agents), plus s3 gateway, logs, and kms as needed.',
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
        <Callout variant="tip" title="Ready for API Gateway when…">
          You can whiteboard a private ETL fleet with no inbound ports, tag-driven associations and patch
          policies, an alarm-triggered runbook, a port-forwarding path to <code className="text-core-400">orders-db-prod</code>,
          and the IAM plus logging that makes it auditable — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — API Gateway">
        <p className="text-slate-300">
          You now have the storage, compute, orchestration, security, and operations building blocks: IAM, S3,
          Lambda, Glue, Athena, Redshift, EventBridge, Step Functions, SQS, DynamoDB, Secrets Manager and
          Parameter Store, KMS, CloudTrail, and Systems Manager. The last two sub-topics cover how data enters and
          leaves the platform through code you own. <strong className="text-white">API Gateway</strong> puts a
          managed, authenticated, throttled HTTPS front door in front of ingestion — partners and apps POST
          events that land in SQS, Lambda, or <code className="text-core-400">acme-lake-prod</code> — and exposes
          curated data to internal consumers. After that, <strong className="text-white">ECS</strong> runs the
          containerized workers and batch jobs that do not fit Lambda or Glue.
        </p>
        <Flowchart
          title="After Systems Manager — APIs and containers"
          chart={`flowchart LR
  SRC[Partners and apps]
  API[API Gateway front door]
  ING[Ingest Lambda SQS EventBridge]
  LAKE[(S3 acme-lake-prod)]
  ETL[Glue Step Functions and ECS tasks]
  CAT[Glue Catalog and Athena]
  DW[(Redshift acme-dw-prod)]
  SEC[IAM KMS Secrets CloudTrail]
  OPS[CloudWatch SSM IaC]
  SRC --> API
  API --> ING
  ING --> LAKE
  LAKE --> ETL
  ETL --> CAT
  ETL --> DW
  SEC --> LAKE
  SEC --> DW
  OPS --> ETL
  OPS --> ING`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when you inherit a legacy ETL server, need prod database access without a
          bastion, or face an audit question about who ran what on a host — the answers trace back to sessions,
          associations, runbooks, and logging covered here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Systems Manager is the ops layer for pipeline servers: access, desired state, patching, runbooks, inventory.',
          'Intermediate: Patch Manager, State Manager associations, Automation runbooks, Inventory and Fleet Manager.',
          'Advanced: DB port forwarding, ETL and EMR operations, maintenance windows, hybrid and multi-account, security.',
          'Guardrails: tag-scoped IAM, document restrictions, session logging with KMS, VPC endpoints, CloudTrail.',
          'Next: API Gateway — the managed HTTPS front door for ingestion and data APIs, then ECS for containers.',
        ]}
      />
    </LessonArticle>
  )
}
