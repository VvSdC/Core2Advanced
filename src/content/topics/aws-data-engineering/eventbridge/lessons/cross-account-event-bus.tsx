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

export function CrossAccountEventBus() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Multi-account lakes need events to cross account boundaries">
        Organizations split <em>ingest</em>, <em>process</em>, and <em>consume</em> into separate accounts.
        <strong className="text-white"> Cross-account EventBridge</strong> lets landing events in the ingest
        account trigger Glue workflows in the processing account — without public S3 notifications or shared
        Lambda roles across every workload account.
      </Callout>

      <Definition term="Cross-account event bus">
        <p>
          An event bus in one account that accepts <span className="font-mono text-sm">PutEvents</span> from
          principals in other accounts via a <strong className="text-white">resource-based policy</strong> on
          the bus. Rules in the receiving account (or forwarding rules) route events to local targets — Lambda,
          Step Functions, SQS — with IAM scoped to the consumer account only.
        </p>
      </Definition>

      <LessonSection title="Patterns for multi-account data lakes">
        <ContentStep number={1} title="Central bus hub">
          <p className="text-slate-300">
            Platform account hosts custom bus <span className="font-mono text-sm">org-data-events</span>.
            Ingest account publishes S3-derived custom events after landing validation. Processing account
            rules trigger Glue. Consumption account rules refresh Athena views or notify BI tools — one event,
            many account-local targets via separate rules or event forwarding.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Direct bus policy on workload bus">
          <p className="text-slate-300">
            Processing account owns bus; ingest account gets{' '}
            <span className="font-mono text-sm">events:PutEvents</span> on bus ARN in resource policy. Simpler
            when one producer and one consumer — fewer hops than central hub. Update policy when adding new
            source accounts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Default bus forwarding">
          <p className="text-slate-300">
            Rule on ingest account default bus matches S3 Object Created → target is event bus in processing
            account (cross-account target). Processing account sees replicated event and runs local rules.
            Useful when producer should not run custom PutEvents code — native S3 events forward as-is.
          </p>
        </ContentStep>
        <Flowchart
          title="Cross-account S3 landing → process account Glue"
          chart={`flowchart LR
  subgraph ingest [Ingest account]
    S3I[(S3 landing bucket)]
    DEFI[Default bus]
    FWD[Rule forward to peer bus]
  end
  subgraph process [Process account]
    BUSP[Custom or default bus]
    RULEP[Rule prefix filter]
    GLUE[Glue workflow]
  end
  S3I --> DEFI
  DEFI --> FWD
  FWD --> BUSP
  BUSP --> RULEP
  RULEP --> GLUE`}
        />
      </LessonSection>

      <LessonSection title="IAM and policy checklist">
        <ContentStep number={1} title="Bus resource policy">
          <p className="text-slate-300">
            On receiving bus: allow source account root or specific role{' '}
            <span className="font-mono text-sm">events:PutEvents</span>. Optionally restrict by{' '}
            <span className="font-mono text-sm">aws:SourceAccount</span> and{' '}
            <span className="font-mono text-sm">aws:SourceArn</span> condition keys — prevent confused deputy.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Publisher IAM">
          <p className="text-slate-300">
            Lambda or application role in ingest account needs{' '}
            <span className="font-mono text-sm">events:PutEvents</span> on destination bus ARN. SCPs in
            Organizations must not deny cross-account events for approved data accounts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Target execution roles">
          <p className="text-slate-300">
            Rules and targets live in consumer account — execution role trusts{' '}
            <span className="font-mono text-sm">events.amazonaws.com</span> in that account. Glue job, S3
            paths, and secrets stay in process account; ingest account never needs Glue StartJobRun permission.
          </p>
        </ContentStep>
        <Example title="Bus policy sketch — allow ingest account PutEvents">
{`{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowIngestAccountPublish",
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::111122223333:root" },
    "Action": "events:PutEvents",
    "Resource": "arn:aws:events:us-east-1:444455556666:event-bus/data-platform-prod",
    "Condition": {
      "StringEquals": { "aws:SourceAccount": "111122223333" }
    }
  }]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="DE design considerations">
        <ContentStep number={1} title="Event payload contracts">
          <p className="text-slate-300">
            Cross-account events should carry bucket, key, dataset id, and run metadata — not presigned URLs or
            secrets. Consumer account resolves S3 via bucket policy or RAM-shared access. Version your{' '}
            <span className="font-mono text-sm">detail-type</span> for schema evolution.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Region alignment">
          <p className="text-slate-300">
            Event buses are Regional — ingest and process buckets in same Region unless you explicitly design
            cross-Region forwarding (additional latency and cost). Multi-Region DR duplicates bus rules per
            Region.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Observability per account">
          <p className="text-slate-300">
            Monitor <span className="font-mono text-sm">FailedInvocations</span> on forwarding rule in ingest
            and processing rule in target account. CloudWatch metrics do not cross accounts — dashboard in
            each account or central observability account via metric streams.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Interview pattern: landing zone with three accounts — S3 event on default bus → forward to process
          account bus → Glue silver ETL. Explain bus policy + publisher IAM + least-privilege target role.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cross-account: bus resource policy allows PutEvents from source account; publisher IAM + consumer rules/targets.',
          'Hub custom bus vs direct peer bus vs default-bus forwarding — choose by producer/consumer count.',
          'Forward S3 events as cross-account target when ingest should not run custom PutEvents publishers.',
          'Payload contracts: bucket/key/dataset id — resolve S3 access via bucket policy or RAM, not secrets in events.',
          'Regional buses; monitor FailedInvocations in both accounts; SCPs must allow approved cross-account events.',
        ]}
      />
    </LessonArticle>
  )
}
