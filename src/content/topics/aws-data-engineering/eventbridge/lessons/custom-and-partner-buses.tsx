import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CustomAndPartnerBuses() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Not every event belongs on the default bus">
        AWS service events (S3, Glue, CloudTrail) arrive on the <strong className="text-white">default event
        bus</strong>. Data platforms add <strong className="text-white">custom buses</strong> for application
        lifecycle signals and consume <strong className="text-white">partner buses</strong> for SaaS feeds —
        isolating teams, permissions, and blast radius in multi-team lake architectures.
      </Callout>

      <Definition term="Event bus types">
        <p>
          <strong className="text-white">Default bus</strong> — one per account/Region; receives AWS service
          events automatically. <strong className="text-white">Custom bus</strong> — you create and publish
          application events; rules and targets scoped to that bus.{' '}
          <strong className="text-white">Partner bus</strong> — created when you associate a partner event
          source (Datadog, Zendesk, Auth0, etc.) — third-party events enter your account on a dedicated bus.
        </p>
      </Definition>

      <LessonSection title="Default vs custom vs partner">
        <ContentStep number={1} title="Default bus — AWS service events">
          <p className="text-slate-300">
            S3 Object Created, Glue Job State Change, EC2 state, CloudTrail API calls — all land here without
            publisher code. DE rules on the default bus react to infrastructure and managed service signals.
            Cannot rename or delete; shared across all teams in the account unless you replicate to custom buses.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Custom bus — your pipeline contracts">
          <p className="text-slate-300">
            Ingest team publishes{' '}
            <span className="font-mono text-sm">com.company.data/BronzeIngestComplete</span> with partition
            metadata. Analytics team creates rules on the same custom bus without IAM access to ingest Lambdas.
            Resource policies grant cross-account PutEvents. Archive and schema registry attach per bus.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Partner bus — SaaS into AWS">
          <p className="text-slate-300">
            Associate partner event source → dedicated partner bus. Example: observability or ticketing SaaS
            events trigger Lambda remediation in the data account. Less common in core ETL than custom buses
            but useful for unified ops automation across DE and platform teams.
          </p>
        </ContentStep>
        <Flowchart
          title="Three bus types in a data platform"
          chart={`flowchart TB
  subgraph default [Default bus per account]
    S3[S3 Object Created]
    GLUE[Glue Job State Change]
    CW[CloudTrail API calls]
  end
  subgraph custom [Custom bus data-platform]
    PUB[Ingest Lambda PutEvents]
    RULE1[Analytics team rule]
    RULE2[Quality team rule]
  end
  subgraph partner [Partner bus SaaS]
    SAAS[Partner event source]
    REM[Lambda remediation]
  end
  S3 --> RULEDEF[Default bus DE rules]
  GLUE --> RULEDEF
  PUB --> RULE1
  PUB --> RULE2
  SAAS --> REM`}
        />
      </LessonSection>

      <LessonSection title="When DE teams create custom buses">
        <ContentStep number={1} title="Multi-team lake ownership">
          <p className="text-slate-300">
            Ingest, quality, and consumption teams share one account but need separate rule namespaces. Custom
            bus <span className="font-mono text-sm">data-lifecycle-prod</span> carries curated-partition-ready,
            schema-breaking, and SLA-miss events — consumers subscribe with their own rules without editing
            producer infrastructure.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Environment and blast-radius isolation">
          <p className="text-slate-300">
            Sandbox publishers cannot accidentally trigger prod Step Functions if prod rules live on a prod-only
            custom bus with strict resource policy. Default bus mixes all AWS events — harder to segment than
            application events you control.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cross-account hub pattern">
          <p className="text-slate-300">
            Central platform account owns custom bus; workload accounts PutEvents via IAM and bus policy.
            Analytics account rules forward to local Lambda — no resource sharing of ingest Lambdas. Standard
            for Organizations landing zones with separate ingest/process/consume accounts.
          </p>
        </ContentStep>
        <ContentStep number={4} title="When default bus is enough">
          <p className="text-slate-300">
            Single team, single account, S3 + Glue + schedule only — default bus rules suffice. Adding custom
            bus adds IAM, policy, and IaC surface. Introduce custom bus when second team subscribes to your
            application events or cross-account publishing is required.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Publishing to custom bus: <span className="font-mono text-sm">events:PutEvents</span> with{' '}
          <span className="font-mono text-sm">EventBusName</span> — include{' '}
          <span className="font-mono text-sm">Source</span>,{' '}
          <span className="font-mono text-sm">DetailType</span>, and{' '}
          <span className="font-mono text-sm">Detail</span> JSON string. Rules on custom bus must specify that
          bus name — rules do not automatically see custom events on default bus.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Default bus: AWS service events (S3, Glue) — one per account/Region, no publisher code needed.',
          'Custom bus: application pipeline lifecycle events — team isolation, cross-account PutEvents, archives.',
          'Partner bus: SaaS integrations via associated partner event sources — ops automation less common in ETL core.',
          'Create custom bus when multi-team subscribers, cross-account hub, or prod/sandbox isolation is required.',
          'PutEvents to custom bus requires Source, DetailType, Detail; rules must target named bus explicitly.',
        ]}
      />
    </LessonArticle>
  )
}
